package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeBean;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeBeanMapper extends BaseMapper<CoffeeBean> {

    @Select("SELECT b.* FROM coffee_bean b " +
            "JOIN coffee_season_bean sb ON b.id = sb.bean_id " +
            "WHERE sb.season_id = #{seasonId} AND b.status = 1")
    List<CoffeeBean> selectBySeasonId(@Param("seasonId") Integer seasonId);

    @Select("SELECT DISTINCT b.origin FROM coffee_bean b WHERE b.status = 1")
    List<String> selectAllOrigins();

    @Select("SELECT * FROM coffee_bean WHERE status = 1 ORDER BY sales_count DESC LIMIT #{limit}")
    List<CoffeeBean> selectTopSelling(@Param("limit") Integer limit);
}
