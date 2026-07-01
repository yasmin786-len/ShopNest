package com.ecommerce.platform.payment;

import com.ecommerce.platform.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResult {

    private PaymentStatus status;
    private String transactionRef;
    private String message;
}
