<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, beans = []
let animationId
let mouseX = 0, mouseY = 0
let targetMouseX = 0, targetMouseY = 0
let isLoaded = ref(false)
let lastEmitTime = 0
const EMIT_INTERVAL = 16 // 约60fps

// 物理参数
const GRAVITY = -9.8
const DAMPING = 0.3
const GROUND_Y = -4
const WALL_LEFT = -8
const WALL_RIGHT = 8
const MAX_BEANS = 800

// 简单的物理对象
class PhysicsBean {
  constructor(mesh, x, y, z) {
    this.mesh = mesh
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 2,
      (Math.random() - 0.5) * 2
    )
    this.angularVelocity = new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    )
    this.isSettled = false
    this.settleTime = 0
  }

  update(deltaTime) {
    if (this.isSettled) return

    const dt = Math.min(deltaTime, 0.02)

    // 重力
    this.velocity.y += GRAVITY * dt

    // 更新位置
    this.mesh.position.x += this.velocity.x * dt
    this.mesh.position.y += this.velocity.y * dt
    this.mesh.position.z += this.velocity.z * dt

    // 更新旋转
    this.mesh.rotation.x += this.angularVelocity.x * dt
    this.mesh.rotation.y += this.angularVelocity.y * dt
    this.mesh.rotation.z += this.angularVelocity.z * dt

    // 地面碰撞
    if (this.mesh.position.y < GROUND_Y) {
      this.mesh.position.y = GROUND_Y
      this.velocity.y *= -DAMPING
      this.velocity.x *= 0.9
      this.velocity.z *= 0.9
      this.angularVelocity.multiplyScalar(0.8)
    }

    // 墙壁碰撞
    if (this.mesh.position.x < WALL_LEFT) {
      this.mesh.position.x = WALL_LEFT
      this.velocity.x *= -DAMPING
    }
    if (this.mesh.position.x > WALL_RIGHT) {
      this.mesh.position.x = WALL_RIGHT
      this.velocity.x *= -DAMPING
    }
    if (this.mesh.position.z < -5) {
      this.mesh.position.z = -5
      this.velocity.z *= -DAMPING
    }
    if (this.mesh.position.z > 5) {
      this.mesh.position.z = 5
      this.velocity.z *= -DAMPING
    }

    // 检查是否静止
    const speed = this.velocity.length()
    if (speed < 0.1 && Math.abs(this.velocity.y) < 0.1) {
      this.settleTime += dt
      if (this.settleTime > 0.5) {
        this.isSettled = true
        this.velocity.set(0, 0, 0)
        this.angularVelocity.set(0, 0, 0)
      }
    } else {
      this.settleTime = 0
    }
  }

  checkCollision(other) {
    if (this.isSettled && other.isSettled) return

    const dx = this.mesh.position.x - other.mesh.position.x
    const dy = this.mesh.position.y - other.mesh.position.y
    const dz = this.mesh.position.z - other.mesh.position.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const minDist = 0.6

    if (dist < minDist && dist > 0) {
      const overlap = minDist - dist
      const nx = dx / dist
      const ny = dy / dist
      const nz = dz / dist

      // 分离两个豆子
      const separation = overlap * 0.5
      this.mesh.position.x += nx * separation
      this.mesh.position.y += ny * separation
      this.mesh.position.z += nz * separation
      other.mesh.position.x -= nx * separation
      other.mesh.position.y -= ny * separation
      other.mesh.position.z -= nz * separation

      // 交换速度（简化的弹性碰撞）
      if (!this.isSettled) {
        const impact = Math.abs(this.velocity.dot(new THREE.Vector3(nx, ny, nz)))
        if (impact > 0.5) {
          this.velocity.x -= nx * impact * DAMPING
          this.velocity.y -= ny * impact * DAMPING
          this.velocity.z -= nz * impact * DAMPING
          this.angularVelocity.multiplyScalar(0.9)
        }
      }
      if (!other.isSettled) {
        const impact = Math.abs(other.velocity.dot(new THREE.Vector3(nx, ny, nz)))
        if (impact > 0.5) {
          other.velocity.x += nx * impact * DAMPING
          other.velocity.y += ny * impact * DAMPING
          other.velocity.z += nz * impact * DAMPING
          other.angularVelocity.multiplyScalar(0.9)
        }
      }
    }
  }
}

let physicsBeans = []

const createBeanGeometry = () => {
  const geometry = new THREE.SphereGeometry(0.25, 32, 32)
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)

    const length = Math.sqrt(x * x + y * y + z * z)
    const nx = x / length
    const ny = y / length
    const nz = z / length

    let scale = 1.0
    // 拉伸为椭圆形（咖啡豆形状）
    if (ny > 0.2) scale *= (1 - (ny - 0.2) * 0.4)
    else if (ny < -0.3) scale *= (1 + (ny + 0.3) * 0.3)

    // 添加凹凸纹理
    const noise = (Math.sin(x * 20) * Math.cos(y * 20) * Math.sin(z * 20)) * 0.015
    scale += noise

    // 中间凹槽效果
    const groove = Math.sin(ny * Math.PI) * 0.08
    scale += groove

    positions.setXYZ(i, x * scale, y * scale * 1.3, z * scale * 0.65)
  }

  geometry.computeVertexNormals()
  return geometry
}

