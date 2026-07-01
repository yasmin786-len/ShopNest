package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.CartRequest;
import com.ecommerce.platform.dto.request.UpdateCartRequest;
import com.ecommerce.platform.dto.response.CartSummaryResponse;

public interface CartService {

    CartSummaryResponse getCart(Long userId);

    CartSummaryResponse addToCart(Long userId, CartRequest request);

    CartSummaryResponse updateCartItem(Long userId, Long cartItemId, UpdateCartRequest request);

    CartSummaryResponse removeCartItem(Long userId, Long cartItemId);

    void clearCart(Long userId);
}
