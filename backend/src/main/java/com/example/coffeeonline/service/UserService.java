package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.CoffeeUser;

public interface UserService {

    CoffeeUser register(String username, String email, String password);

    CoffeeUser login(String username, String password);

    CoffeeUser getUserByEmail(String email);

    boolean resetPassword(String email, String newPassword);

    CoffeeUser getUserById(Long userId);

    void updateUser(CoffeeUser user);
}
