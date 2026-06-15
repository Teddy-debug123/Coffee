-- --------------------------------------------------------
-- 咖啡在线项目数据库建表语句
-- 版本: 1.0
-- 数据库: MySQL 8.0+
-- --------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 表结构: 用户表 (coffee_user)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_user`;
CREATE TABLE `coffee_user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱地址',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号码',
  `gender` TINYINT(1) DEFAULT 0 COMMENT '性别: 0-未知, 1-男, 2-女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- --------------------------------------------------------
-- 表结构: 咖啡豆表 (coffee_bean)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_bean`;
CREATE TABLE `coffee_bean` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '咖啡豆ID',
  `name` VARCHAR(100) NOT NULL COMMENT '咖啡豆名称',
  `origin` VARCHAR(100) NOT NULL COMMENT '产地',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '产区',
  `altitude` VARCHAR(50) DEFAULT NULL COMMENT '海拔',
  `process` VARCHAR(50) DEFAULT NULL COMMENT '处理方式: 水洗/日晒/蜜处理等',
  `variety` VARCHAR(100) DEFAULT NULL COMMENT '品种',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格(元)',
  `weight` VARCHAR(20) NOT NULL COMMENT '规格重量: 250g/500g/1kg等',
  `aroma` VARCHAR(200) DEFAULT NULL COMMENT '风味描述',
  `acidity` TINYINT(1) DEFAULT 3 COMMENT '酸度等级(1-5)',
  `bitterness` TINYINT(1) DEFAULT 3 COMMENT '苦度等级(1-5)',
  `body` TINYINT(1) DEFAULT 3 COMMENT '醇厚度等级(1-5)',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '图片URL',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `sales_count` INT NOT NULL DEFAULT 0 COMMENT '销量',
  `review_count` INT NOT NULL DEFAULT 0 COMMENT '评价数',
  `rating` DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
  PRIMARY KEY (`id`),
  KEY `idx_origin` (`origin`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='咖啡豆表';

-- --------------------------------------------------------
-- 表结构: 咖啡器具表 (coffee_equipment)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_equipment`;
CREATE TABLE `coffee_equipment` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '器具ID',
  `name` VARCHAR(100) NOT NULL COMMENT '器具名称',
  `category` VARCHAR(50) NOT NULL COMMENT '分类: brewing-冲煮器具, barista-咖啡师工具',
  `sub_category` VARCHAR(50) DEFAULT NULL COMMENT '子分类: 手冲壶/磨豆机/咖啡机/奶泡器等',
  `brand` VARCHAR(50) DEFAULT NULL COMMENT '品牌',
  `material` VARCHAR(100) DEFAULT NULL COMMENT '材质',
  `specification` VARCHAR(200) DEFAULT NULL COMMENT '规格参数',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格(元)',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '图片URL',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `sales_count` INT NOT NULL DEFAULT 0 COMMENT '销量',
  `review_count` INT NOT NULL DEFAULT 0 COMMENT '评价数',
  `rating` DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='咖啡器具表';

-- --------------------------------------------------------
-- 表结构: 季节表 (coffee_season)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_season`;
CREATE TABLE `coffee_season` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '季节ID',
  `name` VARCHAR(20) NOT NULL COMMENT '季节名称: spring/summer/autumn/winter',
  `display_name` VARCHAR(20) NOT NULL COMMENT '显示名称: 春季/夏季/秋季/冬季',
  `start_month` TINYINT(1) NOT NULL COMMENT '开始月份',
  `end_month` TINYINT(1) NOT NULL COMMENT '结束月份',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='季节表';

-- 初始化季节数据
INSERT INTO `coffee_season` (`id`, `name`, `display_name`, `start_month`, `end_month`) VALUES
(1, 'spring', '春季', 3, 5),
(2, 'summer', '夏季', 6, 8),
(3, 'autumn', '秋季', 9, 11),
(4, 'winter', '冬季', 12, 2);

-- --------------------------------------------------------
-- 表结构: 季节咖啡豆关联表 (coffee_season_bean)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_season_bean`;
CREATE TABLE `coffee_season_bean` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `bean_id` BIGINT UNSIGNED NOT NULL COMMENT '咖啡豆ID',
  `season_id` TINYINT UNSIGNED NOT NULL COMMENT '季节ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bean_season` (`bean_id`, `season_id`),
  KEY `idx_bean_id` (`bean_id`),
  KEY `idx_season_id` (`season_id`),
  CONSTRAINT `fk_season_bean_bean` FOREIGN KEY (`bean_id`) REFERENCES `coffee_bean` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_season_bean_season` FOREIGN KEY (`season_id`) REFERENCES `coffee_season` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='季节咖啡豆关联表';

-- --------------------------------------------------------
-- 表结构: 拼配豆记录表 (coffee_blend_record)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_blend_record`;
CREATE TABLE `coffee_blend_record` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '拼配记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `blend_name` VARCHAR(100) DEFAULT NULL COMMENT '自定义拼配名称',
  `total_weight` INT NOT NULL COMMENT '总克重(g)',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_blend_user` FOREIGN KEY (`user_id`) REFERENCES `coffee_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼配豆记录表';

