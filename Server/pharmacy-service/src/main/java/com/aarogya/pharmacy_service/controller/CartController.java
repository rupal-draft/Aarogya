package com.aarogya.pharmacy_service.controller;

import com.aarogya.pharmacy_service.advices.ApiResponse;
import com.aarogya.pharmacy_service.advices.ErrorResponse;
import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import com.aarogya.pharmacy_service.dto.cart.CartItemRequestDTO;
import com.aarogya.pharmacy_service.service.CartService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getMyCart() {
        return ResponseEntity.ok(ApiResponse.success(cartService.getMyCart()));
    }

    @PostMapping("/add")
    @RateLimiter(name = "cart", fallbackMethod = "addItemToCart")
    public ResponseEntity<ApiResponse<CartDTO>> addItemToCart(
            @Valid @RequestBody CartItemRequestDTO itemRequest) {
        return ResponseEntity.ok(ApiResponse.success(cartService.addItemToCart(itemRequest)));
    }

    @PutMapping("/update")
    @RateLimiter(name = "cart", fallbackMethod = "updateCartItem")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(
            @Valid @RequestBody CartItemRequestDTO itemRequest) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateCartItem(itemRequest)));
    }

    @DeleteMapping("/remove/{medicineId}")
    @RateLimiter(name = "cart", fallbackMethod = "removeItemFromCart")
    public ResponseEntity<ApiResponse<String>> removeItemFromCart(
            @PathVariable String medicineId) {
        cartService.removeItemFromCart(medicineId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart"));
    }

    @DeleteMapping("/clear")
    @RateLimiter(name = "cart", fallbackMethod = "clearCart")
    public ResponseEntity<ApiResponse<String>> clearCart() {
        cartService.clearMyCart();
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }

    public ResponseEntity<ErrorResponse> cartRateLimitFallback(Throwable throwable, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error("Too Many Requests")
                .message("You are sending too many requests. Please try again later.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(errorResponse);
    }

    public ResponseEntity<ErrorResponse> getCart(Throwable t, HttpServletRequest request) {
        return cartRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> addItemToCart(Throwable t, HttpServletRequest request) {
        return cartRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> updateCartItem(Throwable t, HttpServletRequest request) {
        return cartRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> removeItemFromCart(Throwable t, HttpServletRequest request) {
        return cartRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> clearCart(Throwable t, HttpServletRequest request) {
        return cartRateLimitFallback(t, request);
    }
}
