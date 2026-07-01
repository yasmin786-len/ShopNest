package com.ecommerce.platform.repository;

import com.ecommerce.platform.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUserId(Long userId);

    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);

    Optional<Cart> findByIdAndUserId(Long id, Long userId);

    void deleteByUserId(Long userId);

    long countByUserId(Long userId);
}
