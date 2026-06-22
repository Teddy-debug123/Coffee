export const mockCoffeeBeans = [
  {
    id: 1,
    name: '埃塞俄比亚 耶加雪菲',
    origin: '埃塞俄比亚',
    description: '花香果香浓郁，口感柔和，带有柑橘与茉莉的清新风味',
    price: 128,
    weight: '250g',
    reviews: 328,
    season: ['spring'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=premium%20ethiopian%20yirgacheffe%20coffee%20beans%20in%20elegant%20packaging%20minimalist%20style%20warm%20tones&image_size=square'
  },
  {
    id: 2,
    name: '哥伦比亚 慧兰',
    origin: '哥伦比亚',
    description: '坚果巧克力风味，醇厚顺滑，平衡感极佳',
    price: 98,
    weight: '250g',
    reviews: 256,
    season: ['summer', 'winter'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=colombian%20huila%20coffee%20beans%20premium%20packaging%20coffee%20shop%20aesthetic&image_size=square'
  },
  {
    id: 3,
    name: '云南 普洱咖啡豆',
    origin: '中国云南',
    description: '坚果焦糖香气，酸度适中，回甘持久',
    price: 68,
    weight: '250g',
    reviews: 189,
    season: ['autumn'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=yunnan%20chinese%20coffee%20beans%20traditional%20packaging%20warm%20earth%20tones&image_size=square'
  },
  {
    id: 4,
    name: '危地马拉 安提瓜',
    origin: '危地马拉',
    description: '烟熏可可风味，浓郁醇厚，层次丰富',
    price: 118,
    weight: '250g',
    reviews: 145,
    season: ['autumn', 'winter'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=guatemala%20antigua%20coffee%20beans%20dark%20roast%20premium%20quality&image_size=square'
  },
  {
    id: 5,
    name: '肯尼亚 AA级',
    origin: '肯尼亚',
    description: '黑醋栗与红酒般的酸度，明亮活泼',
    price: 138,
    weight: '250g',
    reviews: 98,
    season: ['spring'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=kenya%20aa%20coffee%20beans%20bright%20color%20premium%20presentation&image_size=square'
  },
  {
    id: 6,
    name: '巴西 喜拉朵',
    origin: '巴西',
    description: '坚果奶油风味，温和顺滑，适合日常饮用',
    price: 78,
    weight: '250g',
    reviews: 423,
    season: ['summer'],
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=brazil%20cerrado%20coffee%20beans%20classic%20packaging%20warm%20brown%20tones&image_size=square'
  }
]

export const mockEquipment = [
  {
    id: 1,
    name: 'Breville 870 意式咖啡机',
    category: '咖啡机',
    price: 4999,
    weight: '8.5kg',
    material: '304不锈钢',
    capacity: '2L',
    power: '1800W',
    size: '370×380×410mm',
    suitableFor: '1-4人',
    accessories: '主机×1、手柄×2、粉碗×2、清洁刷×1、说明书×1',
    warranty: '2年质保',
    rating: 4.9,
    stock: 50,
    description: '双锅炉独立控温、专业旋转奶泡系统、压力表可视化萃取、家用商用兼容',
    imageUrl: '/picture/store1.png',
    images: ['/picture/store1.png'],
    specs: [
      { value: '银色', price: 4999 },
      { value: '红色', price: 5199 }
    ],
    characteristics: [
      { title: '双锅炉系统', description: '独立萃取与奶泡锅炉，同时操作互不影响' },
      { title: '精准控温', description: 'PID温控技术，萃取温度稳定在92-96℃' },
      { title: '专业奶泡', description: '蒸汽棒可调节，轻松打出绵密奶泡' },
      { title: '可视化压力表', description: '实时显示萃取压力，确保完美萃取' }
    ],
    usageGuide: '<p>1. 首次使用前，加入清水并连续放水3分钟冲洗管路</p><p>2. 预热机器至少15分钟</p><p>3. 研磨咖啡豆至细砂糖粗细</p><p>4. 填压粉饼，放入手柄开始萃取</p>',
    careTips: '<p>• 每天使用后清洗冲煮头</p><p>• 每周清洗一次蒸汽棒</p><p>• 每月进行一次深度除垢</p><p>• 使用后及时关机，避免空烧</p>',
    reviews: [
      { username: '咖啡爱好者', rating: 5, content: '非常满意！双锅炉设计太棒了，可以一边萃取一边打奶泡，效率很高。', createTime: '2026-01-15', spec: '银色' },
      { username: '专业咖啡师', rating: 5, content: '家用机中的战斗机，性价比很高，出品稳定。', createTime: '2026-01-10', spec: '银色' }
    ]
  },
  {
    id: 2,
    name: 'Hario V60 手冲壶',
    category: '冲煮器具',
    price: 299,
    weight: '350g',
    material: '不锈钢',
    capacity: '600ml',
    power: '-',
    size: '140×190×170mm',
    suitableFor: '1-3人',
    accessories: '壶身×1、防尘盖×1',
    warranty: '1年质保',
    rating: 4.8,
    stock: 100,
    description: '细长壶嘴控水、一体不锈钢、V型导流精准萃取',
    imageUrl: '/picture/store2.png',
    images: ['/picture/store2.png'],
    specs: [
      { value: '300ml', price: 199 },
      { value: '600ml', price: 299 }
    ],
    characteristics: [
      { title: '细尖壶嘴', description: '精准控制水流，点滴萃取更均匀' },
      { title: '一体成型', description: '不锈钢材质，耐用不易损坏' },
      { title: '隔热把手', description: '木质手柄，防烫设计' },
      { title: '容量刻度', description: '壶身带刻度，方便掌握注水量' }
    ],
    usageGuide: '<p>1. 将手冲壶装满热水预热</p><p>2. 放置滤杯，加入滤纸并用热水湿润</p><p>3. 倒入研磨好的咖啡粉</p><p>4. 缓慢注水，画圈萃取</p>',
    careTips: '<p>• 使用后及时清洗，避免咖啡渍残留</p><p>• 不要用钢丝球刷洗，以免刮花表面</p><p>• 木质手柄避免长时间浸泡</p>',
    reviews: [
      { username: '手冲爱好者', rating: 5, content: '壶嘴设计太棒了，控水非常精准，冲出来的咖啡风味很干净。', createTime: '2026-01-12', spec: '600ml' }
    ]
  },
  {
    id: 3,
    name: 'Baratza Encore 磨豆机',
    category: '研磨器具',
    price: 1299,
    weight: '2.5kg',
    material: '不锈钢刀盘+塑料机身',
    capacity: '200g豆仓',
    power: '150W',
    size: '100×170×380mm',
    suitableFor: '1-4人',
    accessories: '主机×1、豆仓×1、接粉杯×1、清洁刷×1',
    warranty: '1年质保',
    rating: 4.7,
    stock: 80,
    description: '锥形不锈钢刀盘、40档粗细可调、静音研磨',
    imageUrl: '/picture/store3.png',
    images: ['/picture/store3.png'],
    specs: [
      { value: '标准版', price: 1299 },
      { value: '带计量杯', price: 1399 }
    ],
    characteristics: [
      { title: '锥形刀盘', description: '不锈钢锥形刀盘，研磨均匀发热少' },
      { title: '40档调节', description: '从意式浓缩到法压壶全覆盖' },
      { title: '静音设计', description: '噪音低至60分贝，不扰民' },
      { title: '定时功能', description: '可预设研磨时间，精准定量' }
    ],
    usageGuide: '<p>1. 根据冲泡方式调节研磨档位</p><p>2. 打开豆仓倒入咖啡豆</p><p>3. 放置接粉杯，按下启动键</p><p>4. 研磨完成后清洁刀盘</p>',
    careTips: '<p>• 每次使用后清洁刀盘残留咖啡粉</p><p>• 定期用清洁片深度清洁刀盘</p><p>• 避免研磨油脂过多的咖啡豆</p>',
    reviews: [
      { username: '入门新手', rating: 4, content: '入门级磨豆机性价比很高，40档调节足够家用了。', createTime: '2026-01-08', spec: '标准版' }
    ]
  },
  {
    id: 4,
    name: 'Wedgwood 骨瓷咖啡杯',
    category: '杯具',
    price: 368,
    weight: '350g',
    material: '英国骨瓷',
    capacity: '320ml',
    power: '-',
    size: '直径90×高95mm',
    suitableFor: '2人',
    accessories: '咖啡杯×2、杯碟×2',
    warranty: '3年质保',
    rating: 4.9,
    stock: 60,
    description: '英国骨瓷、浮雕鎏金礼盒、320ml双人套装，礼品属性',
    imageUrl: '/picture/store4.png',
    images: ['/picture/store4.png'],
    specs: [
      { value: '单杯装', price: 188 },
      { value: '礼盒套装(2杯)', price: 368 }
    ],
    characteristics: [
      { title: '英国骨瓷', description: '精选英国骨瓷，通透细腻' },
      { title: '浮雕工艺', description: '精致浮雕花纹，典雅大气' },
      { title: '鎏金装饰', description: '金边装饰，提升质感' },
      { title: '礼盒包装', description: '精美礼盒，送礼佳品' }
    ],
    usageGuide: '<p>1. 使用前用温水清洗</p><p>2. 可用于微波炉加热饮品</p><p>3. 建议手洗，避免洗碗机高温损伤金边</p>',
    careTips: '<p>• 避免骤冷骤热，防止开裂</p><p>• 手洗为宜，避免使用强力清洁剂</p><p>• 收纳时用软布隔开，避免碰撞</p>',
    reviews: [
      { username: '送礼达人', rating: 5, content: '送给朋友的礼物，包装精美，杯子质感很好！', createTime: '2026-01-14', spec: '礼盒套装(2杯)' }
    ]
  },
  {
    id: 5,
    name: 'Hario V60 陶瓷滤杯',
    category: '冲煮器具',
    price: 128,
    weight: '120g',
    material: '耐热陶瓷',
    capacity: '1-4人份',
    power: '-',
    size: '直径100×高80mm',
    suitableFor: '1-4人',
    accessories: '滤杯×1',
    warranty: '1年质保',
    rating: 4.8,
    stock: 120,
    description: '螺旋导流槽、均匀萃取、耐热陶瓷、1-4人份适配',
    imageUrl: '/picture/store5.png',
    images: ['/picture/store5.png'],
    specs: [
      { value: '01号(1-2人)', price: 108 },
      { value: '02号(1-4人)', price: 128 },
      { value: '03号(4-6人)', price: 148 }
    ],
    characteristics: [
      { title: '螺旋导流槽', description: '独特螺旋设计，水流顺畅萃取均匀' },
      { title: '耐热陶瓷', description: '高温烧制，耐热不易裂' },
      { title: '多孔设计', description: '底部大孔设计，过滤速度适中' },
      { title: 'V型结构', description: 'V型锥形，空气流通好' }
    ],
    usageGuide: '<p>1. 将滤纸放入滤杯，用热水湿润</p><p>2. 加入研磨好的咖啡粉</p><p>3. 开始缓慢注水萃取</p>',
    careTips: '<p>• 使用后及时清洗咖啡渍</p><p>• 避免摔落，陶瓷易碎</p><p>• 可放入洗碗机清洗</p>',
    reviews: [
      { username: '手冲玩家', rating: 5, content: '经典滤杯，萃取均匀，性价比很高！', createTime: '2026-01-11', spec: '02号(1-4人)' }
    ]
  },
  {
    id: 6,
    name: 'Milk Boss 电动奶泡器',
    category: '辅助器具',
    price: 199,
    weight: '180g',
    material: '不锈钢搅拌头+ABS机身',
    capacity: '最大500ml',
    power: '180W',
    size: '直径60×高200mm',
    suitableFor: '1-2人',
    accessories: '主机×1、搅拌头×2、收纳底座×1',
    warranty: '1年质保',
    rating: 4.6,
    stock: 90,
    description: '高速旋转绵密奶泡、一键操作、180W便携家用',
    imageUrl: '/picture/store6.png',
    images: ['/picture/store6.png'],
    specs: [
      { value: '标准版', price: 199 },
      { value: '带收纳盒', price: 229 }
    ],
    characteristics: [
      { title: '高速旋转', description: '每分钟15000转，打出绵密奶泡' },
      { title: '一键操作', description: '简单易用，按下即启动' },
      { title: '便携设计', description: '小巧轻便，收纳方便' },
      { title: '双搅拌头', description: '两种搅拌头，适配不同饮品' }
    ],
    usageGuide: '<p>1. 倒入冷藏牛奶至容器中</p><p>2. 插入奶泡器，按下开关</p><p>3. 上下移动打奶泡约30秒</p><p>4. 取出倒入咖啡中</p>',
    careTips: '<p>• 使用后及时清洗搅拌头</p><p>• 不要长时间空转</p><p>• 避免浸入水中清洗主机</p>',
    reviews: [
      { username: '拿铁爱好者', rating: 4, content: '打奶泡很方便，在家也能做出咖啡店水准的拿铁！', createTime: '2026-01-09', spec: '标准版' }
    ]
  },
  {
    id: 7,
    name: 'Chemex 手冲壶',
    category: '冲煮器具',
    price: 358,
    weight: '400g',
    material: '高硼硅玻璃+木质绑绳',
    capacity: '600ml',
    power: '-',
    size: '直径80×高250mm',
    suitableFor: '1-3人',
    accessories: '壶身×1、专用滤纸×100张',
    warranty: '1年质保',
    rating: 4.8,
    stock: 70,
    description: '高硼硅玻璃+木质绑绳、经典沙漏造型、醇厚低酸萃取',
    imageUrl: '/picture/store7.png',
    images: ['/picture/store7.png'],
    specs: [
      { value: '3杯份(600ml)', price: 358 },
      { value: '6杯份(1000ml)', price: 458 }
    ],
    characteristics: [
      { title: '高硼硅玻璃', description: '耐高温玻璃，通透可视' },
      { title: '木质绑绳', description: '经典设计，防烫装饰' },
      { title: '沙漏造型', description: '优雅造型，摆拍神器' },
      { title: '专用滤纸', description: '厚滤纸过滤，口感醇厚' }
    ],
    usageGuide: '<p>1. 将滤纸折叠放入壶中</p><p>2. 用热水湿润滤纸</p><p>3. 倒入咖啡粉，开始萃取</p>',
    careTips: '<p>• 使用后及时清洗，避免咖啡渍附着</p><p>• 玻璃易碎，小心存放</p><p>• 木质绑绳避免沾水</p>',
    reviews: [
      { username: '美学爱好者', rating: 5, content: '颜值很高！冲出来的咖啡口感很干净，非常喜欢。', createTime: '2026-01-13', spec: '3杯份(600ml)' }
    ]
  },
  {
    id: 8,
    name: 'AeroPress 爱乐压',
    category: '冲煮器具',
    price: 268,
    weight: '250g',
    material: '食品级塑料',
    capacity: '350ml',
    power: '-',
    size: '直径60×高240mm',
    suitableFor: '1人',
    accessories: '主机×1、滤杯×1、压杆×1、滤纸×350张',
    warranty: '1年质保',
    rating: 4.7,
    stock: 100,
    description: '便携抗压设计、快速均衡萃取、户外露营适配',
    imageUrl: '/picture/store8.png',
    images: ['/picture/store8.png'],
    specs: [
      { value: '标准版', price: 268 },
      { value: '旅行套装', price: 328 }
    ],
    characteristics: [
      { title: '便携设计', description: '小巧轻便，旅行露营必备' },
      { title: '快速萃取', description: '1-2分钟完成萃取' },
      { title: '压力萃取', description: '手动加压，风味浓郁' },
      { title: '多用设计', description: '可做冷萃、浓缩、美式' }
    ],
    usageGuide: '<p>1. 将滤纸放入滤杯并湿润</p><p>2. 倒入咖啡粉和热水</p><p>3. 搅拌均匀后静置30秒</p><p>4. 缓慢压杆萃取</p>',
    careTips: '<p>• 使用后及时清洗</p><p>• 滤纸可重复使用2-3次</p><p>• 注意力度，避免压杆过快</p>',
    reviews: [
      { username: '户外爱好者', rating: 5, content: '旅行必备！便携又好用，随时随地都能喝咖啡。', createTime: '2026-01-07', spec: '标准版' }
    ]
  }
]

export const mockCartItems = []

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockGetCartItems = async () => {
  await delay()
  return mockCartItems
}

export const mockAddCartItem = async (data) => {
  await delay()
  const item = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString()
  }
  mockCartItems.push(item)
  return item
}

export const mockUpdateCartItem = async (itemId, data) => {
  await delay()
  const index = mockCartItems.findIndex(item => item.id === itemId)
  if (index > -1) {
    mockCartItems[index] = { ...mockCartItems[index], ...data }
    return mockCartItems[index]
  }
  return null
}

export const mockDeleteCartItem = async (itemId) => {
  await delay()
  const index = mockCartItems.findIndex(item => item.id === itemId)
  if (index > -1) {
    mockCartItems.splice(index, 1)
    return { success: true }
  }
  return { success: false }
}

export const mockClearCart = async () => {
  await delay()
  mockCartItems.length = 0
  return { success: true }
}

export const mockGetEquipmentById = async (id) => {
  await delay()
  const equipment = mockEquipment.find(item => item.id === parseInt(id))
  return equipment ? { code: 200, data: equipment } : { code: 404, message: '未找到该器具' }
}

export const mockGetRelatedEquipment = async (category, excludeId) => {
  await delay()
  return mockEquipment.filter(item => item.category === category && item.id !== parseInt(excludeId)).slice(0, 4)
}

export const mockBeanDetails = [
  { 
    id: 1, 
    name: '耶加雪菲 果丁丁', 
    origin: '埃塞俄比亚', 
    category: '咖啡豆', 
    rating: 4.8, 
    reviews: 328, 
    price: 128, 
    specs: ['100g', '250g'], 
    prices: { '100g': 68, '250g': 128 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['茉莉花', '柑橘', '蜂蜜', '红茶'], 
    description: '花香明亮，柑橘蜂蜜甜感，清爽水洗浅烘。', 
    story: '果丁丁村落坐落于埃塞俄比亚西南部耶加雪菲产区，海拔1800-2200米，百年原生Heirloom老树种，传统水洗处理法，是全球知名花香型精品豆标杆。', 
    brewingGuide: '水温92℃，粉水比1:15，2-3段分段注水，浅烘萃取时长1分50秒。', 
    process: '水洗单一产地', 
    altitude: '1800-2200m', 
    variety: 'Heirloom原生种'
  },
  { 
    id: 2, 
    name: '哥伦比亚 蕙兰 玫瑰谷', 
    origin: '哥伦比亚', 
    category: '咖啡豆', 
    rating: 4.8, 
    reviews: 256, 
    price: 98, 
    specs: ['100g', '250g'], 
    prices: { '100g': 52, '250g': 98 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['坚果', '焦糖', '红莓', '巧克力'], 
    description: '平衡坚果焦糖，柔和莓果酸度，中度烘焙日常口粮。', 
    story: '哥伦比亚蕙兰产区玫瑰谷庄园，山地火山土壤，人工全红果采摘，水洗处理，均衡度极高，新手入门首选综合风味豆。', 
    brewingGuide: '水温90℃，粉水比1:14，标准一刀流，萃取2分10秒。', 
    process: '水洗单一产地', 
    altitude: '1500-1800m', 
    variety: 'Castillo卡杜拉混种'
  },
  { 
    id: 3, 
    name: '巴西 桑托斯 半日晒', 
    origin: '巴西', 
    category: '咖啡豆', 
    rating: 4.7, 
    reviews: 423, 
    price: 68, 
    specs: ['100g', '250g'], 
    prices: { '100g': 36, '250g': 68 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['烤坚果', '可可', '奶油', '核桃'], 
    description: '醇厚坚果可可，低酸顺滑，奶咖适配度拉满。', 
    story: '巴西米纳斯吉拉斯桑托斯产区，平缓高原种植，半日晒处理，果肉糖分缓慢渗入豆体，酸度极低，适配意式与牛奶咖啡。', 
    brewingGuide: '水温88℃，粉水比1:13，适合做奶咖，手冲缩短萃取时间。', 
    process: '半日晒单一产地', 
    altitude: '1000-1200m', 
    variety: 'Bourbon波旁种'
  },
  { 
    id: 4, 
    name: '危地马拉 安提瓜 火山豆', 
    origin: '危地马拉', 
    category: '咖啡豆', 
    rating: 4.9, 
    reviews: 145, 
    price: 118, 
    specs: ['100g', '250g'], 
    prices: { '100g': 62, '250g': 118 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['黑巧克力', '黑樱桃', '烟草', '焦糖'], 
    description: '烟熏巧克力，黑樱桃回甘，厚重温润中深烘。', 
    story: '安提瓜产区紧邻活火山，火山灰土壤富含矿物质，传统水洗处理，厚实醇厚度，回甘持久，重度咖啡爱好者优选。', 
    brewingGuide: '水温91℃，粉水比1:14，3段慢注水，萃取2分20秒。', 
    process: '水洗单一产地', 
    altitude: '1500-1700m', 
    variety: 'Caturra卡杜拉'
  },
  { 
    id: 5, 
    name: 'AA 涅里', 
    origin: '肯尼亚', 
    category: '咖啡豆', 
    rating: 4.9, 
    reviews: 98, 
    price: 138, 
    specs: ['100g', '250g'], 
    prices: { '100g': 72, '250g': 138 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['黑醋栗', '番茄', '黑莓', '蔗糖'], 
    description: '浓郁黑醋栗，番茄明亮酸，层次复杂顶级果酸。', 
    story: '肯尼亚涅里产区严格AA分级，双重水洗发酵，高海拔冷凉环境造就极致明亮果酸，酸度干净锐利，是果酸爱好者天花板单品。', 
    brewingGuide: '水温93℃，粉水比1:16，细粉慢萃，时长2分整。', 
    process: '双重水洗单一产地', 
    altitude: '1700-1900m', 
    variety: 'SL28/SL34'
  },
  { 
    id: 6, 
    name: '巴拿马 瑰夏 水洗', 
    origin: '巴拿马', 
    category: '咖啡豆', 
    rating: 4.8, 
    reviews: 86, 
    price: 142, 
    specs: ['100g', '250g'], 
    prices: { '100g': 78, '250g': 142 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['佛手柑', '白茶', '荔枝', '蜂蜜'], 
    description: '顶级瑰夏花香，佛手柑白茶，高端浅烘稀缺单品。', 
    story: '巴拿马翡翠庄园同风土瑰夏树种，高海拔遮阴种植，精细水洗处理，标志性茉莉佛手柑花香，精品咖啡高端代表。', 
    brewingGuide: '水温90℃，粉水比1:16，极浅烘，分段轻柔注水避免过萃。', 
    process: '水洗单一产地', 
    altitude: '1600-1800m', 
    variety: 'Gesha瑰夏种'
  },
  { 
    id: 7, 
    name: '哥斯达黎加 蜜处理 黑蜜', 
    origin: '哥斯达黎加', 
    category: '咖啡豆', 
    rating: 4.7, 
    reviews: 167, 
    price: 108, 
    specs: ['100g', '250g'], 
    prices: { '100g': 58, '250g': 108 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['水蜜桃', '蜜饯', '香草', '黄糖'], 
    description: '蜜饯桃子甜，柔和果汁感，中度蜜处理特色甜感。', 
    story: '哥斯达黎加塔拉珠庄园黑蜜处理，保留大量果胶晾晒，糖分富集，果汁甜感突出，酸度柔和不刺激。', 
    brewingGuide: '水温90℃，粉水比1:15，两段注水，萃取2分钟。', 
    process: '黑蜜处理单一产地', 
    altitude: '1500-1700m', 
    variety: 'Catuai卡杜艾'
  },
  { 
    id: 8, 
    name: '埃塞 罕贝拉 日晒花魁', 
    origin: '埃塞俄比亚', 
    category: '咖啡豆', 
    rating: 4.8, 
    reviews: 289, 
    price: 132, 
    specs: ['100g', '250g'], 
    prices: { '100g': 70, '250g': 132 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['草莓', '蓝莓', '芒果', '果脯'], 
    description: '草莓蓝莓果汁，浓郁热带水果，日晒发酵饱满果香。', 
    story: '埃塞俄比亚罕贝拉日晒产区，完整果荚晾晒长时间发酵，浓郁热带浆果风味，网红爆款日晒精品豆。', 
    brewingGuide: '水温91℃，粉水比1:15，浅中烘，充分释放果香。', 
    process: '日晒单一产地', 
    altitude: '1800-2000m', 
    variety: 'Heirloom原生种'
  },
  { 
    id: 9, 
    name: '印尼 苏门答腊 曼特宁', 
    origin: '印尼', 
    category: '咖啡豆', 
    rating: 4.7, 
    reviews: 215, 
    price: 88, 
    specs: ['100g', '250g'], 
    prices: { '100g': 46, '250g': 88 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['草本', '丁香', '黑巧克力', '松木'], 
    description: '草本泥土香料，低酸厚重，草本木质醇厚深烘。', 
    story: '苏门答腊湿刨法独特处理，潮湿环境带来标志性泥土草本调性，醇厚度极高，适合偏爱厚重低酸咖啡人群。', 
    brewingGuide: '水温89℃，粉水比1:13，深烘缩短萃取，避免苦涩。', 
    process: '湿刨法单一产地', 
    altitude: '1100-1500m', 
    variety: 'Tim Tim蒂姆蒂姆'
  },
  { 
    id: 10, 
    name: '秘鲁 有机 水洗波旁', 
    origin: '秘鲁', 
    category: '咖啡豆', 
    rating: 4.8, 
    reviews: 198, 
    price: 122, 
    specs: ['100g', '250g'], 
    prices: { '100g': 64, '250g': 122 },
    image: '/picture/yejiaxuefei.png', 
    notes: ['梨子', '白桃', '白花香', '麦芽糖'], 
    description: '干净梨子花香，柔和均衡，有机认证温和口粮豆。', 
    story: '秘鲁北部有机认证庄园，无化肥农药种植，波旁种水洗处理，风味干净柔和，低刺激适合日常每日饮用。', 
    brewingGuide: '水温92℃，粉水比1:15，三段均衡萃取。', 
    process: '有机水洗单一产地', 
    altitude: '1600-1800m', 
    variety: 'Bourbon波旁'
  }
]

export const mockGetBeanById = async (id) => {
  await delay()
  const bean = mockBeanDetails.find(item => item.id === parseInt(id))
  return bean ? { code: 200, data: bean } : { code: 404, message: '未找到该咖啡豆' }
}