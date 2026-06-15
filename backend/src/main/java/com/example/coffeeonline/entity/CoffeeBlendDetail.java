package com.example.coffeeonline.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("coffee_blend_detail")
public class CoffeeBlendDetail {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("blend_id")
    private Long blendId;

    @TableField("bean_id")
    private Long beanId;

    @TableField("weight")
    private Integer weight;

    @TableField("proportion")
    private BigDecimal proportion;
}
