<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, beans = [], particles = []
let animationId, mouseX = 0, mouseY = 0
let targetMouseX = 0, targetMouseY = 0
let isLoaded = ref(false)

const initScene = () => {
  const container = containerRef.value
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFAFAFA)

  camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000)
  camera.position.set(0, 0, 6)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  initLights()
  createCoffeeBeans()
  createParticles()
  animate()
  
  setTimeout(() => {
    isLoaded.value = true
  }, 500)

  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
}

const initLights = () => {
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xFFF5E6, 1.2)
  mainLight.position.set(8, 12, 10)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 4096
  mainLight.shadow.mapSize.height = 4096
  mainLight.shadow.camera.near = 0.1
  mainLight.shadow.camera.far = 50
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0xFFD4B8, 0.4)
  fillLight.position.set(-8, -6, 8)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.35)
  rimLight.position.set(0, -10, -8)
  scene.add(rimLight)

  const pointLight1 = new THREE.PointLight(0x8B7355, 0.5, 30)
  pointLight1.position.set(5, 3, 5)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xC4A77D, 0.3, 25)
  pointLight2.position.set(-5, -3, 5)
  scene.add(pointLight2)
}

const createBeanGeometry = () => {
  const geometry = new THREE.SphereGeometry(0.38, 128, 128)
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)

    const length = Math.sqrt(x * x + y * y + z * z)
    const nx = x / length
    const ny = y / length

    let scale = 1.0
    if (ny > 0.2) scale *= (1 - (ny - 0.2) * 0.45)
    else if (ny < -0.3) scale *= (1 + (ny + 0.3) * 0.35)

    const noise = (Math.sin(x * 18) * Math.cos(y * 18) * Math.sin(z * 18)) * 0.022
    scale += noise

    const bulge = Math.sin(ny * Math.PI) * 0.18
    scale += bulge

    positions.setXYZ(i, x * scale, y * scale * 1.35, z * scale * 0.68)
  }

  geometry.computeVertexNormals()
  geometry.computeTangents()
  return geometry
}

const createBeanMaterial = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const imageData = ctx.createImageData(512, 512)
  const data = imageData.data

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4
      const noise1 = (Math.random() - 0.5) * 8
      const noise2 = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 4
      const gradient = Math.sin((y / 512) * Math.PI) * 12
      const value = 118 + noise1 + noise2 + gradient
      data[i] = value
      data[i + 1] = value * 0.92
      data[i + 2] = value * 0.82
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8)

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.075, 0.42, 0.28),
    roughness: 0.9,
    metalness: 0.12,
    bumpMap: texture,
    bumpScale: 0.012,
    displacementMap: texture,
    displacementScale: 0.018,
    envMapIntensity: 1.2
  })
}

const createCoffeeBeans = () => {
  const geometry = createBeanGeometry()
  const material = createBeanMaterial()

  const positions = [
    { x: 0, y: 0, z: 0, scale: 1.4, delay: 0 },
    { x: 2.2, y: 0.8, z: 1.5, scale: 1.0, delay: 0.6 },
    { x: -2.5, y: 0.5, z: 1.0, scale: 0.85, delay: 1.2 },
    { x: 1.8, y: -1.2, z: 0.8, scale: 0.75, delay: 1.8 },
    { x: -1.5, y: -0.9, z: 1.2, scale: 0.8, delay: 2.4 },
    { x: 0, y: 1.5, z: -0.5, scale: 0.65, delay: 3.0 },
    { x: -3.0, y: 1.2, z: -0.8, scale: 0.55, delay: 3.6 },
    { x: 2.8, y: -0.3, z: -1.0, scale: 0.58, delay: 4.2 },
    { x: -2.2, y: 1.8, z: 0.6, scale: 0.48, delay: 4.8 },
    { x: 2.5, y: 1.3, z: -0.5, scale: 0.52, delay: 5.4 }
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
      rotationSpeed: 0.0025 + Math.random() * 0.0015,
      floatOffset: Math.random() * Math.PI * 2,
      originalPosition: new THREE.Vector3(pos.x, pos.y, pos.z)
    }
    beans.push(bean)
    scene.add(bean)
  })
}

const createParticles = () => {
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 120
  const positions = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  const delays = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    scales[i] = Math.random() * 0.03 + 0.01
    delays[i] = Math.random() * 10
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
  particleGeometry.setAttribute('delay', new THREE.BufferAttribute(delays, 1))

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x8B7355) }
    },
    vertexShader: `
      attribute float scale;
      attribute float delay;
      uniform float time;
      varying float vOpacity;
      void main() {
        vec3 pos = position;
        pos.y += sin(time * 0.3 + delay) * 0.5;
        pos.x += cos(time * 0.2 + delay * 0.5) * 0.3;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = scale * (300.0 / -mvPosition.z);
        vOpacity = 0.3 + sin(time + delay) * 0.2;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = (1.0 - dist * 2.0) * vOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  particleSystem.userData.material = particleMaterial
  particles.push(particleSystem)
  scene.add(particleSystem)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  const time = Date.now() * 0.001

  mouseX += (targetMouseX - mouseX) * 0.08
  mouseY += (targetMouseY - mouseY) * 0.08

  camera.position.x = mouseX * 0.008
  camera.position.y = -mouseY * 0.008
  camera.lookAt(0, 0, 0)

  beans.forEach((bean) => {
    const delay = bean.userData.delay
    const baseX = bean.userData.baseX
    const baseY = bean.userData.baseY
    const baseZ = bean.userData.baseZ
    const floatOffset = bean.userData.floatOffset

    const parallaxX = mouseX * (0.001 * (1 - bean.userData.baseScale))
    const parallaxY = mouseY * (0.001 * (1 - bean.userData.baseScale))

    bean.position.x = baseX + parallaxX + Math.sin(time * 0.25 + delay + floatOffset) * 0.5
    bean.position.y = baseY + parallaxY + Math.cos(time * 0.2 + delay + floatOffset) * 0.4
    bean.position.z = baseZ + Math.sin(time * 0.15 + delay + floatOffset) * 0.3

    bean.rotation.y = time * (0.22 + bean.userData.index * 0.025) + delay
    bean.rotation.x = Math.sin(time * 0.5 + delay) * 0.1
    bean.rotation.z = Math.cos(time * 0.35 + delay) * 0.06

    const scalePulse = 1 + Math.sin(time * 1.5 + delay) * 0.03
    bean.scale.set(
      bean.userData.baseScale * scalePulse,
      bean.userData.baseScale * scalePulse,
      bean.userData.baseScale * scalePulse
    )
  })

  particles.forEach((particle) => {
    if (particle.userData.material) {
      particle.userData.material.uniforms.time.value = time
    }
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

const onMouseMove = (event) => {
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  targetMouseX = event.clientX - rect.left - rect.width / 2
  targetMouseY = event.clientY - rect.top - rect.height / 2
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
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div ref="containerRef" class="coffee-scene-3d" :class="{ loaded: isLoaded }"></div>
</template>

<style scoped>
.coffee-scene-3d {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.coffee-scene-3d.loaded {
  opacity: 1;
}
</style>