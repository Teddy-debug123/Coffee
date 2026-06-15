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