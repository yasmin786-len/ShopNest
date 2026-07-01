package com.ecommerce.platform.service.impl;

import com.ecommerce.platform.dto.request.CartRequest;
import com.ecommerce.platform.dto.request.UpdateCartRequest;
import com.ecommerce.platform.dto.response.CartResponse;
import com.ecommerce.platform.dto.response.CartSummaryResponse;
import com.ecommerce.platform.entity.Cart;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.exception.InsufficientStockException;
import com.ecommerce.platform.exception.ResourceNotFoundException;
import com.ecommerce.platform.mapper.CartMapper;
import com.ecommerce.platform.repository.CartRepository;
import com.ecommerce.platform.repository.ProductRepository;
import com.ecommerce.platform.repository.UserRepository;
import com.ecommerce.platform.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional(readOnly = true)
    public CartSummaryResponse getCart(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        return buildSummary(cartItems);
    }

    @Override
    @Transactional
    public CartSummaryResponse addToCart(Long userId, CartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Cart cart = cartRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElse(null);

        int desiredQuantity = request.getQuantity() + (cart != null ? cart.getQuantity() : 0);

        if (product.getStock() < desiredQuantity) {
            throw new InsufficientStockException(
                    "Only " + product.getStock() + " unit(s) of '" + product.getName() + "' available in stock");
        }

        if (cart == null) {
            cart = Cart.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        } else {
            cart.setQuantity(desiredQuantity);
        }

        cartRepository.save(cart);
        return buildSummary(cartRepository.findByUserId(userId));
    }

    @Override
    @Transactional
    public CartSummaryResponse updateCartItem(Long userId, Long cartItemId, UpdateCartRequest request) {
        Cart cart = cartRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", cartItemId));

        if (cart.getProduct().getStock() < request.getQuantity()) {
            throw new InsufficientStockException(
                    "Only " + cart.getProduct().getStock() + " unit(s) of '" + cart.getProduct().getName() + "' available in stock");
        }

        cart.setQuantity(request.getQuantity());
        cartRepository.save(cart);

        return buildSummary(cartRepository.findByUserId(userId));
    }

    @Override
    @Transactional
    public CartSummaryResponse removeCartItem(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", cartItemId));

        cartRepository.delete(cart);
        return buildSummary(cartRepository.findByUserId(userId));
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    private CartSummaryResponse buildSummary(List<Cart> cartItems) {
        List<CartResponse> items = cartItems.stream()
                .map(cartMapper::toResponse)
                .toList();

        BigDecimal totalAmount = items.stream()
                .map(CartResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream().mapToInt(CartResponse::getQuantity).sum();

        return CartSummaryResponse.builder()
                .items(items)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }
}
