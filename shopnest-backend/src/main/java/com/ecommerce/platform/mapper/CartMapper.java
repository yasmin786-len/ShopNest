package com.ecommerce.platform.mapper;

import com.ecommerce.platform.dto.response.CartResponse;
import com.ecommerce.platform.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface CartMapper {

    @Mapping(target = "subtotal", expression = "java(cart.getProduct().getFinalPrice().multiply(java.math.BigDecimal.valueOf(cart.getQuantity())))")
    CartResponse toResponse(Cart cart);
}
