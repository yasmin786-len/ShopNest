package com.ecommerce.platform.controller;

import com.ecommerce.platform.dto.request.CartRequest;
import com.ecommerce.platform.dto.request.UpdateCartRequest;
import com.ecommerce.platform.dto.response.ApiResponse;
import com.ecommerce.platform.dto.response.CartSummaryResponse;
import com.ecommerce.platform.service.CartService;
import com.ecommerce.platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management for the authenticated customer")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get the current user's cart")
    public ResponseEntity<ApiResponse<CartSummaryResponse>> getCart() {
        CartSummaryResponse response = cartService.getCart(SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Add a product to the cart (or increase quantity if already present)")
    public ResponseEntity<ApiResponse<CartSummaryResponse>> addToCart(@Valid @RequestBody CartRequest request) {
        CartSummaryResponse response = cartService.addToCart(SecurityUtil.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item added to cart", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update the quantity of a cart item")
    public ResponseEntity<ApiResponse<CartSummaryResponse>> updateCartItem(@PathVariable Long id,
                                                                             @Valid @RequestBody UpdateCartRequest request) {
        CartSummaryResponse response = cartService.updateCartItem(SecurityUtil.getCurrentUserId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<ApiResponse<CartSummaryResponse>> removeCartItem(@PathVariable Long id) {
        CartSummaryResponse response = cartService.removeCartItem(SecurityUtil.getCurrentUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", response));
    }

    @DeleteMapping
    @Operation(summary = "Empty the entire cart")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartService.clearCart(SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
