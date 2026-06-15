package com.example.coffeeonline.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("coffee_bean")
public class CoffeeBean {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("name")
    private String name;

    @TableField("origin")
    private String origin;

    @TableField("region")
    private String region;

    @TableField("altitude")
    private String altitude;

    @TableField("process")
    private String process;

    @TableField("variety")
    private String variety;

    @TableField("description")
    private String description;

    @TableField("price")
    private BigDecimal price;

    @TableField("weight")
    private String weight;

    @TableField("aroma")
    private String aroma;

    @TableField("acidity")
    private Integer acidity;

    @TableField("bitterness")
    private Integer bitterness;

    @TableField("body")
    private Integer body;

    @TableField("image")
    private String image;

    @TableField("stock")
    private Integer stock;

    @TableField("sales_count")
    private Integer salesCount;

    @TableField("review_count")
    private Integer reviewCount;

    @TableField("rating")
    private BigDecimal rating;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    @TableField("status")
    private Integer status;
}
