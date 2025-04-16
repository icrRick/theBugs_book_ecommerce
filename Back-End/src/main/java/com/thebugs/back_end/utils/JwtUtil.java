package com.thebugs.back_end.utils;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Chuỗi secret dạng Base64 (phải là Base64 hợp lệ!)
    private static final String BASE64_SECRET_KEY = "IUhuQQpG1l3gA5aFf9SjfjRau2WiXYDIORDGWkggqNBIv4aGb5";

    // Giải mã từ Base64 → SecretKey
    private final SecretKey SIGNING_KEY = Keys.hmacShaKeyFor(Base64.getDecoder().decode(BASE64_SECRET_KEY));

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7 ngày
    private static final long EXPIRATION_TIME_RESETPASSWORD = 1000L * 60 * 15; // 15 phút
    private static final String TYPEJWT_LOGIN = "LOGIN";

    public String generateToken(int userId, int roleId, String typeJWT) {
        try {
            return Jwts.builder()
                    .setSubject(String.valueOf(userId))
                    .claim("roleId", roleId)
                    .claim("typeJWT", typeJWT)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis()
                            + (typeJWT.equals(TYPEJWT_LOGIN) ? EXPIRATION_TIME : EXPIRATION_TIME_RESETPASSWORD)))
                    .signWith(SIGNING_KEY, SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi tạo JWT: " + e.getMessage());
            return null;
        }
    }

    public String extractUserId(String token) {
        try {
            return parseClaims(token).getSubject();
        } catch (Exception e) {
            System.err.println("❌ extractUserId lỗi: " + e.getMessage());
            return null;
        }
    }

    public int extractRoleId(String token) {
        try {
            return parseClaims(token).get("roleId", Integer.class);
        } catch (Exception e) {
            System.err.println("❌ extractRoleId lỗi: " + e.getMessage());
            return -1;
        }
    }

    public String extractTypeJWT(String token) {
        try {
            return parseClaims(token).get("typeJWT", String.class);
        } catch (Exception e) {
            System.err.println("❌ extractTypeJWT lỗi: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token, int userId, String expectedTypeJWT) {
        try {
            Claims claims = parseClaims(token);

            String extractedUserId = claims.getSubject();
            String extractedTypeJWT = claims.get("typeJWT", String.class);

            return extractedUserId != null &&
                    extractedUserId.equals(String.valueOf(userId)) &&
                    extractedTypeJWT != null &&
                    extractedTypeJWT.equals(expectedTypeJWT) &&
                    !isTokenExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("❌ Token không hợp lệ: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
