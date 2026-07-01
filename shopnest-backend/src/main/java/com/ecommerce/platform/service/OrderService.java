package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.OrderRequest;
import com.ecommerce.platform.dto.request.UpdateOrderStatusRequest;
import com.ecommerce.platform.dto.response.DashboardStatsResponse;
import com.ecommerce.platform.dto.response.OrderResponse;
import com.ecommerce.platform.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(Long userId, OrderRequest request);

    List<OrderResponse> getOrdersForUser(Long userId);

    OrderResponse getOrderById(Long userId, Long orderId, boolean isAdmin);

    PagedResponse<OrderResponse> getAllOrders(Pageable pageable);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);

    DashboardStatsResponse getDashboardStats();
}
