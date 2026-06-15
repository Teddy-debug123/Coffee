package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeEquipment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeEquipmentMapper extends BaseMapper<CoffeeEquipment> {

    @Select("SELECT * FROM coffee_equipment WHERE category = #{category} AND status = 1")
    List<CoffeeEquipment> selectByCategory(@Param("category") String category);

    @Select("SELECT DISTINCT category FROM coffee_equipment WHERE status = 1")
    List<String> selectAllCategories();
}
