package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.ChangePasswordRequest;
import com.ecommerce.platform.dto.request.UpdateProfileRequest;
import com.ecommerce.platform.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getProfile(Long userId);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    List<UserResponse> getAllUsers();
}
