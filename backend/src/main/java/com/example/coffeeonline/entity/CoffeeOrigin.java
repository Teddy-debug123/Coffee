package com.example.coffeeonline.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("coffee_origin")
public class CoffeeOrigin {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("name")
    private String name;

    @TableField("name_en")
    private String nameEn;

    @TableField("x_position")
    private Double xPosition;

    @TableField("y_position")
    private Double yPosition;

    @TableField("color")
    private String color;

    @TableField("altitude")
    private String altitude;

    @TableField("varieties")
    private String varieties;

    @TableField("flavors")
    private String flavors;

    @TableField("season")
    private String season;

    @TableField("roast_level")
    private String roastLevel;

    @TableField("description")
    private String description;

    @TableField("sort_order")
    private Integer sortOrder;

    @TableField("status")
    private Integer status;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
