package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeBlendDetail;
import com.example.coffeeonline.entity.CoffeeBlendRecord;
import com.example.coffeeonline.service.BlendService;
import com.example.coffeeonline.utils.JwtUtil;
import com.example.coffeeonline.utils.Result;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blend")
@Validated
public class BlendController {

    @Autowired
    private BlendService blendService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/save")
    public Result<CoffeeBlendRecord> saveBlend(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody BlendRequest request) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        CoffeeBlendRecord record = blendService.saveBlend(
                userId,
                request.getBlendName(),
                request.getTotalWeight(),
                request.getBeans(),
                request.getDescription()
        );
        return Result.success("拼配记录保存成功", record);
    }

    @GetMapping("/records")
    public Result<List<CoffeeBlendRecord>> getBlendRecords(
            @RequestHeader("Authorization") String token) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        List<CoffeeBlendRecord> records = blendService.getBlendRecords(userId);
        return Result.success(records);
    }

    @GetMapping("/details/{blendId}")
    public Result<List<CoffeeBlendDetail>> getBlendDetails(@PathVariable Long blendId) {
        List<CoffeeBlendDetail> details = blendService.getBlendDetails(blendId);
        return Result.success(details);
    }

    public static class BlendRequest {
        private String blendName;

        @NotNull(message = "总克重不能为空")
        private Integer totalWeight;

        @NotEmpty(message = "咖啡豆列表不能为空")
        private List<Map<String, Object>> beans;

        private String description;

        public String getBlendName() { return blendName; }
        public void setBlendName(String blendName) { this.blendName = blendName; }
        public Integer getTotalWeight() { return totalWeight; }
        public void setTotalWeight(Integer totalWeight) { this.totalWeight = totalWeight; }
        public List<Map<String, Object>> getBeans() { return beans; }
        public void setBeans(List<Map<String, Object>> beans) { this.beans = beans; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
