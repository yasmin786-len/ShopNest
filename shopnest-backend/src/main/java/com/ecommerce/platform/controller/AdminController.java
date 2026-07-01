package com.ecommerce.platform.controller;

import com.ecommerce.platform.dto.response.ApiResponse;
import com.ecommerce.platform.dto.response.DashboardStatsResponse;
import com.ecommerce.platform.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Dashboard", description = "Aggregated statistics for the admin dashboard")
public class AdminController {

    private final OrderService orderService;

    @GetMapping("/dashboard")
    @Operation(summary = "[Admin] Get dashboard statistics: users, products, orders, revenue")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse response = orderService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
