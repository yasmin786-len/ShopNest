package com.ecommerce.platform.service.impl;

import com.ecommerce.platform.dto.request.WishlistRequest;
import com.ecommerce.platform.dto.response.WishlistResponse;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.entity.Wishlist;
import com.ecommerce.platform.exception.DuplicateResourceException;
import com.ecommerce.platform.exception.ResourceNotFoundException;
import com.ecommerce.platform.mapper.WishlistMapper;
import com.ecommerce.platform.repository.ProductRepository;
import com.ecommerce.platform.repository.UserRepository;
import com.ecommerce.platform.repository.WishlistRepository;
import com.ecommerce.platform.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistMapper wishlistMapper;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(wishlistMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public WishlistResponse addToWishlist(Long userId, WishlistRequest request) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new DuplicateResourceException("Product is already in your wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        Wishlist saved = wishlistRepository.save(wishlist);
        return wishlistMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long wishlistItemId) {
        Wishlist wishlist = wishlistRepository.findByIdAndUserId(wishlistItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item", "id", wishlistItemId));

        wishlistRepository.delete(wishlist);
    }
}
