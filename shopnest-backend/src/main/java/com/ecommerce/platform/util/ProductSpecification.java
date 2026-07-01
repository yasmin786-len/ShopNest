package com.ecommerce.platform.util;

import com.ecommerce.platform.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null
                ? null
                : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> priceGreaterThanOrEqual(BigDecimal min) {
        return (root, query, cb) -> min == null
                ? null
                : cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Product> priceLessThanOrEqual(BigDecimal max) {
        return (root, query, cb) -> max == null
                ? null
                : cb.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<Product> hasBrand(String brand) {
        return (root, query, cb) -> (brand == null || brand.isBlank())
                ? null
                : cb.equal(cb.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<Product> ratingGreaterThanOrEqual(BigDecimal minRating) {
        return (root, query, cb) -> minRating == null
                ? null
                : cb.greaterThanOrEqualTo(root.get("rating"), minRating);
    }

    public static Specification<Product> inStockOnly(Boolean inStock) {
        return (root, query, cb) -> (inStock == null || !inStock)
                ? null
                : cb.greaterThan(root.get("stock"), 0);
    }
}
