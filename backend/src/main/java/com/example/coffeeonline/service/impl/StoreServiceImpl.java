package com.example.coffeeonline.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.coffeeonline.entity.CoffeeStore;
import com.example.coffeeonline.mapper.CoffeeStoreMapper;
import com.example.coffeeonline.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private CoffeeStoreMapper storeMapper;

    @Override
    public List<CoffeeStore> getAllStores() {
        QueryWrapper<CoffeeStore> query = new QueryWrapper<>();
        query.eq("status", 1);
        return storeMapper.selectList(query);
    }

    @Override
    public List<CoffeeStore> getStoresByCity(String city) {
        return storeMapper.selectByCity(city);
    }

    @Override
    public CoffeeStore getStoreById(Long id) {
        return storeMapper.selectById(id);
    }

    @Override
    public List<String> getAllCities() {
        return storeMapper.selectAllCities();
    }
}
