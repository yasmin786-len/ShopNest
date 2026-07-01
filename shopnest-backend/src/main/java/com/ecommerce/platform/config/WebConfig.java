package com.ecommerce.platform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * General Spring MVC configuration.
 *
 * Pageable defaults (default page size, max page size) are configured via
 * `spring.data.web.pageable.*` properties in application.properties rather than
 * a manually registered HandlerMethodArgumentResolver, since Spring Boot's
 * auto-configuration (via spring-boot-starter-data-jpa) already wires up
 * PageableHandlerMethodArgumentResolver automatically and respects those properties.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
}

