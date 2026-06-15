package com.example.coffeeonline.service.impl;

import com.example.coffeeonline.entity.CoffeeOrigin;
import com.example.coffeeonline.mapper.CoffeeOriginMapper;
import com.example.coffeeonline.service.OriginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class OriginServiceImpl implements OriginService {

    @Autowired
    private CoffeeOriginMapper originMapper;

    @Override
    @Async("coffeeThreadPool")
    public CompletableFuture<List<Map<String, Object>>> getAllOriginPoints() {
        List<CoffeeOrigin> origins = originMapper.selectOriginPoints();
        List<Map<String, Object>> result = new ArrayList<>();

        for (CoffeeOrigin origin : origins) {
            Map<String, Object> point = new HashMap<>();
            point.put("id", origin.getId());
            point.put("name", origin.getName());
            point.put("nameEn", origin.getNameEn());
            point.put("x", origin.getXPosition());
            point.put("y", origin.getYPosition());
            point.put("color", origin.getColor());
            result.add(point);
        }

        return CompletableFuture.completedFuture(result);
    }

    @Override
    public CoffeeOrigin getOriginById(Long id) {
        return originMapper.selectById(id);
    }

    @Override
    public List<CoffeeOrigin> getAllOrigins() {
        return originMapper.selectList(null);
    }
}
