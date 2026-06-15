package com.example.coffeeonline.service.impl;

import com.example.coffeeonline.entity.CoffeeBlendDetail;
import com.example.coffeeonline.entity.CoffeeBlendRecord;
import com.example.coffeeonline.mapper.CoffeeBlendDetailMapper;
import com.example.coffeeonline.mapper.CoffeeBlendRecordMapper;
import com.example.coffeeonline.service.BlendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class BlendServiceImpl implements BlendService {

    @Autowired
    private CoffeeBlendRecordMapper recordMapper;

    @Autowired
    private CoffeeBlendDetailMapper detailMapper;

    @Override
    @Transactional
    @Async("coffeeThreadPool")
    public CoffeeBlendRecord saveBlend(Long userId, String blendName, Integer totalWeight, 
                                        List<Map<String, Object>> beans, String description) {
        CoffeeBlendRecord record = new CoffeeBlendRecord();
        record.setUserId(userId);
        record.setBlendName(blendName);
        record.setTotalWeight(totalWeight);
        record.setDescription(description);
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());

        recordMapper.insert(record);

        for (Map<String, Object> bean : beans) {
            CoffeeBlendDetail detail = new CoffeeBlendDetail();
            detail.setBlendId(record.getId());
            detail.setBeanId(((Number) bean.get("beanId")).longValue());
            detail.setWeight(((Number) bean.get("weight")).intValue());
            detail.setProportion(new BigDecimal(String.valueOf(bean.get("proportion"))));
            detailMapper.insert(detail);
        }

        return record;
    }

    @Override
    @Async("coffeeThreadPool")
    public List<CoffeeBlendRecord> getBlendRecords(Long userId) {
        return recordMapper.selectByUserId(userId);
    }

    @Override
    @Async("coffeeThreadPool")
    public List<CoffeeBlendDetail> getBlendDetails(Long blendId) {
        return detailMapper.selectByBlendId(blendId);
    }
}
