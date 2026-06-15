package com.example.coffeeonline.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("coffee_season_bean")
public class CoffeeSeasonBean {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("bean_id")
    private Long beanId;

    @TableField("season_id")
    private Integer seasonId;

    @TableField("created_at")
    private LocalDateTime createdAt;
}
