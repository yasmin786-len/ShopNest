package com.ecommerce.platform.mapper;

import com.ecommerce.platform.dto.response.WishlistResponse;
import com.ecommerce.platform.entity.Wishlist;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface WishlistMapper {

    WishlistResponse toResponse(Wishlist wishlist);
}
