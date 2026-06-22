package com.example.coffeeonline.service;

import com.example.coffeeonline.entity.EmailSubscription;

public interface SubscriptionService {

    EmailSubscription subscribe(String email);

    boolean unsubscribe(String email);

    boolean isSubscribed(String email);

    EmailSubscription getByEmail(String email);
}
