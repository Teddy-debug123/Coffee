package com.example.coffeeonline.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("coffee_equipment")
public class CoffeeEquipment {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("name")
    private String name;

    @TableField("category")
    private String category;

    @TableField("sub_category")
    private String subCategory;

    @TableField("brand")
    private String brand;

    @TableField("material")
    private String material;

    @TableField("specification")
    private String specification;

    @TableField("description")
    private String description;

    @TableField("price")
    private BigDecimal price;

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
