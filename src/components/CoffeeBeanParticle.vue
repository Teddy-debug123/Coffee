<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const containerRef = ref(null)
let scene, camera, renderer, beanMeshes = []
let animationId
let mouseX = 0, mouseY = 0
let targetMouseX = 0, targetMouseY = 0
let isLoaded = ref(false)
let lastEmitTime = 0
const EMIT_INTERVAL = 20

// 物理参数
const GRAVITY = -12.0
const DAMPING = 0.35
const GROUND_Y = -5
const WALL_LEFT = -10
const WALL_RIGHT = 10
const MAX_BEANS = 600

// 外部模型引用
let beanModel = null
let modelLoaded = false

class PhysicsBean {
  constructor(mesh, x, y, z) {
    this.mesh = mesh
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2.5,
      Math.random() * 2 + 1,
      (Math.random() - 0.5) * 2.5
    )
    this.angularVelocity = new THREE.Vector3(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    )
    this.isSettled = false
    this.settleTime = 0
    this.settleRotationAxis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize()
    this.settleRotationSpeed = 0.3 + Math.random() * 0.5
  }

  update(deltaTime) {
    if (this.isSettled) {
      this.mesh.rotateOnAxis(this.settleRotationAxis, this.settleRotationSpeed * deltaTime)
      return
    }

    const dt = Math.min(deltaTime, 0.025)

    this.velocity.y += GRAVITY * dt

    this.mesh.position.x += this.velocity.x * dt
    this.mesh.position.y += this.velocity.y * dt
    this.mesh.position.z += this.velocity.z * dt

    this.mesh.rotation.x += this.angularVelocity.x * dt
    this.mesh.rotation.y += this.angularVelocity.y * dt
    this.mesh.rotation.z += this.angularVelocity.z * dt

    if (this.mesh.position.y < GROUND_Y) {
      this.mesh.position.y = GROUND_Y
      this.velocity.y *= -DAMPING
      this.velocity.x *= 0.85
      this.velocity.z *= 0.85
      this.angularVelocity.multiplyScalar(0.7)
      this.mesh.rotation.x *= 0.9
      this.mesh.rotation.z *= 0.9
    }

    if (this.mesh.position.x < WALL_LEFT) {
      this.mesh.position.x = WALL_LEFT
      this.velocity.x *= -DAMPING
    }
    if (this.mesh.position.x > WALL_RIGHT) {
      this.mesh.position.x = WALL_RIGHT
      this.velocity.x *= -DAMPING
    }
    if (this.mesh.position.z < -6) {
      this.mesh.position.z = -6
      this.velocity.z *= -DAMPING
    }
    if (this.mesh.position.z > 6) {
      this.mesh.position.z = 6
      this.velocity.z *= -DAMPING
    }

    const speed = this.velocity.length()
    if (speed < 0.15 && Math.abs(this.velocity.y) < 0.15) {
      this.settleTime += dt
      if (this.settleTime > 0.6) {
        this.isSettled = true
        this.velocity.set(0, 0, 0)
        this.angularVelocity.set(0, 0, 0)
        this.mesh.rotation.x += (Math.random() - 0.5) * 0.3
        this.mesh.rotation.z += (Math.random() - 0.5) * 0.3
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
    const minDist = 0.55

    if (dist < minDist && dist > 0.001) {
      const overlap = minDist - dist
      const nx = dx / dist
      const ny = dy / dist
      const nz = dz / dist

      const separation = overlap * 0.5
      this.mesh.position.x += nx * separation
      this.mesh.position.y += ny * separation
      this.mesh.position.z += nz * separation
      other.mesh.position.x -= nx * separation
      other.mesh.position.y -= ny * separation
      other.mesh.position.z -= nz * separation

      if (!this.isSettled) {
        const impact = Math.abs(this.velocity.dot(new THREE.Vector3(nx, ny, nz)))
        if (impact > 0.3) {
          this.velocity.x -= nx * impact * DAMPING
          this.velocity.y -= ny * impact * DAMPING
          this.velocity.z -= nz * impact * DAMPING
          this.angularVelocity.multiplyScalar(0.85)
        }
      }
      if (!other.isSettled) {
        const impact = Math.abs(other.velocity.dot(new THREE.Vector3(nx, ny, nz)))
        if (impact > 0.3) {
          other.velocity.x += nx * impact * DAMPING
          other.velocity.y += ny * impact * DAMPING
          other.velocity.z += nz * impact * DAMPING
          other.angularVelocity.multiplyScalar(0.85)
        }
      }
    }
  }
}

let physicsBeans = []

/**
 * 加载外部GLB模型
 */
const loadBeanModel = () => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    loader.load('/coffee_bean.glb', (gltf) => {
      const model = gltf.scene

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.roughness = 0.75
            child.material.metalness = 0.05
            child.material.clearcoat = 0.12
            child.material.clearcoatRoughness = 0.5
          }
        }
      })

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const scale = 0.5 / Math.max(size.x, size.y, size.z)
      model.scale.set(scale, scale, scale)

      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)

      beanModel = model
      modelLoaded = true
      resolve()
    }, undefined, (error) => {
      console.error('Error loading model:', error)
      modelLoaded = true
      resolve()
    })
  })
}

