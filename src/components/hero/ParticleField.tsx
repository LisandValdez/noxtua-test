import { Canvas, useFrame } from "@react-three/fiber";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const GOLD = "#d4a72a";
const COUNT = 48;
const LINK_DIST = 3.4;

type Point = [number, number, number];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makePoints(): Point[] {
  return Array.from({ length: COUNT }, () => [
    rand(-8.5, 8.5),
    rand(-4.6, 4.6),
    rand(-4.5, 2.5),
  ]);
}

/** Capa de partículas del hero: esferas doradas + líneas entre nodos cercanos. */
function Field({ rx, ry }: { rx: MotionValue<number>; ry: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(makePoints, []);

  const linkPositions = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const [ax, ay, az] = points[i];
        const [bx, by, bz] = points[j];
        const d = Math.hypot(ax - bx, ay - by, az - bz);
        if (d < LINK_DIST) out.push(ax, ay, az, bx, by, bz);
      }
    }
    return new Float32Array(out);
  }, [points]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Rotación lenta continua (~40s por vuelta) + parallax con el puntero
    const targetY = t * 0.157 + ry.get() * 0.42;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, Math.min(1, delta * 2.2));
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, rx.get() * 0.3, Math.min(1, delta * 2.2));
    // Flotación sutil
    g.position.y = Math.sin(t * 0.5) * 0.18;
  });

  return (
    <group ref={group}>
      {points.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.055 + (z + 4.5) / 20, 16, 16]} />
          <meshStandardMaterial
            color="#b8912e"
            metalness={0.72}
            roughness={0.32}
            emissive={GOLD}
            emissiveIntensity={0.32}
          />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={GOLD} transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}

export default function ParticleField() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(mx, { stiffness: 55, damping: 20, mass: 0.6 });
  const ry = useSpring(my, { stiffness: 55, damping: 20, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div className="hero-3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 6, 8]} intensity={1.6} color="#ffd9a0" />
        <Field rx={rx} ry={ry} />
      </Canvas>
    </div>
  );
}
