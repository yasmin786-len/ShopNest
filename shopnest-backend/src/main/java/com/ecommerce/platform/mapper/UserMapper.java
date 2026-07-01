package com.ecommerce.platform.mapper;

import com.ecommerce.platform.dto.response.UserResponse;
import com.ecommerce.platform.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
