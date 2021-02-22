import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { proxy, snapshot, useProxy } from 'valtio'
import { HexColorPicker } from 'react-colorful'

const state = proxy({
  current: null,
  items: {
    paint: '#ffffff',
    window: '#ffffff',
    light: '#ffffff',
    wheels: '#ffffff'
  }
})

function Car(props) {
  const group = useRef()
  const snap = useProxy(state)
  const { nodes, materials } = useGLTF('/car-split-comp.glb')
  const [hovered, set] = useState(null)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  })

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation(), set(e.object.material.name)
      }}
      onPointerOut={(e) => {
        e.intersections.length === 0 && set(null)
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        state.current = e.object.material.name
      }}
      onPointerMissed={(e) => {
        state.current = null
      }}>
      <mesh material-color={snap.items.paint} material={materials.paint} geometry={nodes.car.geometry} />
      <mesh material-color={snap.items.window} material={materials.window} geometry={nodes.window.geometry} />
      <mesh material-color={snap.items.light} material={materials.light} geometry={nodes.light.geometry} />
      <mesh material-color={snap.items.wheels} material={materials.wheels} geometry={nodes.wheels.geometry} />
    </group>
  )
}

function Picker() {
  const snap = useProxy(state)
  return (
    <div className="picker" style={{ display: snap.current ? 'block' : 'none' }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Picker />
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.3} position={[5, 20, 20]} />
        <Suspense fallback={null}>
          <Car />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  )
}
