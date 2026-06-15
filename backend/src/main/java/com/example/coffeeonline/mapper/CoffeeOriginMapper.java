package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeOrigin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeOriginMapper extends BaseMapper<CoffeeOrigin> {

    @Select("SELECT id, name, name_en as nameEn, x_position as xPosition, y_position as yPosition, color " +
            "FROM coffee_origin WHERE status = 1 ORDER BY sort_order")
    List<CoffeeOrigin> selectOriginPoints();
}
