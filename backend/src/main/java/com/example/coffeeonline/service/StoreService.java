package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.CoffeeStore;

import java.util.List;

public interface StoreService {

    List<CoffeeStore> getAllStores();

    List<CoffeeStore> getStoresByCity(String city);

    CoffeeStore getStoreById(Long id);

    List<String> getAllCities();
}
