package com.ecommerce.platform.dto.response;

import com.ecommerce.platform.entity.enums.OrderStatus;
import com.ecommerce.platform.entity.enums.PaymentMethod;
import com.ecommerce.platform.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String shippingName;
    private String shippingAddress;
    private String shippingPhone;
    private String transactionRef;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> orderItems;
}
