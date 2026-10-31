"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  SRGBColorSpace,
} from "three";
import type { Group } from "three";

type Point = [number, number];
type Props = { compact?: boolean };

const landmasses: Point[][] = [
  [[-168,72],[-153,69],[-143,62],[-132,57],[-129,50],[-124,46],[-125,39],[-119,33],[-112,29],[-106,24],[-98,19],[-91,19],[-86,22],[-82,26],[-81,32],[-76,36],[-70,43],[-61,48],[-58,54],[-65,59],[-78,61],[-88,68],[-105,73],[-124,75],[-145,74]],
  [[-53,82],[-42,80],[-35,73],[-39,62],[-48,59],[-57,63],[-61,72]],
  [[-81,12],[-74,10],[-69,7],[-62,4],[-51,1],[-48,-7],[-50,-16],[-54,-23],[-58,-32],[-63,-42],[-68,-53],[-73,-48],[-76,-35],[-78,-22],[-80,-8]],
  [[-11,72],[2,70],[13,66],[25,69],[34,64],[42,58],[57,57],[68,61],[81,59],[91,56],[105,58],[116,54],[128,51],[139,48],[151,54],[164,60],[178,58],[174,48],[163,43],[151,40],[141,35],[132,32],[124,25],[116,21],[109,15],[103,8],[98,7],[94,13],[88,20],[82,22],[77,8],[72,7],[68,23],[60,25],[55,22],[49,17],[43,13],[40,7],[35,5],[33,15],[27,22],[23,34],[17,39],[12,45],[4,48],[-3,52],[-8,59]],
  [[-17,36],[-6,37],[8,36],[20,32],[31,30],[36,21],[42,12],[49,4],[45,-5],[40,-12],[38,-21],[31,-30],[23,-35],[17,-34],[12,-27],[8,-17],[2,-8],[-4,1],[-9,12],[-15,21]],
  [[-10,58],[-4,59],[0,55],[-3,51],[-8,50],[-11,54]],
  [[-7,50],[-4,51],[-2,54],[-5,56],[-8,54]],
  [[-25,65],[-19,66],[-16,63],[-20,61],[-24,62]],
  [[-8,54],[-5,55],[-4,53],[-7,52]],
  [[48,-13],[50,-16],[49,-23],[46,-26],[44,-19]],
  [[112,-11],[130,-11],[145,-16],[153,-25],[149,-38],[137,-43],[122,-39],[114,-27]],
  [[130,33],[135,35],[140,41],[144,44],[146,40],[142,34],[137,31]],
  [[95,5],[105,3],[115,-2],[121,-7],[118,-10],[108,-7],[100,-3]],
  [[121,18],[124,19],[126,15],[124,11]],
  [[-180,-72],[-150,-75],[-110,-73],[-70,-76],[-25,-73],[20,-75],[65,-72],[110,-75],[150,-72],[180,-74],[180,-90],[-180,-90]],
];

