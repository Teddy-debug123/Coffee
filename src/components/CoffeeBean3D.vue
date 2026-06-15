<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, bean, animationId

const initScene = () => {
  const container = containerRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFAFAFA)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 3

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 50
  scene.add(directionalLight)

  const fillLight = new THREE.DirectionalLight(0xFFE4C4, 0.3)
  fillLight.position.set(-3, -2, 3)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.2)
  rimLight.position.set(0, -5, 3)
  scene.add(rimLight)

  createCoffeeBean()

  animate()
  window.addEventListener('resize', onWindowResize)
}

const createCoffeeBean = () => {
  const geometry = createBeanGeometry()
  
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.08, 0.45, 0.35),
    roughness: 0.85,
    metalness: 0.15,
    bumpScale: 0.008,
    normalScale: new THREE.Vector2(0.8, 0.8)
  })

  applyMicroTexture(material)

  bean = new THREE.Mesh(geometry, material)
  bean.castShadow = true
  bean.receiveShadow = true
  scene.add(bean)

  const baseGeometry = new THREE.CylinderGeometry(0.8, 0.85, 0.1, 32)
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x2C2C2C,
    roughness: 0.9,
    metalness: 0.1
  })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = -0.55
  base.rotation.x = -Math.PI / 2
  base.receiveShadow = true
  scene.add(base)
}

const createBeanGeometry = () => {
  const geometry = new THREE.SphereGeometry(0.5, 64, 64)
  
  const positions = geometry.attributes.position
  const normals = geometry.attributes.normal
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)
    
    const length = Math.sqrt(x * x + y * y + z * z)
    const nx = x / length
    const ny = y / length
    const nz = z / length
    
    let scale = 1.0
    
    if (ny > 0.3) {
      scale *= (1 - (ny - 0.3) * 0.4)
    } else if (ny < -0.4) {
      scale *= (1 + (ny + 0.4) * 0.3)
    }
    
    const noise = (Math.sin(x * 15) * Math.cos(y * 15) * Math.sin(z * 15)) * 0.02
    scale += noise
    
    const bulge = Math.sin(ny * Math.PI) * 0.15
    scale += bulge
    
    positions.setXYZ(i, x * scale, y * scale * 1.3, z * scale * 0.75)
    normals.setXYZ(i, nx, ny, nz)
  }
  
  geometry.computeVertexNormals()
  geometry.computeTangents()
  
  return geometry
}

const applyMicroTexture = (material) => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  
  const imageData = ctx.createImageData(256, 256)
  const data = imageData.data
  
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4
      const noise = (Math.random() - 0.5) * 10
      const value = 128 + noise
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = 255
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  
  material.bumpMap = texture
  material.displacementMap = texture
  material.displacementScale = 0.015
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (bean) {
    bean.rotation.y += 0.008
    bean.rotation.x = Math.sin(Date.now() * 0.001) * 0.15 - 0.2
  }
  
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  const container = containerRef.value
  if (!container) return
  
  const width = container.clientWidth
  const height = container.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initScene()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<template>
  <div ref="containerRef" class="coffee-bean-3d-container"></div>
</template>

<style scoped>
.coffee-bean-3d-container {
  width: 100%;
  height: 400px;
  position: relative;
}
</style>