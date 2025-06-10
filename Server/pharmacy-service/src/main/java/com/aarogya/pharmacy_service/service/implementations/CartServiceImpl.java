package com.aarogya.pharmacy_service.service.implementations;

import com.aarogya.pharmacy_service.Clients.UserGrpcClient;
import com.aarogya.pharmacy_service.auth.UserContextHolder;
import com.aarogya.pharmacy_service.documents.Cart;
import com.aarogya.pharmacy_service.documents.CartItem;
import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import com.aarogya.pharmacy_service.dto.cart.CartItemDTO;
import com.aarogya.pharmacy_service.dto.cart.CartItemRequestDTO;
import com.aarogya.pharmacy_service.dto.patient.PatientResponseDTO;
import com.aarogya.pharmacy_service.exceptions.CartNotFoundException;
import com.aarogya.pharmacy_service.exceptions.MedicineNotFoundException;
import com.aarogya.pharmacy_service.exceptions.ServiceUnavailable;
import com.aarogya.pharmacy_service.mapper.CartMapper;
import com.aarogya.pharmacy_service.repository.CartRepository;
import com.aarogya.pharmacy_service.repository.MedicineRepository;
import com.aarogya.pharmacy_service.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final MedicineRepository medicineRepository;
    @Autowired
    private final CartMapper cartMapper;
    private final UserGrpcClient userGrpcClient;

    @Transactional
    public CartDTO getCart(String patientId) {
        try {
            log.info("Fetching cart for patientId: {}", patientId);
            Cart cart = cartRepository.findByPatientId(patientId)
                    .orElseGet(() -> createEmptyCart(patientId));
            return enrichCartWithDetails(cart);
        } catch (Exception e) {
            log.error("Error fetching cart for patientId: {}", UserContextHolder.getUserDetails().getUserId(), e);
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Override
    public CartDTO getMyCart() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        CartDTO cart = getCart(patientId);
        return cart;
    }

    @Transactional
    public CartDTO addItemToCart(CartItemRequestDTO itemRequest) {
        try {
            String patientId = UserContextHolder.getUserDetails().getUserId();
            log.info("Adding item to cart for patientId: {}", patientId);
            Medicine medicine = medicineRepository.findById(itemRequest.getMedicineId())
                    .orElseThrow(() -> new MedicineNotFoundException(itemRequest.getMedicineId()));

            Cart cart = cartRepository.findByPatientId(patientId)
                    .orElseGet(() -> createEmptyCart(patientId));

            Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getMedicineId().equals(itemRequest.getMedicineId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + itemRequest.getQuantity());
            } else {
                CartItem newItem = CartItem.builder()
                        .medicineId(medicine.getId())
                        .medicineName(medicine.getName())
                        .medicineImage(medicine.getImages().getFirst())
                        .quantity(itemRequest.getQuantity())
                        .price(medicine.getPrice())
                        .build();
                cart.getItems().add(newItem);
            }

            cart.setLastUpdated(LocalDateTime.now());
            Cart savedCart = cartRepository.save(cart);
            return enrichCartWithDetails(savedCart);
        } catch (Exception e) {
            log.error("Error adding item to cart for patientId: {}", UserContextHolder.getUserDetails().getUserId(), e);
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional
    public CartDTO updateCartItem(CartItemRequestDTO itemRequest) {
        try {
            String patientId = UserContextHolder.getUserDetails().getUserId();
            log.info("Updating item in cart for patientId: {}", patientId);
            Cart cart = cartRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new CartNotFoundException(patientId));

            cart.getItems().stream()
                    .filter(item -> item.getMedicineId().equals(itemRequest.getMedicineId()))
                    .findFirst()
                    .ifPresentOrElse(
                            item -> {
                                if (itemRequest.getQuantity() <= 0) {
                                    cart.getItems().remove(item);
                                } else {
                                    item.setQuantity(itemRequest.getQuantity());
                                }
                            },
                            () -> {
                                throw new MedicineNotFoundException(itemRequest.getMedicineId());
                            }
                    );

            cart.setLastUpdated(LocalDateTime.now());
            Cart savedCart = cartRepository.save(cart);
            return enrichCartWithDetails(savedCart);
        } catch (Exception e) {
            log.error("Error updating item in cart for patientId: {}", UserContextHolder.getUserDetails().getUserId(), e);
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional
    public void removeItemFromCart(String medicineId) {
        try {
            String patientId = UserContextHolder.getUserDetails().getUserId();
            log.info("Removing item from cart for patientId: {}", patientId);
            Cart cart = cartRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new CartNotFoundException(patientId));

            boolean removed = cart.getItems().removeIf(item -> item.getMedicineId().equals(medicineId));

            if (removed) {
                cart.setLastUpdated(LocalDateTime.now());
                cartRepository.save(cart);
            } else {
                throw new MedicineNotFoundException(medicineId);
            }
        } catch (Exception e) {
            log.error("Error removing item from cart for patientId: {}", UserContextHolder.getUserDetails().getUserId(), e);
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Override
    public void clearMyCart() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        clearCart(patientId);
    }


    @Transactional
    public void clearCart(String patientId) {
        try {
            log.info("Clearing cart for patientId: {}", patientId);
            Cart cart = cartRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new CartNotFoundException(patientId));

            cart.getItems().clear();
            cart.setLastUpdated(LocalDateTime.now());
            cartRepository.save(cart);
        } catch (Exception e) {
            log.error("Error clearing cart for patientId: {}", UserContextHolder.getUserDetails().getUserId(), e);
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    private Cart createEmptyCart(String patientId) {
        log.info("Creating empty cart for patientId: {}", patientId);
        Cart cart = Cart.builder()
                .patientId(patientId)
                .items(List.of())
                .lastUpdated(LocalDateTime.now())
                .build();
        return cartRepository.save(cart);
    }

    private CartDTO enrichCartWithDetails(Cart cart) {
        CartDTO cartDTO = cartMapper.toDTO(cart);
        PatientResponseDTO patientResponseDTO = userGrpcClient.getPatient(cart.getPatientId());
        cartDTO.setPatient(cartMapper.toUser(patientResponseDTO));
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItemDTO item : cartDTO.getItems()) {
            BigDecimal subTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setSubTotal(subTotal);

            totalAmount = totalAmount.add(subTotal);
        }

        cartDTO.setTotalAmount(totalAmount);
        return cartDTO;
    }
}
