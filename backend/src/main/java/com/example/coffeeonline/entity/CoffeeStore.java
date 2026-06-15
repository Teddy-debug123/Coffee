package com.example.coffeeonline.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("coffee_store")
public class CoffeeStore {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("name")
    private String name;

    @TableField("address")
    private String address;

    @TableField("city")
    private String city;

    @TableField("district")
    private String district;

    @TableField("latitude")
    private BigDecimal latitude;

    @TableField("longitude")
    private BigDecimal longitude;

    @TableField("phone")
    private String phone;

    @TableField("business_hours")
    private String businessHours;

    @TableField("description")
    private String description;

    @TableField("image")
    private String image;

    @TableField("rating")
    private BigDecimal rating;

    @TableField("review_count")
    private Integer reviewCount;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    @TableField("status")
    private Integer status;
}
