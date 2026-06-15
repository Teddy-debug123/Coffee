package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeCart;
import com.example.coffeeonline.service.CartService;
import com.example.coffeeonline.utils.JwtUtil;
import com.example.coffeeonline.utils.Result;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/cart")
@Validated
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/add")
    public Result<CoffeeCart> addItem(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CartAddRequest request) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        CoffeeCart cart = cartService.addItem(
                userId,
                request.getProductType(),
                request.getProductId(),
                request.getQuantity()
        );
        return Result.success("添加成功", cart);
    }

    @PutMapping("/update/{cartId}")
    public Result<Object> updateQuantity(
            @RequestHeader("Authorization") String token,
            @PathVariable Long cartId,
            @Valid @RequestBody CartUpdateRequest request) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        CoffeeCart cart = cartService.updateQuantity(userId, cartId, request.getQuantity());
        if (cart == null) {
            return Result.success("商品已移除");
        }
        return Result.success("更新成功", cart);
    }

    @DeleteMapping("/remove/{cartId}")
    public Result<Object> removeItem(
            @RequestHeader("Authorization") String token,
            @PathVariable Long cartId) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.removeItem(userId, cartId);
        return Result.success("删除成功");
    }

    @GetMapping("/items")
    public CompletableFuture<Result<List<Map<String, Object>>>> getCartItems(
            @RequestHeader(value = "Authorization", required = false) String token) {
        
        if (token == null || token.isEmpty()) {
            return CompletableFuture.completedFuture(Result.success(java.util.Collections.emptyList()));
        }
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        return cartService.getCartItems(userId)
                .thenApply(items -> Result.success(items));
    }

    @DeleteMapping("/clear")
    public Result<Object> clearCart(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        cartService.clearCart(userId);
        return Result.success("清空成功");
    }

    public static class CartAddRequest {
        @NotBlank(message = "商品类型不能为空")
        private String productType;

        @NotNull(message = "商品ID不能为空")
        private Long productId;

        @NotNull(message = "数量不能为空")
        @Min(value = 1, message = "数量至少为1")
        private Integer quantity;

        public String getProductType() { return productType; }
        public void setProductType(String productType) { this.productType = productType; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class CartUpdateRequest {
        @NotNull(message = "数量不能为空")
        @Min(value = 0, message = "数量不能为负数")
        private Integer quantity;

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
