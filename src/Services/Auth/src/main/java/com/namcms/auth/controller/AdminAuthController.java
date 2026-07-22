package com.namcms.auth.controller;

import com.namcms.auth.model.User;
import com.namcms.auth.repository.UserRepository;
import com.namcms.auth.security.JwtTokenUtil;
import com.namcms.shared.dto.AdminLoginRequest;
import com.namcms.shared.dto.AdminLoginResponse;
import com.namcms.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adminauth")
public class AdminAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null || !user.getPasswordHash().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Tên đăng nhập hoặc mật khẩu không chính xác!"));
        }

        String token = jwtTokenUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AdminLoginResponse(token, user.getUsername(), user.getFullName(), user.getRole()));
    }
}
