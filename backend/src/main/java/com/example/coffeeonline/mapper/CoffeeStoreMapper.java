package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeStore;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeStoreMapper extends BaseMapper<CoffeeStore> {

    @Select("SELECT * FROM coffee_store WHERE city = #{city} AND status = 1")
    List<CoffeeStore> selectByCity(@Param("city") String city);

    @Select("SELECT DISTINCT city FROM coffee_store WHERE status = 1")
    List<String> selectAllCities();
}