function projectPoint(lon: number, lat: number, width: number, height: number): Point {
  return [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
}

function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const ocean = context.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#123e55");
  ocean.addColorStop(0.5, "#0a3047");
  ocean.addColorStop(1, "#061b31");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(920, 360, 20, 920, 360, 960);
  glow.addColorStop(0, "rgba(74,151,178,.25)");
  glow.addColorStop(1, "rgba(15,48,68,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 1.2;
  context.strokeStyle = "rgba(147,207,220,.12)";
  for (let lon = -180; lon <= 180; lon += 20) {
    const x = ((lon + 180) / 360) * canvas.width;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  const land = context.createLinearGradient(300, 120, 1550, 920);
  land.addColorStop(0, "#9ebd9c");
  land.addColorStop(0.46, "#789f83");
  land.addColorStop(1, "#506f69");
  context.fillStyle = land;
  context.strokeStyle = "rgba(192,220,180,.62)";
  context.lineWidth = 3;
  context.lineJoin = "round";
  context.shadowColor = "rgba(101,185,174,.22)";
  context.shadowBlur = 12;

  for (const polygon of landmasses) {
    context.beginPath();
    polygon.forEach(([lon, lat], index) => {
      const [x, y] = projectPoint(lon, lat, canvas.width, canvas.height);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    context.fill();
    context.stroke();
  }
  context.shadowBlur = 0;

  // Fine topographic traces keep the surface from reading as a flat sticker.
  context.strokeStyle = "rgba(225,231,187,.15)";
  context.lineWidth = 1.4;
  for (let index = 0; index < 34; index += 1) {
    const x = 180 + ((index * 173) % 1660);
    const y = 120 + ((index * 97) % 720);
    context.beginPath();
    context.ellipse(x, y, 20 + (index % 7) * 9, 7 + (index % 5) * 4, index * 0.17, 0, Math.PI * 1.85);
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;

  let seed = 27;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let cluster = 0; cluster < 70; cluster += 1) {
    const x = random() * canvas.width;
    const y = 35 + random() * (canvas.height - 70);
    const count = 4 + Math.floor(random() * 10);
    for (let spot = 0; spot < count; spot += 1) {
      const radiusX = 5 + random() * 23;
      const radiusY = 2 + random() * 7;
      context.fillStyle = "rgba(225,241,245," + (0.025 + random() * 0.085) + ")";
      context.beginPath();
      context.ellipse(
        x + (random() - 0.5) * 72,
        y + (random() - 0.5) * 25,
        radiusX,
        radiusY,
        (random() - 0.5) * 0.7,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function cityPosition(lon: number, lat: number, radius: number): [number, number, number] {
  const longitude = (lon * Math.PI) / 180;
  const latitude = (lat * Math.PI) / 180;
  return [
    radius * Math.cos(latitude) * Math.sin(longitude),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.cos(longitude),
  ];
}

function Earth({ compact, animate }: {
  compact: boolean;
  animate: boolean;
}) {
  const earthMap = useMemo(() => createEarthTexture(), []);
  const cloudMap = useMemo(() => createCloudTexture(), []);
  const planet = useRef<Group>(null);
  const cloudLayer = useRef<Group>(null);

  useEffect(() => () => {
    earthMap?.dispose();
    cloudMap?.dispose();
  }, [earthMap, cloudMap]);

  useFrame((state, delta) => {
    if (!animate) return;
    if (planet.current) {
      planet.current.rotation.y += delta * (compact ? 0.105 : 0.085);
      planet.current.rotation.x += (state.pointer.y * 0.055 - planet.current.rotation.x) * 0.018;
    }
    if (cloudLayer.current) cloudLayer.current.rotation.y += delta * 0.012;
  });

  const markers = [
    { name: "New York", lon: -74, lat: 41 },
    { name: "London", lon: -0.1, lat: 51.5 },
    { name: "Mumbai", lon: 72.8, lat: 19.1 },
    { name: "Tokyo", lon: 139.7, lat: 35.7 },
  ];

  return (
    <group rotation={[0.035, -0.46, -0.055]}>
      <group ref={planet}>
        <mesh>
          <sphereGeometry args={[1.12, compact ? 64 : 88, compact ? 48 : 72]} />
          <meshPhysicalMaterial
            map={earthMap ?? undefined}
            color={earthMap ? "#ffffff" : "#16435b"}
            roughness={0.78}
            metalness={0.06}
            clearcoat={0.28}
            clearcoatRoughness={0.55}
          />
        </mesh>

        {cloudMap && (
          <group ref={cloudLayer}>
            <mesh scale={1.008}>
              <sphereGeometry args={[1.12, 64, 48]} />
              <meshStandardMaterial map={cloudMap} transparent opacity={0.48} depthWrite={false} />
            </mesh>
          </group>
        )}

        <mesh scale={1.055}>
          <sphereGeometry args={[1.12, 64, 48]} />
          <meshBasicMaterial
            color="#69bce9"
            transparent
            opacity={0.17}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {markers.map((marker) => (
          <mesh key={marker.name} position={cityPosition(marker.lon, marker.lat, 1.132)}>
            <sphereGeometry args={[compact ? 0.018 : 0.022, 12, 12]} />
            <meshBasicMaterial color="#ffc987" />
          </mesh>
        ))}
      </group>

      <mesh rotation={[1.18, 0.18, 0.48]}>
        <torusGeometry args={[1.34, 0.0065, 8, 144]} />
        <meshBasicMaterial color="#e9b57f" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[0.44, -0.74, 1.12]}>
        <torusGeometry args={[1.42, 0.004, 8, 144]} />
        <meshBasicMaterial color="#7eb7d3" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function DiscoveryGlobe({ compact = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (typeof window.IntersectionObserver !== "function") {
      const frame = window.requestAnimationFrame(() => {
        setEntered(true);
        setVisible(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[0]?.isIntersecting ?? false;
      if (isVisible) setEntered(true);
      setVisible(isVisible);
    }, { rootMargin: "180px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node || !entered || reducedMotion) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.fromTo(node, { scale: 0.94 }, {
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
        });
        gsap.to(node, {
          y: -9,
          ease: "none",
          scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", scrub: 0.65 },
        });
      }, node);
    }).catch(() => {
      // The globe remains a working Three.js scene if the optional scroll motion fails.
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [entered, reducedMotion]);

  return (
    <div
      ref={root}
      className={"discovery-globe" + (compact ? " is-compact" : "")}
      data-discovery-globe
      data-webgl-ready={entered ? "pending" : "waiting"}
      aria-hidden="true"
    >
      {entered ? (
        <Canvas
          dpr={compact ? 1 : [1, 1.5]}
          camera={{ position: [0, 0, 3.55], fov: 35 }}
          frameloop={visible && !reducedMotion ? "always" : "demand"}
          gl={{ alpha: true, antialias: !compact, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.outputColorSpace = SRGBColorSpace;
          }}
          fallback={<div className="discovery-globe__fallback" />}
        >
          <ambientLight intensity={0.82} />
          <directionalLight position={[3, 2.6, 4]} intensity={2.3} color="#fff1d7" />
          <pointLight position={[-3, -1, 2]} intensity={1.15} color="#4d9bc7" />
          <Earth compact={compact} animate={!reducedMotion && visible} />
        </Canvas>
      ) : (
        <div className="discovery-globe__fallback" />
      )}
    </div>
  );
}
