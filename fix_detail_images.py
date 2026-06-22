import re

pages = [
    ('YirgacheffeDetail.vue', '1-yirgacheffe'),
    ('HuilanDetail.vue', '2-colombia'),
    ('SantosDetail.vue', '3-brazil'),
    ('AntiguaDetail.vue', '4-guatemala'),
    ('KenyaNeriDetail.vue', '5-kenya'),
    ('KenyaAADetail.vue', '5-kenya'),
    ('CostaRicaDetail.vue', '7-costarica'),
    ('MandarinDetail.vue', '9-mandheling')
]

for page, img_name in pages:
    path = f'g:/coffee/src/views/coffee-bean/{page}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r"image: 'https://trae-api-cn\.mchost\.guru/api/ide/v1/text_to_image[^']+'", f"image: '/coffee-images/{img_name}.jpg'", content)
    content = re.sub(r"https://trae-api-cn\.mchost\.guru/api/ide/v1/text_to_image[^'\"]+", f"/coffee-images/{img_name}.jpg", content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
