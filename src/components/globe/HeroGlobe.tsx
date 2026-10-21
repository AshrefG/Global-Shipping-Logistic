"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"
import { prefersReducedMotion } from "@/lib/gsap"

/* ---------------------------------------------------------------- data --- */

const AMBER = "#efa831"
const AMBER_HOT = "#e0812e"
const DOT_GRAY = "#4a5060"

/** Freight network hubs (road-first GCC corridors, Dubai HQ) */
const HUBS: Record<string, [lat: number, lng: number]> = {
  DXB: [25.2, 55.27],   // Dubai, HQ (DIP-1 / Dubai Industrial City)
  AUH: [24.45, 54.38],  // Abu Dhabi
  RUH: [24.71, 46.68],  // Riyadh
  JED: [21.49, 39.19],  // Jeddah
  DOH: [25.29, 51.53],  // Doha
  KWI: [29.38, 47.98],  // Kuwait City
  MCT: [23.59, 58.41],  // Muscat
}

/** Every corridor leaves Dubai, so the network reads as one fan from HQ */
const CORRIDORS: Array<[keyof typeof HUBS, keyof typeof HUBS]> = [
  ["DXB", "JED"],
  ["DXB", "RUH"],
  ["DXB", "KWI"],
  ["DXB", "DOH"],
  ["DXB", "MCT"],
  ["DXB", "AUH"],
]

const R = 1
/** Yaw that brings the GCC (≈lng 52°) to the front of the globe */
const BASE_YAW = -2.43
/**
 * No lean: the GCC (lat 25) sits a little above the centre of the disc, so each
 * corridor lifts off the surface as its own hump (longer route, taller hump)
 * instead of pointing straight at the camera.
 */
const BASE_TILT = 0
/** Camera distance that fits the whole globe and its rim inside the card */
const CAMERA_Z = 3

function latLngToVec3(lat: number, lng: number, radius = R): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

/** Arc height grows with distance, so the routes nest instead of overlapping */
function corridorCurve(a: THREE.Vector3, b: THREE.Vector3): THREE.QuadraticBezierCurve3 {
  const mid = a.clone().add(b).multiplyScalar(0.5)
  const lift = 1 + 0.02 + a.distanceTo(b) * 1.1
  mid.normalize().multiplyScalar(R * lift)
  return new THREE.QuadraticBezierCurve3(a, mid, b)
}

/* -------------------------------------------------------------- pieces --- */

/** Evenly distributed dot shell: abstract landless globe, engineered look */
function DotShell({ count = 2000 }: { count?: number }) {
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const rad = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts[i * 3] = Math.cos(theta) * rad * R
      pts[i * 3 + 1] = y * R
      pts[i * 3 + 2] = Math.sin(theta) * rad * R
    }
    return pts
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={DOT_GRAY} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}

function Corridor({ from, to, offset }: { from: THREE.Vector3; to: THREE.Vector3; offset: number }) {
  const curve = useMemo(() => corridorCurve(from, to), [from, to])
  const points = useMemo(() => curve.getPoints(64), [curve])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const still = useMemo(() => prefersReducedMotion(), [])

  useFrame(({ clock }) => {
    if (still) return
    const mat = lineRef.current?.material
    if (mat && "dashOffset" in mat) mat.dashOffset = -clock.elapsedTime * 0.08
    if (pulseRef.current) {
      const t = (clock.elapsedTime * 0.11 + offset) % 1
      pulseRef.current.position.copy(curve.getPoint(t))
    }
  })

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color={AMBER}
        lineWidth={1.4}
        dashed
        dashSize={0.03}
        gapSize={0.018}
        transparent
        opacity={0.95}
      />
      {/* freight pulse travelling out from Dubai */}
      <mesh ref={pulseRef} position={points[Math.round(offset * 48)]}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshBasicMaterial color={AMBER_HOT} />
      </mesh>
    </group>
  )
}

function Hub({ position, primary = false }: { position: THREE.Vector3; primary?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[primary ? 0.018 : 0.009, 12, 12]} />
        <meshBasicMaterial color={AMBER} />
      </mesh>
      {/* soft halo, only on the Dubai HQ */}
      {primary && (
        <mesh>
          <sphereGeometry args={[0.036, 16, 16]} />
          <meshBasicMaterial color={AMBER} transparent opacity={0.14} />
        </mesh>
      )}
    </group>
  )
}

function Scene() {
  const group = useRef<THREE.Group>(null)
  const still = useMemo(() => prefersReducedMotion(), [])

  const hubVecs = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(HUBS).map(([k, [lat, lng]]) => [k, latLngToVec3(lat, lng)]),
      ) as Record<keyof typeof HUBS, THREE.Vector3>,
    [],
  )

  useFrame((state) => {
    const g = group.current
    if (!g) return
    // gentle sway around the corridor cluster: the network stays on camera
    if (!still) {
      g.rotation.y = BASE_YAW + Math.sin(state.clock.elapsedTime * 0.14) * 0.22
    }
    // pointer parallax: gentle lean toward the cursor
    const px = state.pointer.x * 0.12
    const py = state.pointer.y * 0.08
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, BASE_TILT - py, 0.05)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, px * 0.3, 0.05)
  })

  return (
    // Start rotated so the GCC corridor cluster faces the camera
    <group ref={group} position={[0, -0.02, 0]} rotation={[BASE_TILT, BASE_YAW, 0]}>
      {/* body */}
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color="#0d1019" transparent opacity={0.94} />
      </mesh>
      {/* faint graticule */}
      <mesh>
        <sphereGeometry args={[R * 0.99, 24, 16]} />
        <meshBasicMaterial color="#39404f" wireframe transparent opacity={0.16} />
      </mesh>
      {/* atmosphere rim */}
      <mesh scale={1.08}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      <DotShell />

      {CORRIDORS.map(([a, b], i) => (
        <Corridor key={`${a}-${b}`} from={hubVecs[a]} to={hubVecs[b]} offset={i / CORRIDORS.length} />
      ))}
      {Object.entries(hubVecs).map(([k, v]) => (
        <Hub key={k} position={v} primary={k === "DXB"} />
      ))}
    </group>
  )
}

/* -------------------------------------------------------------- export --- */

/**
 * 3D freight-network globe. Client-only: import via next/dynamic with
 * `ssr: false`. Renders only while on screen. Reduced motion: static frame,
 * no rotation or pulses.
 */
export default function HeroGlobe({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const still = prefersReducedMotion()

  // Stop the render loop while the card is off screen
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !("IntersectionObserver" in window)) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, CAMERA_Z], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={still ? "demand" : inView ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
