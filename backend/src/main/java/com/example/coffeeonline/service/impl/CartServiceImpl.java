package com.example.coffeeonline.service.impl;

import com.example.coffeeonline.entity.CoffeeBean;
import com.example.coffeeonline.entity.CoffeeCart;
import com.example.coffeeonline.entity.CoffeeEquipment;
import com.example.coffeeonline.mapper.CoffeeBeanMapper;
import com.example.coffeeonline.mapper.CoffeeCartMapper;
import com.example.coffeeonline.mapper.CoffeeEquipmentMapper;
import com.example.coffeeonline.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CoffeeCartMapper cartMapper;

    @Autowired
    private CoffeeBeanMapper beanMapper;

    @Autowired
    private CoffeeEquipmentMapper equipmentMapper;

    @Override
    @Transactional
    public CoffeeCart addItem(Long userId, String productType, Long productId, Integer quantity) {
        CoffeeCart existing = cartMapper.selectByUserAndProduct(userId, productType, productId);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            existing.setUpdatedAt(LocalDateTime.now());
            cartMapper.updateById(existing);
            return existing;
        }

        CoffeeCart cart = new CoffeeCart();
        cart.setUserId(userId);
        cart.setProductType(productType);
        cart.setProductId(productId);
        cart.setQuantity(quantity);
        cart.setSelected(1);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());

        cartMapper.insert(cart);
        return cart;
    }

    @Override
    @Transactional
    public CoffeeCart updateQuantity(Long userId, Long cartId, Integer quantity) {
        CoffeeCart cart = cartMapper.selectById(cartId);
        if (cart == null || !cart.getUserId().equals(userId)) {
            throw new IllegalArgumentException("购物车商品不存在");
        }

        if (quantity <= 0) {
            cartMapper.deleteById(cartId);
            return null;
        }

        cart.setQuantity(quantity);
        cart.setUpdatedAt(LocalDateTime.now());
        cartMapper.updateById(cart);
        return cart;
    }

    @Override
    @Transactional
    public boolean removeItem(Long userId, Long cartId) {
        CoffeeCart cart = cartMapper.selectById(cartId);
        if (cart == null || !cart.getUserId().equals(userId)) {
            throw new IllegalArgumentException("购物车商品不存在");
        }

        cartMapper.deleteById(cartId);
        return true;
    }

    @Override
    @Async("coffeeThreadPool")
    public CompletableFuture<List<Map<String, Object>>> getCartItems(Long userId) {
        List<CoffeeCart> cartItems = cartMapper.selectByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (CoffeeCart cart : cartItems) {
            Map<String, Object> item = new HashMap<>();
            item.put("cartId", cart.getId());
            item.put("productType", cart.getProductType());
            item.put("quantity", cart.getQuantity());
            item.put("selected", cart.getSelected());

            if ("bean".equals(cart.getProductType())) {
                CoffeeBean bean = beanMapper.selectById(cart.getProductId());
                if (bean != null) {
                    item.put("product", bean);
                }
            } else if ("equipment".equals(cart.getProductType())) {
                CoffeeEquipment equipment = equipmentMapper.selectById(cart.getProductId());
                if (equipment != null) {
                    item.put("product", equipment);
                }
            }

            result.add(item);
        }

        return CompletableFuture.completedFuture(result);
    }

    @Override
    @Transactional
    public boolean clearCart(Long userId) {
        cartMapper.deleteByUserId(userId);
        return true;
    }
}