-- --------------------------------------------------------
-- 表结构: 拼配豆明细 (coffee_blend_detail)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_blend_detail`;
CREATE TABLE `coffee_blend_detail` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `blend_id` BIGINT UNSIGNED NOT NULL COMMENT '拼配记录ID',
  `bean_id` BIGINT UNSIGNED NOT NULL COMMENT '咖啡豆ID',
  `weight` INT NOT NULL COMMENT '克重(g)',
  `proportion` DECIMAL(5,2) NOT NULL COMMENT '配比(%)',
  PRIMARY KEY (`id`),
  KEY `idx_blend_id` (`blend_id`),
  KEY `idx_bean_id` (`bean_id`),
  CONSTRAINT `fk_blend_detail_blend` FOREIGN KEY (`blend_id`) REFERENCES `coffee_blend_record` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blend_detail_bean` FOREIGN KEY (`bean_id`) REFERENCES `coffee_bean` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼配豆明细表';

-- --------------------------------------------------------
-- 表结构: 购物车表 (coffee_cart)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_cart`;
CREATE TABLE `coffee_cart` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_type` VARCHAR(20) NOT NULL COMMENT '商品类型: bean-咖啡豆, equipment-器具',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
  `selected` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否选中: 0-否, 1-是',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`, `product_type`, `product_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `coffee_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- --------------------------------------------------------
