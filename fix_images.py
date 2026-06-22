import re

with open('g:/coffee/src/views/Home.vue', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"image: 'https://trae-api-cn\.mchost\.guru/api/ide/v1/text_to_image[^']+'"

images = [
    '/coffee-images/1-yirgacheffe.jpg',
    '/coffee-images/2-colombia.jpg',
    '/coffee-images/3-brazil.jpg',
    '/coffee-images/4-guatemala.jpg',
    '/coffee-images/5-kenya.jpg',
    '/coffee-images/6-panama.jpg',
    '/coffee-images/7-costarica.jpg',
    '/coffee-images/8-hambella.jpg',
    '/coffee-images/9-mandheling.jpg',
    '/coffee-images/10-peru.jpg'
]

matches = list(re.finditer(pattern, content))
for i, match in enumerate(matches):
    if i < len(images):
        content = content[:match.start()] + f"image: '{images[i]}'" + content[match.end():]

with open('g:/coffee/src/views/Home.vue', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
