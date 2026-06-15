package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.CoffeeBean;
import com.example.coffeeonline.entity.CoffeeEquipment;

import java.util.List;

public interface ProductService {

    List<CoffeeBean> getAllBeans();

    List<CoffeeBean> getBeansBySeason(Integer seasonId);

    List<CoffeeBean> getBeansByOrigin(String origin);

    List<CoffeeBean> getTopSellingBeans(Integer limit);

    CoffeeBean getBeanById(Long id);

    List<CoffeeEquipment> getAllEquipment();

    List<CoffeeEquipment> getEquipmentByCategory(String category);

    CoffeeEquipment getEquipmentById(Long id);

    List<String> getAllBeanOrigins();

    List<String> getAllEquipmentCategories();
}
