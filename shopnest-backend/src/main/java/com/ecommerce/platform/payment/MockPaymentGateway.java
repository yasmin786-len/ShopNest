package com.ecommerce.platform.payment;

import com.ecommerce.platform.entity.enums.PaymentMethod;
import com.ecommerce.platform.entity.enums.PaymentStatus;
import com.ecommerce.platform.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.UUID;

/**
 * Simulated payment gateway used for development/demo purposes.
 *
 * - COD always succeeds immediately (no payment collected upfront).
 * - CREDIT_CARD / DEBIT_CARD requires card details to be present and simulates a
 *   successful charge (this never contacts a real card network).
 * - UPI requires a UPI ID and simulates a successful collect request.
 *
 * Swap this out for a real provider by implementing {@link PaymentGateway} and
 * activating it with `app.payment.provider=razorpay` (or similar) in application.properties.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "app.payment.provider", havingValue = "mock", matchIfMissing = true)
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult process(PaymentRequest request) {
        log.info("Processing simulated payment for order {} via {}", request.getOrderId(), request.getPaymentMethod());

        validateRequest(request);

        String transactionRef = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        if (request.getPaymentMethod() == PaymentMethod.COD) {
            return PaymentResult.builder()
                    .status(PaymentStatus.PENDING)
                    .transactionRef(transactionRef)
                    .message("Order placed successfully. Pay on delivery.")
                    .build();
        }

        // Simulate a successful charge for card/UPI payments.
        return PaymentResult.builder()
                .status(PaymentStatus.PAID)
                .transactionRef(transactionRef)
                .message("Payment successful (simulated)")
                .build();
    }

    @Override
    public String getProviderName() {
        return "MOCK";
    }

    private void validateRequest(PaymentRequest request) {
        switch (request.getPaymentMethod()) {
            case CREDIT_CARD, DEBIT_CARD -> {
                if (!StringUtils.hasText(request.getCardNumber()) || !StringUtils.hasText(request.getCardCvv())
                        || !StringUtils.hasText(request.getCardExpiry())) {
                    throw new BadRequestException("Card number, expiry, and CVV are required for card payments");
                }
            }
            case UPI -> {
                if (!StringUtils.hasText(request.getUpiId())) {
                    throw new BadRequestException("UPI ID is required for UPI payments");
                }
            }
            case COD -> {
                // No extra validation needed
            }
        }
    }
}
