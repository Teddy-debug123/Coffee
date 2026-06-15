package com.example.coffeeonline.utils;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CaptchaStore {

    private static final long EXPIRATION_TIME = 180000; // 3分钟过期

    private final Map<String, CaptchaInfo> captchaMap = new ConcurrentHashMap<>();

    public String storeCaptcha(String captcha) {
        String token = generateToken();
        captchaMap.put(token, new CaptchaInfo(captcha, System.currentTimeMillis()));
        cleanExpired();
        return token;
    }

    public String getCaptcha(String token) {
        CaptchaInfo info = captchaMap.get(token);
        if (info == null || isExpired(info)) {
            return null;
        }
        return info.captcha;
    }

    public void removeCaptcha(String token) {
        captchaMap.remove(token);
    }

    private boolean isExpired(CaptchaInfo info) {
        return System.currentTimeMillis() - info.timestamp > EXPIRATION_TIME;
    }

    private void cleanExpired() {
        captchaMap.entrySet().removeIf(entry -> isExpired(entry.getValue()));
    }

    private String generateToken() {
        return java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    private static class CaptchaInfo {
        String captcha;
        long timestamp;

        CaptchaInfo(String captcha, long timestamp) {
            this.captcha = captcha;
            this.timestamp = timestamp;
        }
    }
}
