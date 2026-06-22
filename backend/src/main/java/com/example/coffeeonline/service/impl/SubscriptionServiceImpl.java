package com.example.coffeeonline.service.impl;

import com.example.coffeeonline.entity.EmailSubscription;
import com.example.coffeeonline.mapper.EmailSubscriptionMapper;
import com.example.coffeeonline.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private EmailSubscriptionMapper subscriptionMapper;

    @Override
    @Transactional
    public EmailSubscription subscribe(String email) {
        EmailSubscription existing = subscriptionMapper.selectByEmail(email);
        
        if (existing != null) {
            existing.setStatus(1);
            existing.setUpdatedAt(LocalDateTime.now());
            subscriptionMapper.updateById(existing);
            return existing;
        }

        EmailSubscription subscription = new EmailSubscription();
        subscription.setEmail(email);
        subscription.setStatus(1);
        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setUpdatedAt(LocalDateTime.now());

        subscriptionMapper.insert(subscription);
        return subscription;
    }

    @Override
    @Transactional
    public boolean unsubscribe(String email) {
        EmailSubscription existing = subscriptionMapper.selectByEmail(email);
        
        if (existing == null) {
            return false;
        }

        existing.setStatus(0);
        existing.setUpdatedAt(LocalDateTime.now());
        subscriptionMapper.updateById(existing);
        return true;
    }

    @Override
    public boolean isSubscribed(String email) {
        EmailSubscription existing = subscriptionMapper.selectByEmail(email);
        return existing != null && existing.getStatus() == 1;
    }

    @Override
    public EmailSubscription getByEmail(String email) {
        return subscriptionMapper.selectByEmail(email);
    }
}
