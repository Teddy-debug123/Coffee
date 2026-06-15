package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.CoffeeUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CoffeeUserMapper extends BaseMapper<CoffeeUser> {

    CoffeeUser selectByUsername(@Param("username") String username);

    CoffeeUser selectByEmail(@Param("email") String email);

    int updatePasswordByEmail(@Param("email") String email, @Param("password") String password);
}
