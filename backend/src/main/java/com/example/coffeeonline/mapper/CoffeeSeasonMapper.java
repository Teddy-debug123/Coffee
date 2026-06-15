package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeSeason;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CoffeeSeasonMapper extends BaseMapper<CoffeeSeason> {

    @Select("SELECT * FROM coffee_season WHERE name = #{name}")
    CoffeeSeason selectByName(@Param("name") String name);

    @Select("SELECT * FROM coffee_season WHERE #{month} BETWEEN start_month AND end_month")
    CoffeeSeason selectByMonth(@Param("month") Integer month);
}
