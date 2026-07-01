package com.ecommerce.platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private String brand;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private Integer stock;
    private BigDecimal rating;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private boolean inStock;
}
