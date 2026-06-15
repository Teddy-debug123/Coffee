package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeUser;
import com.example.coffeeonline.service.UserService;
import com.example.coffeeonline.utils.JwtUtil;
import com.example.coffeeonline.utils.Result;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/info")
    public Result<Map<String, Object>> getUserInfo(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        CoffeeUser user = userService.getUserById(userId);
        
        if (user == null) {
            return Result.unauthorized("用户不存在");
        }

        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("email", user.getEmail());
        info.put("nickname", user.getNickname());
        info.put("avatar", user.getAvatar());
        info.put("phone", user.getPhone());
        info.put("gender", user.getGender());
        
        return Result.success(info);
    }

    @PutMapping("/info")
    public Result<Map<String, Object>> updateUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestBody UserUpdateRequest request) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        CoffeeUser user = userService.getUserById(userId);
        
        if (user == null) {
            return Result.unauthorized("用户不存在");
        }

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        userService.updateUser(user);

        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("email", user.getEmail());
        info.put("nickname", user.getNickname());
        info.put("avatar", user.getAvatar());
        info.put("phone", user.getPhone());
        info.put("gender", user.getGender());
        
        return Result.success("更新成功", info);
    }

    public static class UserUpdateRequest {
        private String nickname;
        private String avatar;
        private String phone;
        private Integer gender;

        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public Integer getGender() { return gender; }
        public void setGender(Integer gender) { this.gender = gender; }
    }
}
