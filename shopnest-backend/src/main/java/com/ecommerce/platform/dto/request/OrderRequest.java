package com.ecommerce.platform.dto.request;

import com.ecommerce.platform.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotBlank(message = "Shipping name is required")
    @Size(max = 100)
    private String shippingName;

    @NotBlank(message = "Shipping address is required")
    @Size(max = 500)
    private String shippingAddress;

    @NotBlank(message = "Shipping phone is required")
    @Pattern(regexp = "^[0-9+\\-\\s]{7,15}$", message = "Phone number is invalid")
    private String shippingPhone;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    // Required only for CREDIT_CARD / DEBIT_CARD simulation
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;

    // Required only for UPI simulation
    private String upiId;
}
