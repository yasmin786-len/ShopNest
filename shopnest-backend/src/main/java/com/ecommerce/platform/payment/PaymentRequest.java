package com.ecommerce.platform.payment;

import com.ecommerce.platform.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Generic payment request passed to any {@link PaymentGateway} implementation.
 * Kept gateway-agnostic so the same shape can later be sent to Razorpay, Stripe, etc.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private Long orderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String customerEmail;
    private String customerName;

    // Card simulation fields (never persisted)
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;

    // UPI simulation field
    private String upiId;
}
