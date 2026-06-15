package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeStore;
import com.example.coffeeonline.service.StoreService;
import com.example.coffeeonline.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public Result<List<CoffeeStore>> getStores(@RequestParam(required = false) String city) {
        List<CoffeeStore> stores;
        if (city != null && !city.isEmpty()) {
            stores = storeService.getStoresByCity(city);
        } else {
            stores = storeService.getAllStores();
        }
        return Result.success(stores);
    }

    @GetMapping("/{id}")
    public Result<CoffeeStore> getStoreById(@PathVariable Long id) {
        CoffeeStore store = storeService.getStoreById(id);
        if (store == null) {
            return Result.badRequest("门店不存在");
        }
        return Result.success(store);
    }

    @GetMapping("/cities")
    public Result<List<String>> getCities() {
        return Result.success(storeService.getAllCities());
    }
}
