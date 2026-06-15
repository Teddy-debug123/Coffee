package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.CoffeeBlendDetail;
import com.example.coffeeonline.entity.CoffeeBlendRecord;

import java.util.List;
import java.util.Map;

public interface BlendService {

    CoffeeBlendRecord saveBlend(Long userId, String blendName, Integer totalWeight, 
                                 List<Map<String, Object>> beans, String description);

    List<CoffeeBlendRecord> getBlendRecords(Long userId);

    List<CoffeeBlendDetail> getBlendDetails(Long blendId);
}
