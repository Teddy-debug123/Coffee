<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, beans = [], animationId

const initScene = () => {
  const container = containerRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFAFAFA)

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.z = 6

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  initLights()
  createCoffeeBeans()
  animate()
  window.addEventListener('resize', onWindowResize)
}

const initLights = () => {
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xFFF5E6, 0.9)
  mainLight.position.set(8, 10, 12)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 4096
  mainLight.shadow.mapSize.height = 4096
  mainLight.shadow.camera.near = 0.1
  mainLight.shadow.camera.far = 50
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0xFFD4B8, 0.3)
  fillLight.position.set(-6, -4, 8)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.25)
  rimLight.position.set(0, -8, -5)
  scene.add(rimLight)
}

const createBeanGeometry = () => {
  const geometry = new THREE.SphereGeometry(0.35, 64, 64)
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)

    const length = Math.sqrt(x * x + y * y + z * z)
    const nx = x / length
    const ny = y / length

    let scale = 1.0
    if (ny > 0.25) scale *= (1 - (ny - 0.25) * 0.4)
    else if (ny < -0.35) scale *= (1 + (ny + 0.35) * 0.28)

    const noise = (Math.sin(x * 14) * Math.cos(y * 14) * Math.sin(z * 14)) * 0.018
    scale += noise

    const bulge = Math.sin(ny * Math.PI) * 0.14
    scale += bulge

    positions.setXYZ(i, x * scale, y * scale * 1.28, z * scale * 0.72)
  }

  geometry.computeVertexNormals()
  geometry.computeTangents()
  return geometry
}

const createBeanMaterial = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const imageData = ctx.createImageData(256, 256)
  const data = imageData.data

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4
      const noise = (Math.random() - 0.5) * 12
      const gradient = Math.sin((y / 256) * Math.PI) * 15
      const value = 128 + noise + gradient
      data[i] = value
      data[i + 1] = value * 0.95
      data[i + 2] = value * 0.88
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(5, 5)

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.07, 0.4, 0.3),
    roughness: 0.92,
    metalness: 0.08,
    bumpMap: texture,
    bumpScale: 0.008,
    displacementMap: texture,
    displacementScale: 0.012,
    envMapIntensity: 1.0
  })
}

const createCoffeeBeans = () => {
  const geometry = createBeanGeometry()
  const material = createBeanMaterial()

  const positions = [
    { x: 0, y: 0, z: 0, scale: 1.3, delay: 0 },
    { x: 1.8, y: 0.6, z: 1.2, scale: 0.9, delay: 0.8 },
    { x: -2.0, y: 0.4, z: 0.8, scale: 0.75, delay: 1.5 },
    { x: 1.5, y: -1.0, z: 0.6, scale: 0.68, delay: 2.2 },
    { x: -1.2, y: -0.7, z: 1.0, scale: 0.72, delay: 2.8 },
    { x: 0, y: 1.2, z: -0.3, scale: 0.58, delay: 3.5 },
    { x: -2.5, y: 1.0, z: -0.6, scale: 0.48, delay: 4.2 },
    { x: 2.5, y: -0.2, z: -0.8, scale: 0.52, delay: 4.8 },
    { x: -1.8, y: 1.5, z: 0.5, scale: 0.42, delay: 5.5 },
    { x: 2.2, y: 1.1, z: -0.4, scale: 0.45, delay: 6.2 }
  ]

  positions.forEach((pos, index) => {
    const bean = new THREE.Mesh(geometry.clone(), material.clone())
    bean.position.set(pos.x, pos.y, pos.z)
    bean.scale.set(pos.scale, pos.scale, pos.scale)
    bean.castShadow = true
    bean.receiveShadow = true
    bean.userData = {
      baseX: pos.x,
      baseY: pos.y,
      baseZ: pos.z,
      baseScale: pos.scale,
      delay: pos.delay,
      index: index,
      rotationSpeed: 0.003 + Math.random() * 0.002,
      floatOffset: Math.random() * Math.PI * 2
    }
    beans.push(bean)
    scene.add(bean)
  })
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  const time = Date.now() * 0.001

  beans.forEach((bean) => {
    const delay = bean.userData.delay
    const baseX = bean.userData.baseX
    const baseY = bean.userData.baseY
    const baseZ = bean.userData.baseZ
    const floatOffset = bean.userData.floatOffset

    bean.position.x = baseX + Math.sin(time * 0.3 + delay + floatOffset) * 0.45
    bean.position.y = baseY + Math.cos(time * 0.25 + delay + floatOffset) * 0.35
    bean.position.z = baseZ + Math.sin(time * 0.2 + delay + floatOffset) * 0.25

    bean.rotation.y = time * (0.25 + bean.userData.index * 0.03) + delay
    bean.rotation.x = Math.sin(time * 0.6 + delay) * 0.12
    bean.rotation.z = Math.cos(time * 0.4 + delay) * 0.08
  })

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
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div ref="containerRef" class="coffee-video-scene"></div>
</template>

<style scoped>
.coffee-video-scene {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>