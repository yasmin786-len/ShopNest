package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.LoginRequest;
import com.ecommerce.platform.dto.request.RegisterRequest;
import com.ecommerce.platform.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);
}
