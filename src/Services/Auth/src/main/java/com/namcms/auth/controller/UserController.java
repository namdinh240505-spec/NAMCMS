package com.namcms.auth.controller;

import com.namcms.auth.model.Customer;
import com.namcms.auth.model.User;
import com.namcms.auth.repository.CustomerRepository;
import com.namcms.auth.repository.UserRepository;
import com.namcms.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Username và password không được để trống."));
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên đăng nhập đã tồn tại."));
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công!", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tài khoản không tồn tại."));
        }
        
        if (user.getUsername().equals("admin")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa tài khoản admin mặc định."));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành công!", null));
    }

    // ==========================================
    // Customer endpoints (for admin portal & inter-service)
    // ==========================================

    /**
     * Get all customers (used by admin portal)
     */
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    /**
     * Get customer by ID (used by other services: Chat, Order)
     */
    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Integer id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    /**
     * Batch get customers by IDs (used by Chat Service for conversations)
     * Accepts a list of customer IDs and returns a map of id -> customer info
     */
    @PostMapping("/customers/batch")
    public ResponseEntity<Map<Integer, Map<String, String>>> getCustomersBatch(@RequestBody List<Integer> ids) {
        List<Customer> customers = customerRepository.findAllById(ids);
        Map<Integer, Map<String, String>> result = new HashMap<>();
        for (Customer c : customers) {
            Map<String, String> info = new HashMap<>();
            info.put("fullName", c.getFullName());
            info.put("email", c.getEmail());
            info.put("phone", c.getPhone() != null ? c.getPhone() : "");
            result.put(c.getId(), info);
        }
        return ResponseEntity.ok(result);
    }
}

