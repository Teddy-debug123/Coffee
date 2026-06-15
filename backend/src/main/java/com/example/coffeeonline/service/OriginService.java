package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.CoffeeOrigin;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface OriginService {

    CompletableFuture<List<Map<String, Object>>> getAllOriginPoints();

    CoffeeOrigin getOriginById(Long id);

    List<CoffeeOrigin> getAllOrigins();
}
