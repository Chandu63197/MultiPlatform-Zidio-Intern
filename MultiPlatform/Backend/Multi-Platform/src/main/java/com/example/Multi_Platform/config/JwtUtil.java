package com.example.Multi_Platform.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  private final String SECRET_KEY = "your-very-strong-and-long-secret-key-that-is-at-least-256-bits!";
  private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

  // Generate token
  public String generateToken(String email, String role) {
    return Jwts.builder()
            .setSubject(email)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiry
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
  }


  // Extract email from token
  public String extractEmail(String token) {
    return getClaims(token).getSubject();
  }

  // Validate token
  public boolean isTokenValid(String token) {
    try {
      Claims claims = getClaims(token);
      return !claims.getExpiration().before(new Date());
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  // Parse claims
  private Claims getClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }


  public String extractRole(String token) {
    return getClaims(token).get("role", String.class);
  }

}
