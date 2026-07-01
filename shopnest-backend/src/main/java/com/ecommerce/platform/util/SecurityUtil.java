package com.ecommerce.platform.util;

import com.ecommerce.platform.exception.UnauthorizedException;
import com.ecommerce.platform.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {

    private SecurityUtil() {
    }

    public static Long getCurrentUserId() {
        return getCurrentPrincipal().getId();
    }

    public static String getCurrentUserEmail() {
        return getCurrentPrincipal().getEmail();
    }

    public static boolean isCurrentUserAdmin() {
        return "ADMIN".equals(getCurrentPrincipal().getRole());
    }

    private static UserPrincipal getCurrentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("No authenticated user found in security context");
        }
        return principal;
    }
}