/**
 * 创建程序生成的咖啡豆几何体（作为模型加载失败的备选）
 */
const createFallbackBean = () => {
  const geometry = new THREE.SphereGeometry(0.28, 64, 64)
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)

    const length = Math.sqrt(x * x + y * y + z * z)
    if (length === 0) continue

    const nx = x / length
    const ny = y / length
    const nz = z / length

    let scale = 1.0
    const lengthFactor = 1.42

    const yAbs = Math.abs(ny)
    let tipFactor = 1.0
    if (yAbs > 0.6) {
      tipFactor = 1.0 - (yAbs - 0.6) * 0.55
    }

    const grooveDepth = 0.18
    const grooveWidth = 0.65
    const distFromEquator = Math.abs(ny)
    if (distFromEquator < grooveWidth) {
      const grooveFactor = Math.cos((distFromEquator / grooveWidth) * (Math.PI / 2))
      if (nz > 0) {
        scale -= grooveDepth * grooveFactor * nz
      }
    }

    const flattenFactor = 0.72

    const noise =
      Math.sin(x * 25) * Math.cos(y * 25) * Math.sin(z * 25) * 0.012 +
      Math.sin(x * 50 + z * 30) * 0.006 +
      Math.cos(y * 40 + x * 20) * 0.008

    const bulge = Math.sin(Math.abs(ny) * Math.PI) * 0.06
    scale += bulge

    const finalScale = scale * tipFactor + noise

    positions.setXYZ(
      i,
      x * finalScale,
      y * finalScale * lengthFactor,
      z * finalScale * flattenFactor
    )
  }

  geometry.computeVertexNormals()

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(512, 512)
  const data = imageData.data

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4
      const noise1 = (Math.random() - 0.5) * 15
      const noise2 = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 8
      const gradient = Math.sin((y / 512) * Math.PI) * 10
      const value = 100 + noise1 + noise2 + gradient
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
  texture.repeat.set(2, 1)

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setHSL(0.075, 0.4, 0.2),
    map: texture,
    roughness: 0.72,
    metalness: 0.02,
    clearcoat: 0.15,
    clearcoatRoughness: 0.6,
    envMapIntensity: 0.5
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建咖啡豆实例（优先使用外部模型，失败则用程序生成）
 */
const createBeanInstance = () => {
  if (beanModel) {
    const clone = beanModel.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }
  return createFallbackBean()
}

