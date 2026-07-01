package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.ProductRequest;
import com.ecommerce.platform.dto.response.PagedResponse;
import com.ecommerce.platform.dto.response.ProductResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    PagedResponse<ProductResponse> getAllProducts(Pageable pageable, Long categoryId, BigDecimal minPrice,
                                                    BigDecimal maxPrice, String brand, BigDecimal minRating,
                                                    Boolean inStock);

    ProductResponse getProductById(Long id);

    PagedResponse<ProductResponse> searchProducts(String keyword, Pageable pageable);

    PagedResponse<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    List<ProductResponse> getFeaturedProducts();

    List<ProductResponse> getTrendingProducts();

    List<ProductResponse> getNewArrivals();

    List<ProductResponse> getFlashDeals();

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
