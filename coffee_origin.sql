CREATE TABLE IF NOT EXISTS coffee_origin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '产地名称',
    name_en VARCHAR(100) COMMENT '英文名',
    x_position DECIMAL(5,2) NOT NULL COMMENT '地图X坐标(百分比)',
    y_position DECIMAL(5,2) NOT NULL COMMENT '地图Y坐标(百分比)',
    color VARCHAR(20) COMMENT '点位颜色',
    altitude VARCHAR(50) COMMENT '海拔范围',
    varieties TEXT COMMENT '主要品种(逗号分隔)',
    flavors TEXT COMMENT '风味特征(逗号分隔)',
    season VARCHAR(50) COMMENT '采收季节',
    roast_level VARCHAR(20) COMMENT '推荐烘焙等级',
    description TEXT COMMENT '产区介绍',
    sort_order INT DEFAULT 0 COMMENT '排序号',
    status TINYINT DEFAULT 1 COMMENT '状态(0禁用,1启用)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='咖啡产地表';

INSERT INTO coffee_origin (name, name_en, x_position, y_position, color, altitude, varieties, flavors, season, roast_level, description) VALUES
('埃塞俄比亚', 'Ethiopia', 28.00, 35.00, '#C4A35A', '1,500-2,200m', '耶加雪菲,西达摩,哈拉尔', '柑橘,花香,蜂蜜,红茶', '11月-次年2月', '浅度烘焙', '咖啡的发源地，拥有最丰富的咖啡基因库。独特的花香和果香使其成为精品咖啡的代名词。'),
('哥伦比亚', 'Colombia', 22.00, 58.00, '#A67B5B', '1,300-1,800m', '卡斯蒂略,卡杜拉,波旁', '坚果,焦糖,柑橘,可可', '9月-12月', '中度烘焙', '世界第二大咖啡生产国，以均衡的口感和温和的酸度著称，适合日常饮用。'),
('危地马拉', 'Guatemala', 20.00, 53.00, '#8B6914', '1,500-1,800m', '波旁,帕卡斯,卡杜拉', '黑巧克力,烟熏,水果,香料', '11月-次年2月', '中深度烘焙', '火山土壤孕育出复杂风味，带有独特的烟熏和香料气息。'),
('巴西', 'Brazil', 28.00, 68.00, '#B8860B', '1,000-1,500m', '喜拉朵,波旁,卡杜艾', '坚果,巧克力,焦糖,柔和酸度', '5月-9月', '中度烘焙', '世界最大的咖啡生产国，口感醇厚，带有浓郁的坚果和巧克力风味。'),
('肯尼亚', 'Kenya', 35.00, 42.00, '#CD853F', '1,700-2,100m', 'SL28,SL34,Ruiru11', '黑醋栗,番茄,红酒,明亮酸度', '10月-12月', '浅度烘焙', '以独特的黑醋栗风味和明亮酸度闻名，是非洲精品咖啡的代表。'),
('印尼', 'Indonesia', 72.00, 48.00, '#8B4513', '1,100-1,500m', '曼特宁,耶加,罗布斯塔', '草本,泥土,雪松,低酸度', '6月-9月', '深度烘焙', '亚洲咖啡的代表，具有浓郁的草本和泥土风味，适合制作意式咖啡。'),
('云南', 'Yunnan', 62.00, 38.00, '#D2691E', '1,400-1,800m', '卡蒂姆,铁皮卡,波旁', '坚果,红糖,柑橘,柔和花香', '10月-12月', '中度烘焙', '中国咖啡的主产区，高海拔种植带来丰富的层次感和柔和的酸度。'),
('哥斯达黎加', 'Costa Rica', 18.00, 56.00, '#CD5C5C', '1,200-1,700m', '卡杜拉,卡杜艾,帕卡斯', '柑橘,蜂蜜,坚果,明亮', '12月-3月', '浅中度烘焙', '以严格的水洗处理法著称，口感干净，酸度明亮。');