using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.Extensions.Configuration;

namespace CMS.Backend.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrdersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (request.CustomerId <= 0 || request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { message = "Thông tin đơn hàng không hợp lệ." });
            }

            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0, // Chờ duyệt
                Notes = request.Notes,
                ShippingAddress = request.ShippingAddress,
                ShippingPhone = request.ShippingPhone,
                ShippingName = request.ShippingName,
                PaymentMethod = request.PaymentMethod
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            decimal totalAmount = 0;
            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    var detail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };
                    _context.OrderDetails.Add(detail);
                    totalAmount += product.Price * item.Quantity;
                }
            }

            await _context.SaveChangesAsync();

            string vnpayUrl = "";
            if (request.PaymentMethod == "VNPay")
            {
                string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                var baseUrl = _configuration["VNPay:BaseUrl"];
                var tmnCode = _configuration["VNPay:TmnCode"];
                var hashSecret = _configuration["VNPay:HashSecret"];
                var returnUrl = _configuration["VNPay:ReturnUrl"];

                vnpayUrl = Helpers.VnPayHelper.BuildPaymentUrl(
                    baseUrl,
                    tmnCode,
                    hashSecret,
                    returnUrl,
                    ipAddress,
                    order.Id.ToString(),
                    totalAmount,
                    $"Thanh toan don hang #{order.Id}"
                );
                Console.WriteLine($"[VNPAY URL] {vnpayUrl}");
            }

            return Ok(new
            {
                message = request.PaymentMethod == "VNPay" ? "Tạo đơn hàng thành công, đang chuyển hướng thanh toán..." : "Đặt hàng thành công!",
                orderId = order.Id,
                vnpayUrl = vnpayUrl
            });
        }

        // GET: api/orders/vnpay-return
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            var query = Request.Query;
            var hashSecret = _configuration["VNPay:HashSecret"];
            
            bool isValidSignature = Helpers.VnPayHelper.ValidateCallback(hashSecret, query);
            if (!isValidSignature)
            {
                return BadRequest(new { success = false, message = "Chữ ký không hợp lệ." });
            }

            string txnRef = query["vnp_TxnRef"];
            string responseCode = query["vnp_ResponseCode"];
            string transactionNo = query["vnp_TransactionNo"];

            if (int.TryParse(txnRef, out int orderId))
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .FirstOrDefaultAsync(o => o.Id == orderId);
                if (order != null)
                {
                    if (responseCode == "00")
                    {
                        if (string.IsNullOrEmpty(order.TransactionId))
                        {
                            order.TransactionId = transactionNo;
                            order.Notes = (order.Notes ?? "") + $"\n[VNPay] Thanh toán thành công. Mã GD: {transactionNo}, Ngày: {DateTime.Now}";

                            // Trừ số lượng sản phẩm tồn kho
                            if (order.OrderDetails != null)
                            {
                                foreach (var detail in order.OrderDetails)
                                {
                                    var product = await _context.Products.FindAsync(detail.ProductId);
                                    if (product != null)
                                    {
                                        product.StockQuantity -= detail.Quantity;
                                        if (product.StockQuantity < 0)
                                        {
                                            product.StockQuantity = 0;
                                        }
                                    }
                                }
                            }
                            await _context.SaveChangesAsync();
                        }
                        return Ok(new { success = true, orderId = order.Id });
                    }
                    else
                    {
                        order.Notes = (order.Notes ?? "") + $"\n[VNPay] Thanh toán thất bại. Mã lỗi: {responseCode}, Ngày: {DateTime.Now}";
                        await _context.SaveChangesAsync();
                        return Ok(new { success = false, orderId = order.Id, errorCode = responseCode });
                    }
                }
            }

            return BadRequest(new { success = false, message = "Đơn hàng không hợp lệ." });
        }

        // GET: api/orders/customer/5
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    o.ShippingAddress,
                    o.ShippingPhone,
                    o.ShippingName,
                    StatusText = o.Status == 0 ? "Chờ duyệt" : o.Status == 1 ? "Đang giao" : "Đã xong",
                    Items = o.OrderDetails!.Select(od => new
                    {
                        od.ProductId,
                        ProductName = od.Product != null ? od.Product.Name : "",
                        ProductImage = od.Product != null ? od.Product.ImageUrl : "",
                        od.Quantity,
                        od.UnitPrice
                    }).ToList(),
                    Total = o.OrderDetails!.Sum(od => od.Quantity * od.UnitPrice)
                })
                .ToListAsync();

            return Ok(orders);
        }
    }

    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ShippingPhone { get; set; }
        public string? ShippingName { get; set; }
        public string PaymentMethod { get; set; } = "COD";
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
