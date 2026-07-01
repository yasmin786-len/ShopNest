package com.ecommerce.platform.controller;

import com.ecommerce.platform.dto.request.WishlistRequest;
import com.ecommerce.platform.dto.response.ApiResponse;
import com.ecommerce.platform.dto.response.WishlistResponse;
import com.ecommerce.platform.service.WishlistService;
import com.ecommerce.platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist management for the authenticated customer")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get the current user's wishlist")
    public ResponseEntity<ApiResponse<List<WishlistResponse>>> getWishlist() {
        List<WishlistResponse> response = wishlistService.getWishlist(SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Add a product to the wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(@Valid @RequestBody WishlistRequest request) {
        WishlistResponse response = wishlistService.addToWishlist(SecurityUtil.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product added to wishlist", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove an item from the wishlist")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable Long id) {
        wishlistService.removeFromWishlist(SecurityUtil.getCurrentUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from wishlist", null));
    }
}
