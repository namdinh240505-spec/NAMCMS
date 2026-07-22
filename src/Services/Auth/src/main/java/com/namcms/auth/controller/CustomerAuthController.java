package com.namcms.auth.controller;

import com.namcms.auth.model.Customer;
import com.namcms.auth.model.CustomerAddress;
import com.namcms.auth.model.PasswordResetToken;
import com.namcms.auth.repository.CustomerRepository;
import com.namcms.auth.repository.CustomerAddressRepository;
import com.namcms.auth.repository.PasswordResetTokenRepository;
import com.namcms.auth.security.JwtTokenUtil;
import com.namcms.shared.dto.*;
import com.namcms.shared.helper.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/customerauth")
public class CustomerAuthController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerAddressRepository customerAddressRepository;

    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email đã được sử dụng."));
        }

        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPasswordHash(request.getPassword()); // Plain password for compatibility
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        customerRepository.save(customer);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng ký thành công!");
        response.put("customer", customer);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustomerLoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail()).orElse(null);
        if (customer == null || !customer.getPasswordHash().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Email hoặc mật khẩu không chính xác!"));
        }

        String token = jwtTokenUtil.generateToken(customer.getEmail(), "Customer");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng nhập thành công!");
        response.put("token", token);
        response.put("customer", customer);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail()).orElse(null);
        if (customer == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email không tồn tại trong hệ thống."));
        }

        // Clean previous tokens
        resetTokenRepository.deleteByEmail(request.getEmail());

        // Generate 6-digit random code
        String code = String.format("%06d", new Random().nextInt(999999));
        
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(request.getEmail());
        token.setCode(code);
        token.setExpiration(LocalDateTime.now().plusMinutes(15));

        resetTokenRepository.save(token);

        // Send Email
        emailService.sendPasswordResetEmailAsync(request.getEmail(), code);

        return ResponseEntity.ok(ApiResponse.success("Mã xác thực đã được gửi qua email.", null));
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyResetCodeRequest request) {
        PasswordResetToken token = resetTokenRepository.findByEmailAndCode(request.getEmail(), request.getCode()).orElse(null);
        if (token == null || token.getExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã xác thực không hợp lệ hoặc đã hết hạn."));
        }
        return ResponseEntity.ok(ApiResponse.success("Xác thực mã thành công.", null));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        PasswordResetToken token = resetTokenRepository.findByEmailAndCode(request.getEmail(), request.getCode()).orElse(null);
        if (token == null || token.getExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã xác thực không hợp lệ hoặc đã hết hạn."));
        }

        Customer customer = customerRepository.findByEmail(request.getEmail()).orElse(null);
        if (customer == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy khách hàng tương ứng."));
        }

        customer.setPasswordHash(request.getNewPassword());
        customerRepository.save(customer);

        // Cleanup
        resetTokenRepository.deleteByEmail(request.getEmail());

        return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công.", null));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Integer id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer id, @RequestBody UpdateProfileRequest request) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            customer.setPasswordHash(request.getPassword());
        }

        customerRepository.save(customer);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cập nhật thông tin thành công!");
        response.put("customer", customer);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{customerId}/addresses")
    public ResponseEntity<?> getAddresses(@PathVariable Integer customerId) {
        List<CustomerAddress> addresses = customerAddressRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/profile/{customerId}/addresses")
    @Transactional
    public ResponseEntity<?> addAddress(@PathVariable Integer customerId, @RequestBody AddressRequest request) {
        CustomerAddress address = new CustomerAddress();
        address.setCustomerId(customerId);
        address.setReceiverName(request.getReceiverName());
        address.setReceiverPhone(request.getReceiverPhone());
        address.setAddressLine(request.getAddressLine());
        address.setDefault(request.isDefault());

        if (request.isDefault()) {
            List<CustomerAddress> otherAddresses = customerAddressRepository.findByCustomerId(customerId);
            for (CustomerAddress other : otherAddresses) {
                other.setDefault(false);
                customerAddressRepository.save(other);
            }
        }

        CustomerAddress saved = customerAddressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/profile/{customerId}/addresses/{addressId}")
    @Transactional
    public ResponseEntity<?> updateAddress(@PathVariable Integer customerId, @PathVariable Integer addressId, @RequestBody AddressRequest request) {
        CustomerAddress address = customerAddressRepository.findById(addressId).orElse(null);
        if (address == null || !address.getCustomerId().equals(customerId)) {
            return ResponseEntity.notFound().build();
        }

        address.setReceiverName(request.getReceiverName());
        address.setReceiverPhone(request.getReceiverPhone());
        address.setAddressLine(request.getAddressLine());
        address.setDefault(request.isDefault());

        if (request.isDefault()) {
            List<CustomerAddress> otherAddresses = customerAddressRepository.findByCustomerId(customerId);
            for (CustomerAddress other : otherAddresses) {
                if (!other.getId().equals(addressId)) {
                    other.setDefault(false);
                    customerAddressRepository.save(other);
                }
            }
        }

        CustomerAddress saved = customerAddressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/profile/{customerId}/addresses/{addressId}")
    @Transactional
    public ResponseEntity<?> deleteAddress(@PathVariable Integer customerId, @PathVariable Integer addressId) {
        CustomerAddress address = customerAddressRepository.findById(addressId).orElse(null);
        if (address == null || !address.getCustomerId().equals(customerId)) {
            return ResponseEntity.notFound().build();
        }

        customerAddressRepository.delete(address);
        return ResponseEntity.ok().build();
    }
}