-- 表结构: 线下门店表 (coffee_store)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_store`;
CREATE TABLE `coffee_store` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '门店ID',
  `name` VARCHAR(100) NOT NULL COMMENT '门店名称',
  `address` VARCHAR(200) NOT NULL COMMENT '地址',
  `city` VARCHAR(50) NOT NULL COMMENT '城市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区/县',
  `latitude` DECIMAL(10,7) NOT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) NOT NULL COMMENT '经度',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `description` TEXT DEFAULT NULL COMMENT '门店描述',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '门店图片',
  `rating` DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
  `review_count` INT NOT NULL DEFAULT 0 COMMENT '评价数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态: 0-关闭, 1-营业',
  PRIMARY KEY (`id`),
  KEY `idx_city` (`city`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='线下门店表';

-- --------------------------------------------------------
-- 表结构: 用户评价表 (coffee_review)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coffee_review`;
CREATE TABLE `coffee_review` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_type` VARCHAR(20) NOT NULL COMMENT '商品类型: bean-咖啡豆, equipment-器具',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `rating` TINYINT(1) NOT NULL COMMENT '评分(1-5)',
  `content` TEXT DEFAULT NULL COMMENT '评价内容',
  `images` TEXT DEFAULT NULL COMMENT '图片URL(逗号分隔)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product` (`product_type`, `product_id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `coffee_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户评价表';

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 插入初始数据
-- --------------------------------------------------------

-- 咖啡豆初始数据
INSERT INTO `coffee_bean` (`name`, `origin`, `region`, `altitude`, `process`, `variety`, `description`, `price`, `weight`, `aroma`, `acidity`, `bitterness`, `body`, `stock`, `sales_count`, `review_count`, `rating`) VALUES
('埃塞俄比亚 耶加雪菲', '埃塞俄比亚', '耶加雪菲', '1700-2100m', '水洗', 'Heirloom', '花香果香浓郁，口感柔和，带有柑橘与茉莉的清新风味', 128.00, '250g', '柑橘、茉莉、蜂蜜、柠檬', 4, 2, 3, 100, 328, 328, 4.8),
('哥伦比亚 慧兰', '哥伦比亚', '慧兰', '1500-1800m', '水洗', 'Castillo', '坚果巧克力风味，醇厚顺滑，平衡感极佳', 98.00, '250g', '坚果、巧克力、焦糖', 3, 3, 4, 200, 256, 256, 4.6),
('云南 普洱咖啡豆', '中国', '云南普洱', '1300-1600m', '蜜处理', 'Catimor', '坚果焦糖香气，酸度适中，回甘持久', 68.00, '250g', '坚果、焦糖、红糖', 3, 3, 4, 300, 189, 189, 4.5),
('危地马拉 安提瓜', '危地马拉', '安提瓜', '1500-1700m', '水洗', 'Bourbon', '烟熏可可风味，浓郁醇厚，层次丰富', 118.00, '250g', '烟熏、可可、黑巧克力', 3, 4, 4, 80, 145, 145, 4.7),
('肯尼亚 AA级', '肯尼亚', '涅里', '1700-1900m', '水洗', 'SL28', '黑醋栗与红酒般的酸度，明亮活泼', 138.00, '250g', '黑醋栗、红酒、番茄', 5, 2, 3, 60, 98, 98, 4.8),
('巴西 喜拉朵', '巴西', '喜拉朵', '1100-1400m', '自然日晒', 'Bourbon', '坚果奶油风味，温和顺滑，适合日常饮用', 78.00, '250g', '坚果、奶油、巧克力', 2, 3, 4, 500, 423, 423, 4.4);

-- 季节咖啡豆关联数据
INSERT INTO `coffee_season_bean` (`bean_id`, `season_id`) VALUES
(1, 1), (2, 2), (2, 4), (3, 3), (4, 3), (4, 4), (5, 1), (6, 2);

-- 咖啡器具初始数据
INSERT INTO `coffee_equipment` (`name`, `category`, `sub_category`, `brand`, `material`, `specification`, `description`, `price`, `stock`, `sales_count`, `review_count`, `rating`) VALUES
('手冲壶', 'brewing', 'pour_over_kettle', 'HARIO', '不锈钢', '容量: 1.2L', '细长壶嘴，精准控流，适合手冲咖啡', 398.00, 50, 120, 120, 4.7),
('电动磨豆机', 'brewing', 'grinder', 'Baratza', '铝合金/不锈钢', '40mm平刀盘，10档可调', '专业级磨豆机，研磨均匀，静音设计', 1299.00, 30, 85, 85, 4.8),
('V60滤杯', 'brewing', 'dripper', 'HARIO', '陶瓷', '01/02号尺寸', '经典V型滤杯，萃取均匀，风味突出', 128.00, 100, 234, 234, 4.6),
('法式压滤壶', 'brewing', 'french_press', 'Bodum', '玻璃/不锈钢', '容量: 8杯', '简单易用，保留咖啡油脂，口感醇厚', 268.00, 80, 167, 167, 4.5),
('意式咖啡机', 'brewing', 'espresso_machine', 'Gaggia', '不锈钢', '15bar压力，蒸汽奶泡', '家用意式咖啡机，一键萃取', 2999.00, 20, 45, 45, 4.7),
('奶泡器', 'barista', 'milk_frother', 'Nespresso', '不锈钢', '电动打奶泡', '快速打制绵密奶泡，适合拿铁卡布奇诺', 399.00, 60, 98, 98, 4.6),
('咖啡温度计', 'barista', 'thermometer', 'Comark', '不锈钢', '探针式，0-100°C', '精准测温，确保萃取温度', 89.00, 150, 203, 203, 4.5),
('拉花缸', 'barista', 'milk_pitcher', 'WBC', '不锈钢', '容量: 600ml', '专业拉花缸，鹰嘴设计，易于控制', 168.00, 100, 145, 145, 4.6);

-- 线下门店初始数据
INSERT INTO `coffee_store` (`name`, `address`, `city`, `district`, `latitude`, `longitude`, `phone`, `business_hours`, `description`, `rating`, `review_count`) VALUES
('咖啡在线 旗舰店', '上海市静安区南京西路1266号', '上海', '静安区', 31.2397, 121.4998, '021-12345678', '08:00-22:00', '位于市中心繁华地段，提供精品咖啡与舒适的休闲空间', 4.8, 526),
('咖啡在线 徐家汇店', '上海市徐汇区虹桥路1号', '上海', '徐汇区', 31.2175, 121.4367, '021-23456789', '07:30-21:30', '紧邻商圈，适合商务人士休闲办公', 4.7, 312),
('咖啡在线 杭州湖滨店', '杭州市上城区延安路258号', '杭州', '上城区', 30.2741, 120.1553, '0571-34567890', '08:00-22:00', '西湖畔的咖啡体验店，环境优雅', 4.9, 445),
('咖啡在线 深圳海岸城店', '深圳市南山区文心五路33号', '深圳', '南山区', 22.5333, 113.9258, '0755-45678901', '08:00-22:30', '滨海商圈，现代简约风格', 4.6, 289),
('咖啡在线 北京三里屯店', '北京市朝阳区三里屯路19号', '北京', '朝阳区', 39.9371, 116.4426, '010-56789012', '07:00-23:00', '潮流聚集地，时尚咖啡体验', 4.7, 378);

COMMIT;