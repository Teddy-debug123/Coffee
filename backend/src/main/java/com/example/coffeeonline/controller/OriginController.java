package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeOrigin;
import com.example.coffeeonline.service.OriginService;
import com.example.coffeeonline.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/origin")
public class OriginController {

    @Autowired
    private OriginService originService;

    @GetMapping("/points")
    public CompletableFuture<Result<List<Map<String, Object>>>> getOriginPoints() {
        return originService.getAllOriginPoints()
                .thenApply(points -> Result.success(points));
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> getOriginDetail(@PathVariable Long id) {
        CoffeeOrigin origin = originService.getOriginById(id);
        if (origin == null) {
            return Result.badRequest("产地不存在");
        }

        Map<String, Object> detail = new HashMap<>();
        detail.put("id", origin.getId());
        detail.put("name", origin.getName());
        detail.put("nameEn", origin.getNameEn());
        detail.put("x", origin.getXPosition());
        detail.put("y", origin.getYPosition());
        detail.put("color", origin.getColor());
        detail.put("altitude", origin.getAltitude());
        detail.put("varieties", origin.getVarieties() != null ? origin.getVarieties().split(",") : new String[0]);
        detail.put("flavors", origin.getFlavors() != null ? origin.getFlavors().split(",") : new String[0]);
        detail.put("season", origin.getSeason());
        detail.put("roastLevel", origin.getRoastLevel());
        detail.put("description", origin.getDescription());

        return Result.success(detail);
    }

    @GetMapping("/list")
    public Result<List<CoffeeOrigin>> getAllOrigins() {
        List<CoffeeOrigin> origins = originService.getAllOrigins();
        return Result.success(origins);
    }
}
