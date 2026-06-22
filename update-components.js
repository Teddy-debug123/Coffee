const fs = require('fs');
const path = require('path');

const yirg = fs.readFileSync('src/views/coffee-bean/YirgacheffeDetail.vue', 'utf8');

const datas = {
  KenyaAADetail: JSON.stringify({
    id: 2, name: '肯尼亚AA', origin: '肯尼亚', rating: 4.8, reviews: 286,
    description: '黑醋栗风味，明亮酸度，红酒般复杂。',
    brewingGuide: '水温 93℃，粉水比 1:16，细粉慢萃，时长约 2 分钟。',
    notes: ['黑醋栗', '番茄', '黑莓', '蔗糖'],
    specs: ['100g', '250g'], prices: { '100g': 72, '250g': 138 },
    image: '/picture/kenniya.png', images: ['/picture/kenniya.png'],
    story: '产自肯尼亚高原，海拔1500-1800米，黑醋栗与红酒般的酸度是其标志性特征。',
    process: '双重水洗单一产地', altitude: '1500-1800m', variety: 'SL28/SL34'
  }, null, 2),
  KenyaNeriDetail: JSON.stringify({
    id: 5, name: '肯尼亚 AA 涅里', origin: '肯尼亚', rating: 4.9, reviews: 198,
    description: '浓郁黑醋栗，番茄明亮酸，层次复杂顶级果酸。',
    brewingGuide: '水温 93℃，粉水比 1:16，细粉慢萃，时长约 2 分钟。',
    notes: ['黑醋栗', '番茄', '黑莓', '蔗糖'],
    specs: ['100g', '250g'], prices: { '100g': 72, '250g': 138 },
    image: '/picture/kenniya.png', images: ['/picture/kenniya.png'],
    story: '肯尼亚涅里产区严格 AA 分级，双重水洗发酵，高海拔冷凉环境造就极致明亮果酸。',
    process: '双重水洗单一产地', altitude: '1800-2100m', variety: 'SL28/SL34'
  }, null, 2),
  HuilanDetail: JSON.stringify({
    id: 2, name: '哥伦比亚 蕙兰 玫瑰谷', origin: '哥伦比亚', rating: 4.6, reviews: 156,
    description: '均衡柔和，坚果焦糖，日常优选口粮豆。',
    brewingGuide: '水温 90℃，粉水比 1:14，标准一刀流，萃取约 2 分 10 秒。',
    notes: ['坚果', '焦糖', '红莓', '巧克力'],
    specs: ['100g', '200g'], prices: { '100g': 52, '200g': 98 },
    image: '/picture/store1.png', images: ['/picture/store1.png'],
    story: '哥伦比亚蕙兰产区玫瑰谷庄园，山地火山土壤，人工全红果采摘，水洗处理。',
    process: '水洗单一产地', altitude: '1600-2000m', variety: 'Castillo 卡杜拉混种'
  }, null, 2),
  SantosDetail: JSON.stringify({
    id: 3, name: '巴西 桑托斯 半日晒', origin: '巴西', rating: 4.5, reviews: 234,
    description: '醇厚坚果可可，低酸顺滑，奶咖适配度拉满。',
    brewingGuide: '水温 88℃，粉水比 1:13，适合做奶咖，手冲缩短萃取时间。',
    notes: ['烤坚果', '可可', '奶油', '核桃'],
    specs: ['100g', '200g'], prices: { '100g': 36, '200g': 68 },
    image: '/picture/baxi.png', images: ['/picture/baxi.png'],
    story: '巴西米纳斯吉拉斯桑托斯产区，平缓高原种植，半日晒处理。',
    process: '半日晒单一产地', altitude: '1000-1200m', variety: 'Bourbon 波旁种'
  }, null, 2),
  AntiguaDetail: JSON.stringify({
    id: 4, name: '危地马拉 安提瓜 火山豆', origin: '危地马拉', rating: 4.8, reviews: 178,
    description: '烟熏巧克力，黑樱桃回甘，厚重温润中深烘。',
    brewingGuide: '水温 91℃，粉水比 1:14，3 段慢注水，萃取约 2 分 20 秒。',
    notes: ['黑巧克力', '黑樱桃', '烟草', '焦糖'],
    specs: ['100g', '250g'], prices: { '100g': 62, '250g': 118 },
    image: '/picture/antigua.png', images: ['/picture/antigua.png'],
    story: '安提瓜产区紧邻活火山，火山灰土壤富含矿物质，传统水洗处理。',
    process: '水洗单一产地', altitude: '1500-1700m', variety: 'Caturra 卡杜拉'
  }, null, 2),
  MandarinDetail: JSON.stringify({
    id: 9, name: '印尼 苏门答腊 曼特宁', origin: '印尼', rating: 4.7, reviews: 212,
    description: '草本泥土香料，低酸厚重，草本木质醇厚深烘。',
    brewingGuide: '水温 89℃，粉水比 1:13，深烘缩短萃取，避免苦涩。',
    notes: ['草本', '丁香', '黑巧克力', '松木'],
    specs: ['100g', '250g'], prices: { '100g': 46, '250g': 88 },
    image: '/picture/mantening.png', images: ['/picture/mantening.png'],
    story: '苏门答腊湿刨法独特处理，潮湿环境带来标志性泥土草本调性。',
    process: '湿刨法单一产地', altitude: '1100-1500m', variety: 'Tim Tim 蒂姆蒂姆'
  }, null, 2),
  CostaRicaDetail: JSON.stringify({
    id: 7, name: '哥斯达黎加 蜜处理 黑蜜', origin: '哥斯达黎加', rating: 4.6, reviews: 145,
    description: '蜜饯桃子甜，柔和果汁感，中度蜜处理特色甜感。',
    brewingGuide: '水温 90℃，粉水比 1:15，两段注水，萃取约 2 分钟。',
    notes: ['水蜜桃', '蜜饯', '香草', '黄糖'],
    specs: ['100g', '200g'], prices: { '100g': 58, '200g': 108 },
    image: '/picture/gesidalijia.png', images: ['/picture/gesidalijia.png'],
    story: '哥斯达黎加塔拉珠庄园黑蜜处理，保留大量果胶晾晒，糖分富集。',
    process: '黑蜜处理单一产地', altitude: '1500-1800m', variety: 'Catuai 卡杜艾'
  }, null, 2)
};

Object.keys(datas).forEach(name => {
  const data = datas[name];
  const defaultSpec = JSON.parse(data).specs[0];
  let content = yirg;
  content = content.replace(/const productData = \{[\s\S]*?\n\}/, 'const productData = ' + data + ';');
  content = content.replace(/selectedWeight = ref\('100g'\)/, 'selectedWeight = ref(\'' + defaultSpec + '\')');
  fs.writeFileSync(path.join('src/views/coffee-bean', name + '.vue'), content, 'utf8');
  console.log('Updated: ' + name + '.vue');
});
console.log('Done!');