package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeBlendRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CoffeeBlendRecordMapper extends BaseMapper<CoffeeBlendRecord> {

    @Select("SELECT * FROM coffee_blend_record WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<CoffeeBlendRecord> selectByUserId(@Param("userId") Long userId);
}
