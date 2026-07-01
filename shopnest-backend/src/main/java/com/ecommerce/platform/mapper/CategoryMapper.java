package com.ecommerce.platform.mapper;

import com.ecommerce.platform.dto.response.CategoryResponse;
import com.ecommerce.platform.entity.Category;
import org.mapstruct.Mapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "productCount", ignore = true)
    CategoryResponse toResponse(Category category);
}
