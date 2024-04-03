"use client"
import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import gsap from "gsap"

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cubemapTexture = new THREE.TextureLoader().load("/cubemap.png")
  const earthTexture = new THREE.TextureLoader().load("/earth.jpg")
  const meshTexture = new THREE.TextureLoader().load("/jupiter.jpg")

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length === 0) {
      const scene = new THREE.Scene()
      const size = { width: window.innerWidth, height: window.innerHeight }
      const camera = new THREE.PerspectiveCamera(
        80,
        size.width / size.height,
        0.1,
        100
      )
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(size.width, size.height)
      renderer.setPixelRatio(2)
      containerRef.current?.appendChild(renderer.domElement)
      camera.position.z = 50
      scene.add(camera)

      // Lighting setting
      const light = new THREE.DirectionalLight(0xffffff, 1, 100)
      light.position.set(10, 10, 10)
      light.rotation.set(0, Math.PI, 0)
      light.shadowCameraFar = 50
      light.shadowCameraNear = 0.01
      light.castShadow = true
      light.shadowDarkness = 0.5
      light.shadowCameraVisible = true
      light.shadowCameraFar = 800
      light.shadowCameraFov = 15
      scene.add(light)

      // Background
      const path = "/cubemap/"
      const format = ".png"
      const urls = [
        path + "px" + format,
        path + "nx" + format,
        path + "py" + format,
        path + "ny" + format,
        path + "pz" + format,
        path + "nz" + format,
      ]
      const reflectionCube = new THREE.CubeTextureLoader().load(urls)
      const refractionCube = new THREE.CubeTextureLoader().load(urls)
      refractionCube.mapping = THREE.CubeRefractionMapping
      scene.background = reflectionCube

      // Control
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.enablePan = false
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.1

      // Main mesh object
      const geometry = new THREE.SphereGeometry(10, 64, 64)
      const material = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.5,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      const geometry2 = new THREE.SphereGeometry(2, 64, 64)
      const material2 = new THREE.MeshStandardMaterial({
        map: meshTexture,
        roughness: 0.1,
        // color: "#00ff83",
      })
      const mesh2 = new THREE.Mesh(geometry2, material2)
      mesh.add(mesh2)
      mesh2.position.x = 20

      renderer.render(scene, camera)

      window.addEventListener("resize", () => {
        size.width = window.innerWidth
        size.height = window.innerHeight
        renderer.setSize(size.width, size.height)
        camera.aspect = size.width / size.height
        camera.updateProjectionMatrix()
      })

      const loop = () => {
        light.position.x = 100 * Math.sin(Date.now() / 2400)
        light.position.z = 100 * Math.cos(Date.now() / 2400)
        controls.update()
        renderer.render(scene, camera)
        window.requestAnimationFrame(loop)
      }
      loop()
      const tl = gsap.timeline({ defaults: { duration: 1 } })
      tl.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })
      let mouseDown = false
      let rgb = []
      window.addEventListener("mousedown", () => (mouseDown = true))
      window.addEventListener("mouseup", () => (mouseDown = false))

      // window.addEventListener("mousemove", (e) => {
      //   if (mouseDown) {
      //     rgb = [
      //       Math.round((e.pageX / size.width) * 255),
      //       Math.round((e.pageY / size.width) * 255),
      //       255,
      //     ]
      //     console.log(rgb)
      //     let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
      //     gsap.to(mesh.material.color, {
      //       r: newColor.r,
      //       g: newColor.g,
      //       b: newColor.b,
      //     })
      //   }
      // })
    }
  }, [])

  return <div ref={containerRef} />
}

export default ThreeScene
