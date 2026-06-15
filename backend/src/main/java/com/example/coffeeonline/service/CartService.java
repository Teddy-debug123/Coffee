package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.CoffeeCart;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface CartService {

    CoffeeCart addItem(Long userId, String productType, Long productId, Integer quantity);

    CoffeeCart updateQuantity(Long userId, Long cartId, Integer quantity);

    boolean removeItem(Long userId, Long cartId);

    CompletableFuture<List<Map<String, Object>>> getCartItems(Long userId);

    boolean clearCart(Long userId);
}