const createBeanMaterial = (index) => {
  // 咖啡棕色调变化
  const hue = 0.07 + (index % 10) * 0.005
  const lightness = 0.22 + (index % 8) * 0.02

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const imageData = ctx.createImageData(256, 256)
  const data = imageData.data

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4
      const noise1 = (Math.random() - 0.5) * 15
      const noise2 = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 8
      const value = Math.floor(80 + noise1 + noise2 + lightness * 100)
      data[i] = Math.min(255, value * 1.1)
      data[i + 1] = Math.min(255, value * 0.88)
      data[i + 2] = Math.min(255, value * 0.75)
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(hue, 0.45, lightness),
    roughness: 0.88,
    metalness: 0.08,
    bumpMap: texture,
    bumpScale: 0.008,
    envMapIntensity: 0.8
  })
}

const emitBeans = () => {
  if (beans.length >= MAX_BEANS) return

  const geometry = createBeanGeometry()

  // 从鼠标位置发射
  const worldX = (targetMouseX / window.innerWidth) * 16 - 8
  const worldY = -(targetMouseY / window.innerHeight) * 10 + 5

  const emitCount = Math.min(3, MAX_BEANS - beans.length)

  for (let i = 0; i < emitCount; i++) {
    const material = createBeanMaterial(beans.length)
    const bean = new THREE.Mesh(geometry, material)

    bean.position.set(
      worldX + (Math.random() - 0.5) * 1.5,
      worldY + Math.random() * 0.5,
      (Math.random() - 0.5) * 3
    )

    bean.castShadow = true
    bean.receiveShadow = true

    beans.push(bean)
    physicsBeans.push(new PhysicsBean(bean, bean.position.x, bean.position.y, bean.position.z))
    scene.add(bean)
  }
}

const initScene = () => {
  const container = containerRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  // 暗色背景，匹配Oryzo风格
  scene.background = new THREE.Color(0x1a1512)
  scene.fog = new THREE.Fog(0x1a1512, 8, 20)

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.set(0, 2, 12)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  container.appendChild(renderer.domElement)

  // 简洁的光照设置
  const ambientLight = new THREE.AmbientLight(0xD4A574, 0.3)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xFFF5E6, 0.8)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.1
  mainLight.shadow.camera.far = 50
  mainLight.shadow.camera.left = -15
  mainLight.shadow.camera.right = 15
  mainLight.shadow.camera.top = 15
  mainLight.shadow.camera.bottom = -15
  mainLight.shadow.bias = -0.001
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0x8B7355, 0.25)
  fillLight.position.set(-5, 3, -5)
  scene.add(fillLight)

  // 地面（不可见，用于接收阴影）
  const groundGeometry = new THREE.PlaneGeometry(30, 20)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = GROUND_Y
  ground.receiveShadow = true
  scene.add(ground)

  // 预生成一些咖啡豆
  for (let i = 0; i < 30; i++) {
    const material = createBeanMaterial(i)
    const bean = new THREE.Mesh(createBeanGeometry(), material)

    bean.position.set(
      (Math.random() - 0.5) * 12,
      GROUND_Y + Math.random() * 3,
      (Math.random() - 0.5) * 8
    )
    bean.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    bean.castShadow = true
    bean.receiveShadow = true

    beans.push(bean)
    const pb = new PhysicsBean(bean, bean.position.x, bean.position.y, bean.position.z)
    pb.isSettled = true
    physicsBeans.push(pb)
    scene.add(bean)
  }

  animate()

  setTimeout(() => {
    isLoaded.value = true
  }, 500)

  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('touchmove', onTouchMove)
}

let lastTime = 0

const animate = () => {
  animationId = requestAnimationFrame(animate)

  const currentTime = Date.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // 鼠标平滑跟随
  mouseX += (targetMouseX - mouseX) * 0.1
  mouseY += (targetMouseY - mouseY) * 0.1

  // 相机轻微跟随鼠标
  camera.position.x = mouseX * 0.02
  camera.position.y = 2 - mouseY * 0.01
  camera.lookAt(0, 0, 0)

  // 发射新粒子
  if (currentTime - lastEmitTime > EMIT_INTERVAL) {
    emitBeans()
    lastEmitTime = currentTime
  }

  // 更新物理
  for (const bean of physicsBeans) {
    bean.update(deltaTime)
  }

  // 碰撞检测（简化版本，每帧只检测部分）
  const checkCount = Math.min(50, physicsBeans.length)
  for (let i = 0; i < checkCount; i++) {
    const idx = Math.floor(Math.random() * physicsBeans.length)
    const bean1 = physicsBeans[idx]

    const nearbyCount = 10
    for (let j = 0; j < nearbyCount; j++) {
      const idx2 = Math.floor(Math.random() * physicsBeans.length)
      if (idx !== idx2) {
        bean1.checkCollision(physicsBeans[idx2])
      }
    }
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

const onMouseMove = (event) => {
  targetMouseX = event.clientX - window.innerWidth / 2
  targetMouseY = event.clientY - window.innerHeight / 2
}

const onTouchMove = (event) => {
  if (event.touches.length > 0) {
    targetMouseX = event.touches[0].clientX - window.innerWidth / 2
    targetMouseY = event.touches[0].clientY - window.innerHeight / 2
  }
}

const onMouseLeave = () => {
  targetMouseX = 0
  targetMouseY = 0
}

onMounted(() => {
  initScene()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('touchmove', onTouchMove)

  if (animationId) cancelAnimationFrame(animationId)

  // 清理Three.js资源
  beans.forEach(bean => {
    bean.geometry.dispose()
    bean.material.dispose()
  })
  beans = []
  physicsBeans = []

  if (renderer) {
    renderer.dispose()
    if (containerRef.value) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
})
</script>

<template>
  <div ref="containerRef" class="coffee-particle-scene" :class="{ loaded: isLoaded }"></div>
</template>

<style scoped>
.coffee-particle-scene {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: crosshair;
}

.coffee-particle-scene.loaded {
  opacity: 1;
}
</style>
