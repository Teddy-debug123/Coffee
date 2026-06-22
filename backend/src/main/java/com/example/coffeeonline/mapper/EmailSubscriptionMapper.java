package com.example.coffeeonline.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.coffeeonline.entity.EmailSubscription;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EmailSubscriptionMapper extends BaseMapper<EmailSubscription> {

    EmailSubscription selectByEmail(@Param("email") String email);
}
