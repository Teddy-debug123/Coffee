package com.example.coffeeonline.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.coffeeonline.entity.CoffeeBean;
import com.example.coffeeonline.entity.CoffeeEquipment;
import com.example.coffeeonline.mapper.CoffeeBeanMapper;
import com.example.coffeeonline.mapper.CoffeeEquipmentMapper;
import com.example.coffeeonline.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private CoffeeBeanMapper beanMapper;

    @Autowired
    private CoffeeEquipmentMapper equipmentMapper;

    @Override
    public List<CoffeeBean> getAllBeans() {
        QueryWrapper<CoffeeBean> query = new QueryWrapper<>();
        query.eq("status", 1);
        return beanMapper.selectList(query);
    }

    @Override
    public List<CoffeeBean> getBeansBySeason(Integer seasonId) {
        return beanMapper.selectBySeasonId(seasonId);
    }

    @Override
    public List<CoffeeBean> getBeansByOrigin(String origin) {
        QueryWrapper<CoffeeBean> query = new QueryWrapper<>();
        query.eq("status", 1).eq("origin", origin);
        return beanMapper.selectList(query);
    }

    @Override
    public List<CoffeeBean> getTopSellingBeans(Integer limit) {
        return beanMapper.selectTopSelling(limit);
    }

    @Override
    public CoffeeBean getBeanById(Long id) {
        return beanMapper.selectById(id);
    }

    @Override
    public List<CoffeeEquipment> getAllEquipment() {
        QueryWrapper<CoffeeEquipment> query = new QueryWrapper<>();
        query.eq("status", 1);
        return equipmentMapper.selectList(query);
    }

    @Override
    public List<CoffeeEquipment> getEquipmentByCategory(String category) {
        return equipmentMapper.selectByCategory(category);
    }

    @Override
    public CoffeeEquipment getEquipmentById(Long id) {
        return equipmentMapper.selectById(id);
    }

    @Override
    public List<String> getAllBeanOrigins() {
        return beanMapper.selectAllOrigins();
    }

    @Override
    public List<String> getAllEquipmentCategories() {
        return equipmentMapper.selectAllCategories();
    }
}
