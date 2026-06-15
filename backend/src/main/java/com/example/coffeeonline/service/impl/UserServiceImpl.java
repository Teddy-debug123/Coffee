package com.example.coffeeonline.service.impl;

import com.example.coffeeonline.entity.CoffeeUser;
import com.example.coffeeonline.mapper.CoffeeUserMapper;
import com.example.coffeeonline.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private CoffeeUserMapper userMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional
    public CoffeeUser register(String username, String email, String password) {
        if (userMapper.selectByUsername(username) != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (userMapper.selectByEmail(email) != null) {
            throw new IllegalArgumentException("邮箱已被注册");
        }

        CoffeeUser user = new CoffeeUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(username);
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.insert(user);
        return user;
    }

    @Override
    public CoffeeUser login(String username, String password) {
        CoffeeUser user = userMapper.selectByUsername(username);
        if (user == null) {
            user = userMapper.selectByEmail(username);
        }

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        if (user.getStatus() != 1) {
            throw new IllegalArgumentException("账号已被禁用");
        }

        return user;
    }

    @Override
    public CoffeeUser getUserByEmail(String email) {
        return userMapper.selectByEmail(email);
    }

    @Override
    @Transactional
    public boolean resetPassword(String email, String newPassword) {
        CoffeeUser user = userMapper.selectByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("该邮箱未注册");
        }

        String encodedPassword = passwordEncoder.encode(newPassword);
        int affected = userMapper.updatePasswordByEmail(email, encodedPassword);
        return affected > 0;
    }

    @Override
    public CoffeeUser getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    @Transactional
    public void updateUser(CoffeeUser user) {
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);
    }
}