const emitBeans = () => {
  if (beanMeshes.length >= MAX_BEANS || !modelLoaded) return

  const worldX = (targetMouseX / window.innerWidth) * 18 - 9
  const worldY = -(targetMouseY / window.innerHeight) * 12 + 6

  const emitCount = Math.min(2, MAX_BEANS - beanMeshes.length)

  for (let i = 0; i < emitCount; i++) {
    const bean = createBeanInstance()

    bean.position.set(
      worldX + (Math.random() - 0.5) * 1.2,
      worldY + Math.random() * 0.3,
      (Math.random() - 0.5) * 4
    )

    bean.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )

    bean.castShadow = true
    bean.receiveShadow = true

    beanMeshes.push(bean)
    physicsBeans.push(new PhysicsBean(bean, bean.position.x, bean.position.y, bean.position.z))
    scene.add(bean)
  }
}

const initScene = async () => {
  const container = containerRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x14100e)
  scene.fog = new THREE.Fog(0x14100e, 10, 25)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 3, 14)
  camera.lookAt(0, -1, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0x8b7355, 0.25)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffe4c4, 1.0)
  mainLight.position.set(6, 12, 8)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.1
  mainLight.shadow.camera.far = 50
  mainLight.shadow.camera.left = -15
  mainLight.shadow.camera.right = 15
  mainLight.shadow.camera.top = 15
  mainLight.shadow.camera.bottom = -15
  mainLight.shadow.bias = -0.0005
  mainLight.shadow.radius = 4
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0x6b5b4f, 0.3)
  fillLight.position.set(-8, 4, -4)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xd4a574, 0.35)
  rimLight.position.set(-2, 2, -10)
  scene.add(rimLight)

  const pointLight = new THREE.PointLight(0xc4965c, 0.4, 20)
  pointLight.position.set(3, 5, 3)
  scene.add(pointLight)

  const groundGeometry = new THREE.PlaneGeometry(40, 30)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.25 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = GROUND_Y
  ground.receiveShadow = true
  scene.add(ground)

  await loadBeanModel()

  for (let i = 0; i < 40; i++) {
    const bean = createBeanInstance()

    bean.position.set(
      (Math.random() - 0.5) * 14,
      GROUND_Y + Math.random() * 4,
      (Math.random() - 0.5) * 10
    )
    bean.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    bean.castShadow = true
    bean.receiveShadow = true

    beanMeshes.push(bean)
    const pb = new PhysicsBean(bean, bean.position.x, bean.position.y, bean.position.z)
    pb.isSettled = true
    physicsBeans.push(pb)
    scene.add(bean)
  }

  animate()

  setTimeout(() => {
    isLoaded.value = true
  }, 800)

  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('touchmove', onTouchMove)
}

let lastTime = 0

const animate = () => {
  animationId = requestAnimationFrame(animate)

  const currentTime = Date.now()
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05)
  lastTime = currentTime

  mouseX += (targetMouseX - mouseX) * 0.08
  mouseY += (targetMouseY - mouseY) * 0.08

  if (currentTime - lastEmitTime > EMIT_INTERVAL) {
    emitBeans()
    lastEmitTime = currentTime
  }

  for (const bean of physicsBeans) {
    bean.update(deltaTime)
  }

  const checkCount = Math.min(40, physicsBeans.length)
  for (let i = 0; i < checkCount; i++) {
    const idx = Math.floor(Math.random() * physicsBeans.length)
    const bean1 = physicsBeans[idx]

    for (let j = 0; j < 8; j++) {
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
  targetMouseX = event.clientX
  targetMouseY = event.clientY
}

const onTouchMove = (event) => {
  if (event.touches.length > 0) {
    targetMouseX = event.touches[0].clientX
    targetMouseY = event.touches[0].clientY
  }
}

const onMouseLeave = () => {
  targetMouseX = window.innerWidth / 2
  targetMouseY = window.innerHeight / 2
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

  beanMeshes.forEach(bean => {
    bean.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      }
    })
  })
  beanMeshes = []
  physicsBeans = []

  if (beanModel) {
    beanModel.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      }
    })
    beanModel = null
  }

  if (renderer) {
    renderer.dispose()
    if (containerRef.value && renderer.domElement) {
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
  transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: crosshair;
}

.coffee-particle-scene.loaded {
  opacity: 1;
}
</style>
