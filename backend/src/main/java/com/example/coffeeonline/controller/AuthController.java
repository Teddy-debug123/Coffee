package com.example.coffeeonline.controller;

import com.example.coffeeonline.entity.CoffeeUser;
import com.example.coffeeonline.service.UserService;
import com.example.coffeeonline.utils.CaptchaStore;
import com.example.coffeeonline.utils.CaptchaUtil;
import com.example.coffeeonline.utils.JwtUtil;
import com.example.coffeeonline.utils.Result;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CaptchaUtil captchaUtil;

    @Autowired
    private CaptchaStore captchaStore;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request) {
        
        String storedCaptcha = captchaStore.getCaptcha(request.getCaptchaToken());
        if (storedCaptcha == null || !storedCaptcha.equalsIgnoreCase(request.getCaptcha())) {
            return Result.badRequest("验证码错误");
        }

        CoffeeUser user = userService.login(request.getUsername(), request.getPassword());
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", buildUserInfo(user));

        captchaStore.removeCaptcha(request.getCaptchaToken());
        return Result.success("登录成功", data);
    }

    @PostMapping("/register")
    public Result<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request) {
        
        String storedCaptcha = captchaStore.getCaptcha(request.getCaptchaToken());
        if (storedCaptcha == null || !storedCaptcha.equalsIgnoreCase(request.getCaptcha())) {
            return Result.badRequest("验证码错误");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return Result.badRequest("两次输入的密码不一致");
        }

        CoffeeUser user = userService.register(request.getUsername(), request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", buildUserInfo(user));

        captchaStore.removeCaptcha(request.getCaptchaToken());
        return Result.success("注册成功", data);
    }

    @PostMapping("/forgot-password")
    public Result<Object> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        
        String storedCaptcha = captchaStore.getCaptcha(request.getCaptchaToken());
        if (storedCaptcha == null || !storedCaptcha.equalsIgnoreCase(request.getCaptcha())) {
            return Result.badRequest("验证码错误");
        }

        CoffeeUser user = userService.getUserByEmail(request.getEmail());
        if (user == null) {
            return Result.badRequest("该邮箱未注册");
        }

        captchaStore.removeCaptcha(request.getCaptchaToken());
        return Result.success("重置链接已发送到您的邮箱");
    }

    @PostMapping("/reset-password")
    public Result<Object> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getEmail(), request.getPassword());
        return Result.success("密码重置成功");
    }

    @GetMapping("/captcha")
    public Result<Map<String, String>> getCaptcha() {
        String captcha = captchaUtil.generateCaptcha(4);
        String token = captchaStore.storeCaptcha(captcha);
        
        Map<String, String> data = new HashMap<>();
        data.put("captcha", captcha);
        data.put("captchaToken", token);
        return Result.success(data);
    }

    private Map<String, Object> buildUserInfo(CoffeeUser user) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("email", user.getEmail());
        info.put("nickname", user.getNickname());
        info.put("avatar", user.getAvatar());
        return info;
    }

    public static class LoginRequest {
        @NotBlank(message = "用户名不能为空")
        private String username;

        @NotBlank(message = "密码不能为空")
        private String password;

        @NotBlank(message = "验证码不能为空")
        private String captcha;

        @NotBlank(message = "验证码token不能为空")
        private String captchaToken;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }
        public String getCaptchaToken() { return captchaToken; }
        public void setCaptchaToken(String captchaToken) { this.captchaToken = captchaToken; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "用户名不能为空")
        @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "用户名长度在3到20个字符之间，只能包含字母、数字和下划线")
        private String username;

        @NotBlank(message = "邮箱不能为空")
        @Email(message = "请输入有效的邮箱地址")
        private String email;

        @NotBlank(message = "密码不能为空")
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).{6,}$", message = "密码需包含字母和数字，长度至少6位")
        private String password;

        @NotBlank(message = "确认密码不能为空")
        private String confirmPassword;

        @NotBlank(message = "验证码不能为空")
        private String captcha;

        @NotBlank(message = "验证码token不能为空")
        private String captchaToken;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }
        public String getCaptchaToken() { return captchaToken; }
        public void setCaptchaToken(String captchaToken) { this.captchaToken = captchaToken; }
    }

    public static class ForgotPasswordRequest {
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "请输入有效的邮箱地址")
        private String email;

        @NotBlank(message = "验证码不能为空")
        private String captcha;

        @NotBlank(message = "验证码token不能为空")
        private String captchaToken;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }
        public String getCaptchaToken() { return captchaToken; }
        public void setCaptchaToken(String captchaToken) { this.captchaToken = captchaToken; }
    }

    public static class ResetPasswordRequest {
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "请输入有效的邮箱地址")
        private String email;

        @NotBlank(message = "密码不能为空")
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).{6,}$", message = "密码需包含字母和数字，长度至少6位")
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
