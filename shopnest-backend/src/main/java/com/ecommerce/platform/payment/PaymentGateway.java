package com.ecommerce.platform.payment;

/**
 * Strategy interface for processing payments.
 *
 * Today, {@link MockPaymentGateway} is the only implementation and simulates a payment
 * outcome without contacting any real provider. To integrate a real gateway later
 * (e.g. Razorpay, Stripe), implement this interface — for example:
 *
 *   {@code @Service}
 *   {@code @ConditionalOnProperty(name = "app.payment.provider", havingValue = "razorpay")}
 *   public class RazorpayPaymentGateway implements PaymentGateway { ... }
 *
 * and switch the active implementation via the `app.payment.provider` property —
 * no changes are needed in OrderService or any controller.
 */
public interface PaymentGateway {

    PaymentResult process(PaymentRequest request);

    /** Identifies which provider this implementation talks to, e.g. "MOCK", "RAZORPAY", "STRIPE". */
    String getProviderName();
}
