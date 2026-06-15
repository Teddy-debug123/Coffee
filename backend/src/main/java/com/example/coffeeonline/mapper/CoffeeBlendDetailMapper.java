package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeBlendDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeBlendDetailMapper extends BaseMapper<CoffeeBlendDetail> {

    @Select("SELECT d.* FROM coffee_blend_detail d JOIN coffee_blend_record r ON d.blend_id = r.id WHERE r.user_id = #{userId}")
    List<CoffeeBlendDetail> selectByUserId(@Param("userId") Long userId);

    @Select("SELECT * FROM coffee_blend_detail WHERE blend_id = #{blendId}")
    List<CoffeeBlendDetail> selectByBlendId(@Param("blendId") Long blendId);

    @Delete("DELETE FROM coffee_blend_detail WHERE blend_id = #{blendId}")
    void deleteByBlendId(@Param("blendId") Long blendId);
}
