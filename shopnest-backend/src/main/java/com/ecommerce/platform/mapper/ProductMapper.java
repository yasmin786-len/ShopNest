package com.ecommerce.platform.mapper;

import com.ecommerce.platform.dto.response.ProductResponse;
import com.ecommerce.platform.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "finalPrice", expression = "java(product.getFinalPrice())")
    @Mapping(target = "inStock", expression = "java(product.getStock() != null && product.getStock() > 0)")
    ProductResponse toResponse(Product product);
}
