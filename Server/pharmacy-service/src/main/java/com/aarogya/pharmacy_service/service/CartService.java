package com.aarogya.pharmacy_service.service;

import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import com.aarogya.pharmacy_service.dto.cart.CartItemRequestDTO;

public interface CartService {

    CartDTO getMyCart();

    CartDTO getCart(String patientId);

    CartDTO addItemToCart(CartItemRequestDTO itemRequest);

    CartDTO updateCartItem(CartItemRequestDTO itemRequest);

    void removeItemFromCart(String medicineId);

    void clearCart(String patientId);

    void clearMyCart();
}
