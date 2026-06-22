package com.example.coffeeonline.controller;

import com.example.coffeeonline.service.SubscriptionService;
import com.example.coffeeonline.utils.Result;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/subscription")
@Validated
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public Result<Map<String, Object>> subscribe(
            @RequestParam @Email(message = "请输入有效的邮箱地址") String email) {
        
        subscriptionService.subscribe(email);
        
        Map<String, Object> result = new HashMap<>();
        result.put("email", email);
        result.put("subscribed", true);
        
        return Result.success("订阅成功，感谢您的关注！", result);
    }

    @PostMapping("/unsubscribe")
    public Result<Map<String, Object>> unsubscribe(
            @RequestParam @Email(message = "请输入有效的邮箱地址") String email) {
        
        boolean success = subscriptionService.unsubscribe(email);
        
        if (!success) {
            return Result.badRequest("该邮箱未订阅");
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("email", email);
        result.put("subscribed", false);
        
        return Result.success("已取消订阅", result);
    }

    @GetMapping("/status")
    public Result<Map<String, Object>> checkStatus(
            @RequestParam @Email(message = "请输入有效的邮箱地址") String email) {
        
        boolean subscribed = subscriptionService.isSubscribed(email);
        
        Map<String, Object> result = new HashMap<>();
        result.put("email", email);
        result.put("subscribed", subscribed);
        
        return Result.success(result);
    }
}
