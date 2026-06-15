package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeCart;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeCartMapper extends BaseMapper<CoffeeCart> {

    @Select("SELECT * FROM coffee_cart WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<CoffeeCart> selectByUserId(@Param("userId") Long userId);

    @Select("SELECT * FROM coffee_cart WHERE user_id = #{userId} AND product_type = #{productType} AND product_id = #{productId}")
    CoffeeCart selectByUserAndProduct(@Param("userId") Long userId, @Param("productType") String productType, @Param("productId") Long productId);

    @Delete("DELETE FROM coffee_cart WHERE user_id = #{userId}")
    int deleteByUserId(@Param("userId") Long userId);
}
