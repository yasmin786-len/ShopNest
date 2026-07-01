package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.WishlistRequest;
import com.ecommerce.platform.dto.response.WishlistResponse;

import java.util.List;

public interface WishlistService {

    List<WishlistResponse> getWishlist(Long userId);

    WishlistResponse addToWishlist(Long userId, WishlistRequest request);

    void removeFromWishlist(Long userId, Long wishlistItemId);
}
