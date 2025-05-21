package com.aarogya.pharmacy_service.service;

import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import com.aarogya.pharmacy_service.dto.cart.CartItemRequestDTO;

public interface CartService {

    CartDTO getCart(String patientId);

    CartDTO addItemToCart(String patientId, CartItemRequestDTO itemRequest);

    CartDTO updateCartItem(String patientId, CartItemRequestDTO itemRequest);

    void removeItemFromCart(String patientId, String medicineId);

    void clearCart(String patientId);
}
