package com.namcms.order.controller;

import com.namcms.order.client.ProductServiceClient;
import com.namcms.order.model.Order;
import com.namcms.order.model.OrderDetail;
import com.namcms.order.repository.OrderDetailRepository;
import com.namcms.order.repository.OrderRepository;
import com.namcms.shared.dto.ApiResponse;
import com.namcms.shared.dto.CreateOrderRequest;
import com.namcms.shared.dto.OrderItemRequest;
import com.namcms.shared.helper.VnPayHelper;
import com.namcms.shared.helper.EmailService;
import com.namcms.shared.dto.OrderItemInfo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductServiceClient productServiceClient;

    @Autowired
    private EmailService emailService;

    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash-secret}")
    private String vnp_HashSecret;

    @Value("${vnpay.base-url}")
    private String vnp_BaseUrl;

    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        List<Order> list = orderRepository.findAll();
        for (Order o : list) {
            o.setStatusText(getStatusString(o.getStatus()));
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Order o = orderRepository.findById(id).orElse(null);
        if (o == null) {
            return ResponseEntity.notFound().build();
        }
        o.setStatusText(getStatusString(o.getStatus()));
        return ResponseEntity.ok(o);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody CreateOrderRequest request, HttpServletRequest servletRequest) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng phải có ít nhất 1 sản phẩm."));
        }

        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setNotes(request.getNotes());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingName(request.getShippingName());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerName(request.getCustomerName());
        order.setStatus(0); // Chờ duyệt

        // Save order to generate ID
        order = orderRepository.save(order);

        double total = 0.0;
        for (OrderItemRequest item : request.getItems()) {
            // Get product price via HTTP call to Product Service
            Double price;
            try {
                price = productServiceClient.getProductPrice(item.getProductId());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm ID " + item.getProductId() + " không tồn tại."));
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrderId(order.getId());
            detail.setProductId(item.getProductId());
            detail.setQuantity(item.getQuantity());
            detail.setUnitPrice(price);
            orderDetailRepository.save(detail);

            total += price * item.getQuantity();

            // Deduct stock via HTTP call to Product Service
            try {
                productServiceClient.deductStock(item.getProductId(), item.getQuantity());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Không thể trừ tồn kho: " + e.getMessage()));
            }
        }

        order.setTotal(total);
        order = orderRepository.save(order);

        // If VNPay, return URL
        if ("VNPay".equalsIgnoreCase(request.getPaymentMethod())) {
            String ipAddress = servletRequest.getRemoteAddr();
            String paymentUrl = VnPayHelper.createPaymentUrl(
                    vnp_TmnCode, vnp_HashSecret, vnp_BaseUrl, vnp_ReturnUrl,
                    String.valueOf(order.getId()), (long) total, ipAddress
            );
            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(ApiResponse.success("Vui lòng thanh toán qua VNPay.", response));
        }

        // Send COD/Other order confirmation email
        sendOrderConfirmationEmailSafe(order);

        return ResponseEntity.ok(ApiResponse.success("Đặt đơn hàng thành công!", order));
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody Integer status) {
        Order o = orderRepository.findById(id).orElse(null);
        if (o == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng không tồn tại."));
        }
        o.setStatus(status);
        orderRepository.save(o);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công!", null));
    }

    @GetMapping("/vnpay-callback")
    @Transactional
    public void vnPayCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> requestParams = new HashMap<>();
        Map<String, String[]> requestMap = request.getParameterMap();
        for (String key : requestMap.keySet()) {
            requestParams.put(key, requestMap.get(key)[0]);
        }

        boolean isValid = VnPayHelper.validateCallback(vnp_HashSecret, requestParams);
        String orderIdStr = requestParams.get("vnp_TxnRef");
        String responseCode = requestParams.get("vnp_ResponseCode");
        String transactionId = requestParams.get("vnp_TransactionNo");

        if (isValid && "00".equals(responseCode) && orderIdStr != null) {
            Integer orderId = Integer.parseInt(orderIdStr);
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order != null) {
                if (order.getTransactionId() == null || order.getTransactionId().isEmpty()) {
                    order.setStatus(1); // Đã thanh toán (Giao hàng)
                    order.setTransactionId(transactionId);
                    orderRepository.save(order);
                    
                    // Send VNPay order confirmation email
                    sendOrderConfirmationEmailSafe(order);
                }
            }
            // Redirect back to client shop success page
            response.sendRedirect("http://localhost:5174/?checkout=success");
        } else {
            // Redirect back with fail
            response.sendRedirect("http://localhost:5174/?checkout=failed");
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getByCustomer(@PathVariable Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Order o : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", o.getId());
            orderMap.put("orderDate", o.getOrderDate());
            orderMap.put("status", o.getStatus());
            orderMap.put("notes", o.getNotes());
            orderMap.put("shippingAddress", o.getShippingAddress());
            orderMap.put("shippingPhone", o.getShippingPhone());
            orderMap.put("shippingName", o.getShippingName());
            orderMap.put("statusText", getStatusString(o.getStatus()));

            List<OrderDetail> details = orderDetailRepository.findByOrderId(o.getId());
            List<Map<String, Object>> itemsList = new ArrayList<>();
            double total = 0.0;

            for (OrderDetail od : details) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("productId", od.getProductId());
                itemMap.put("quantity", od.getQuantity());
                itemMap.put("unitPrice", od.getUnitPrice());

                // Fetch product name and image from Product Service
                Map<String, Object> productDetails = productServiceClient.getProductDetails(od.getProductId());
                if (productDetails != null) {
                    itemMap.put("productName", productDetails.get("name"));
                    itemMap.put("productImage", productDetails.get("imageUrl"));
                } else {
                    itemMap.put("productName", "Sản phẩm #" + od.getProductId());
                    itemMap.put("productImage", "");
                }

                itemsList.add(itemMap);
                total += od.getUnitPrice() * od.getQuantity();
            }

            orderMap.put("items", itemsList);
            orderMap.put("total", total);
            responseList.add(orderMap);
        }

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/vnpay-return")
    @Transactional
    public ResponseEntity<?> vnPayReturn(HttpServletRequest request) {
        Map<String, String> requestParams = new HashMap<>();
        Map<String, String[]> requestMap = request.getParameterMap();
        for (String key : requestMap.keySet()) {
            requestParams.put(key, requestMap.get(key)[0]);
        }

        boolean isValid = VnPayHelper.validateCallback(vnp_HashSecret, requestParams);
        if (!isValid) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Chữ ký không hợp lệ."));
        }

        String orderIdStr = requestParams.get("vnp_TxnRef");
        String responseCode = requestParams.get("vnp_ResponseCode");
        String transactionId = requestParams.get("vnp_TransactionNo");

        if (orderIdStr != null) {
            Integer orderId = Integer.parseInt(orderIdStr);
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order != null) {
                if ("00".equals(responseCode)) {
                    if (order.getTransactionId() == null || order.getTransactionId().isEmpty()) {
                        order.setStatus(1); // Đang giao
                        order.setTransactionId(transactionId);
                        order.setNotes((order.getNotes() != null ? order.getNotes() : "") + "\n[VNPay] Thanh toán thành công. Mã GD: " + transactionId);
                        orderRepository.save(order);
                        
                        // Send VNPay order confirmation email
                        sendOrderConfirmationEmailSafe(order);
                    }
                    return ResponseEntity.ok(Map.of("success", true, "orderId", order.getId()));
                } else {
                    order.setNotes((order.getNotes() != null ? order.getNotes() : "") + "\n[VNPay] Thanh toán thất bại. Mã lỗi: " + responseCode);
                    orderRepository.save(order);
                    return ResponseEntity.ok(Map.of("success", false, "orderId", order.getId(), "errorCode", responseCode));
                }
            }
        }

        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Đơn hàng không hợp lệ."));
    }

    private void sendOrderConfirmationEmailSafe(Order order) {
        try {
            if (order.getCustomerEmail() == null || order.getCustomerEmail().isEmpty()) {
                System.out.println("[EMAIL WARNING] Không có địa chỉ email của khách hàng cho đơn hàng #" + order.getId());
                return;
            }
            List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
            List<OrderItemInfo> items = new ArrayList<>();
            for (OrderDetail od : details) {
                String productName = "Sản phẩm #" + od.getProductId();
                try {
                    java.util.Map<String, Object> detailsMap = productServiceClient.getProductDetails(od.getProductId());
                    if (detailsMap != null && detailsMap.get("name") != null) {
                        productName = detailsMap.get("name").toString();
                    }
                } catch (Exception e) {
                    System.err.println("[EMAIL WARNING] Không thể lấy thông tin sản phẩm #" + od.getProductId() + ": " + e.getMessage());
                }
                items.add(new OrderItemInfo(productName, od.getQuantity(), od.getUnitPrice()));
            }

            emailService.sendOrderConfirmationEmailAsync(
                order.getCustomerEmail(),
                order.getCustomerName() != null ? order.getCustomerName() : order.getShippingName(),
                order.getId(),
                order.getOrderDate(),
                order.getShippingName(),
                order.getShippingPhone(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                items,
                order.getTotal()
            );
            System.out.println("[EMAIL] Đang gửi email xác nhận đơn hàng #" + order.getId() + " đến " + order.getCustomerEmail());
        } catch (Exception e) {
            System.err.println("[EMAIL ERROR] Không thể gửi email xác nhận đơn hàng #" + order.getId() + ": " + e.getMessage());
        }
    }

    private String getStatusString(int status) {
        switch (status) {
            case 0: return "Chờ duyệt";
            case 1: return "Đang giao";
            case 2: return "Đã xong";
            default: return "Không xác định";
        }
    }
}
