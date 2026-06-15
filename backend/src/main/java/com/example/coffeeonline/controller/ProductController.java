package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeBean;
import com.example.coffeeonline.entity.CoffeeEquipment;
import com.example.coffeeonline.service.ProductService;
import com.example.coffeeonline.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/beans")
    public Result<List<CoffeeBean>> getBeans(
            @RequestParam(required = false) Integer seasonId,
            @RequestParam(required = false) String origin) {
        
        List<CoffeeBean> beans;
        if (seasonId != null) {
            beans = productService.getBeansBySeason(seasonId);
        } else if (origin != null && !origin.isEmpty()) {
            beans = productService.getBeansByOrigin(origin);
        } else {
            beans = productService.getAllBeans();
        }
        return Result.success(beans);
    }

    @GetMapping("/beans/{id}")
    public Result<CoffeeBean> getBeanById(@PathVariable Long id) {
        CoffeeBean bean = productService.getBeanById(id);
        if (bean == null) {
            return Result.badRequest("咖啡豆不存在");
        }
        return Result.success(bean);
    }

    @GetMapping("/beans/origins")
    public Result<List<String>> getBeanOrigins() {
        return Result.success(productService.getAllBeanOrigins());
    }

    @GetMapping("/beans/top-selling")
    public Result<List<CoffeeBean>> getTopSellingBeans(
            @RequestParam(defaultValue = "6") Integer limit) {
        return Result.success(productService.getTopSellingBeans(limit));
    }

    @GetMapping("/equipment")
    public Result<List<CoffeeEquipment>> getEquipment(
            @RequestParam(required = false) String category) {
        
        List<CoffeeEquipment> equipment;
        if (category != null && !category.isEmpty()) {
            equipment = productService.getEquipmentByCategory(category);
        } else {
            equipment = productService.getAllEquipment();
        }
        return Result.success(equipment);
    }

    @GetMapping("/equipment/{id}")
    public Result<CoffeeEquipment> getEquipmentById(@PathVariable Long id) {
        CoffeeEquipment equipment = productService.getEquipmentById(id);
        if (equipment == null) {
            return Result.badRequest("器具不存在");
        }
        return Result.success(equipment);
    }

    @GetMapping("/equipment/categories")
    public Result<List<String>> getEquipmentCategories() {
        return Result.success(productService.getAllEquipmentCategories());
    }
}
