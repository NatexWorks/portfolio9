"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
} from "three";
import type { Group } from "three";

type Props = { compact?: boolean };
type Coordinate = [number, number];
type LandFeatureCollection = {
  features: Array<{
    geometry: {
      type: "Polygon" | "MultiPolygon";
      coordinates: number[][][] | number[][][][];
    };
  }>;
};
type EarthTextures = {
  day: CanvasTexture;
  night: CanvasTexture;
  clouds: CanvasTexture;
  landFeatureCount: number;
};

const earthVertexShader = [
  "varying vec2 vUv;",
  "varying vec3 vNormalView;",
  "void main() {",
  "  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);",
  "  vUv = uv;",
  "  vNormalView = normalize(normalMatrix * normal);",
  "  gl_Position = projectionMatrix * viewPosition;",
  "}",
].join("\n");

const earthFragmentShader = [
  "uniform sampler2D uDayMap;",
  "uniform sampler2D uNightMap;",
  "uniform vec3 uSunDirection;",
  "varying vec2 vUv;",
  "varying vec3 vNormalView;",
  "void main() {",
  "  vec3 normal = normalize(vNormalView);",
  "  float sunAngle = dot(normal, normalize(uSunDirection));",
  "  float daylight = smoothstep(-0.17, 0.16, sunAngle);",
  "  float twilight = smoothstep(-0.24, -0.05, sunAngle) * (1.0 - smoothstep(0.015, 0.18, sunAngle));",
  "  vec3 dayColour = texture2D(uDayMap, vUv).rgb;",
  "  vec3 nightColour = texture2D(uNightMap, vUv).rgb;",
  "  vec3 surface = mix(nightColour, dayColour * (0.68 + 0.34 * max(sunAngle, 0.0)), daylight);",
  "  surface += vec3(0.12, 0.25, 0.38) * twilight * 0.16;",
  "  vec3 reflected = reflect(-normalize(uSunDirection), normal);",
  "  float specular = pow(max(dot(reflected, vec3(0.0, 0.0, 1.0)), 0.0), 42.0);",
  "  surface += vec3(0.22, 0.43, 0.58) * specular * daylight * 0.16;",
  "  gl_FragColor = vec4(surface, 1.0);",
  "  #include <tonemapping_fragment>",
  "  #include <colorspace_fragment>",
  "}",
].join("\n");

const atmosphereVertexShader = [
  "varying vec3 vNormalView;",
  "varying vec3 vViewPosition;",
  "void main() {",
  "  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);",
  "  vNormalView = normalize(normalMatrix * normal);",
  "  vViewPosition = -viewPosition.xyz;",
  "  gl_Position = projectionMatrix * viewPosition;",
  "}",
].join("\n");

const atmosphereFragmentShader = [
  "varying vec3 vNormalView;",
  "varying vec3 vViewPosition;",
  "void main() {",
  "  float facing = max(dot(normalize(vNormalView), normalize(vViewPosition)), 0.0);",
  "  float rim = pow(1.0 - facing, 3.1);",
  "  gl_FragColor = vec4(vec3(0.18, 0.52, 0.78), rim * 0.58);",
  "}",
].join("\n");

function seededRandom(seedValue: number) {
  let seed = seedValue >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function projectCoordinate([longitude, latitude]: Coordinate, width: number, height: number) {
  return {
    x: ((longitude + 180) / 360) * width,
    y: ((90 - latitude) / 180) * height,
  };
}

function createLandPath(land: LandFeatureCollection, width: number, height: number) {
  const path = new Path2D();
  let polygonCount = 0;

  for (const feature of land.features) {
    const geometry = feature.geometry;
    const polygons = geometry.type === "Polygon"
      ? [geometry.coordinates as number[][][]]
      : geometry.coordinates as number[][][][];

    for (const polygon of polygons) {
      const outerRing = polygon[0];
      if (!outerRing || outerRing.length < 4) continue;
      outerRing.forEach((point, index) => {
        const { x, y } = projectCoordinate([point[0], point[1]], width, height);
        if (index === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
      path.closePath();
      polygonCount += 1;
    }
  }

  return { path, polygonCount };
}

function createDayTexture(landPath: Path2D, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas is unavailable for the Earth map.");

  const ocean = context.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, "#183d53");
  ocean.addColorStop(0.24, "#0c3a54");
  ocean.addColorStop(0.56, "#0a2f49");
  ocean.addColorStop(1, "#102b42");
  context.fillStyle = ocean;
  context.fillRect(0, 0, width, height);

  const oceanLight = context.createRadialGradient(width * 0.45, height * 0.38, 5, width * 0.45, height * 0.38, width * 0.66);
  oceanLight.addColorStop(0, "rgba(76,143,170,.23)");
  oceanLight.addColorStop(1, "rgba(18,52,75,0)");
  context.fillStyle = oceanLight;
  context.fillRect(0, 0, width, height);

  context.save();
  context.strokeStyle = "rgba(116,181,194,.075)";
  context.lineWidth = Math.max(1, width / 1800);
  for (let band = 0; band < 28; band += 1) {
    const y = height * (0.16 + band * 0.025);
    context.beginPath();
    context.moveTo(-width * 0.04, y);
    context.bezierCurveTo(width * 0.22, y - 22, width * 0.34, y + 24, width * 0.55, y);
    context.bezierCurveTo(width * 0.73, y - 20, width * 0.86, y + 20, width * 1.04, y - 2);
    context.stroke();
  }
  context.restore();

  const land = context.createLinearGradient(0, 0, 0, height);
  land.addColorStop(0, "#c0c6ad");
  land.addColorStop(0.12, "#8fa783");
  land.addColorStop(0.35, "#6f916d");
  land.addColorStop(0.62, "#7d936d");
  land.addColorStop(0.83, "#a99a76");
  land.addColorStop(1, "#d6d4c1");
  context.fillStyle = land;
  context.fill(landPath, "evenodd");

  context.save();
  context.clip(landPath, "evenodd");

  const random = seededRandom(8417);
  const terrainColours = [
    "rgba(38,91,68,.15)",
    "rgba(179,153,105,.17)",
    "rgba(204,192,151,.13)",
    "rgba(48,105,81,.12)",
    "rgba(135,123,91,.12)",
  ];
  for (let patch = 0; patch < 1850; patch += 1) {
    const x = random() * width;
    const y = random() * height;
    const radiusX = width * (0.002 + random() * 0.017);
    const radiusY = radiusX * (0.25 + random() * 0.55);
    const shade = terrainColours[Math.floor(random() * terrainColours.length)];
    const gradient = context.createRadialGradient(x, y, 0, x, y, radiusX);
    gradient.addColorStop(0, shade);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, y, radiusX, radiusY, random() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }

  context.strokeStyle = "rgba(231,222,187,.105)";
  context.lineWidth = Math.max(0.65, width / 2800);
  for (let contour = 0; contour < 360; contour += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = width * (0.002 + random() * 0.012);
    context.beginPath();
    context.ellipse(x, y, radius, radius * (0.25 + random() * 0.35), random() * Math.PI, 0.15, Math.PI * (1.2 + random() * 0.7));
    context.stroke();
  }
  context.restore();

  context.strokeStyle = "rgba(204,220,193,.38)";
  context.lineWidth = Math.max(0.8, width / 1900);
  context.stroke(landPath);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createNightTexture(landPath: Path2D, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas is unavailable for the night-lights map.");

  const nightOcean = context.createLinearGradient(0, 0, 0, height);
  nightOcean.addColorStop(0, "#020b17");
  nightOcean.addColorStop(0.52, "#03101e");
  nightOcean.addColorStop(1, "#030b16");
  context.fillStyle = nightOcean;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#0b1a27";
  context.fill(landPath, "evenodd");

  const cities = [
    [-118.24, 34.05, 0.8], [-122.42, 37.77, 0.55], [-122.33, 47.61, 0.42],
    [-87.63, 41.88, 0.58], [-74.01, 40.71, 1.0], [-99.13, 19.43, 0.72],
    [-46.63, -23.55, 0.88], [-43.2, -22.9, 0.46], [-0.12, 51.51, 0.92],
    [2.35, 48.86, 0.72], [13.4, 52.52, 0.55], [28.98, 41.01, 0.68],
    [31.24, 30.04, 0.62], [3.38, 6.52, 0.52], [37.62, 55.75, 0.75],
    [55.27, 25.2, 0.42], [72.88, 19.08, 0.92], [77.21, 28.61, 0.9],
    [67.01, 24.86, 0.52], [90.41, 23.81, 0.5], [100.5, 13.76, 0.64],
    [103.82, 1.35, 0.45], [106.85, -6.21, 0.78], [116.41, 39.9, 0.72],
    [121.47, 31.23, 0.96], [126.98, 37.56, 0.62], [139.69, 35.68, 1.0],
    [135.5, 34.69, 0.75], [151.21, -33.87, 0.58], [144.96, -37.81, 0.42],
    [28.05, -26.2, 0.52], [18.42, -33.92, 0.35],
  ] as const;

  context.save();
  context.globalCompositeOperation = "screen";
  const random = seededRandom(20261031);
  for (const [longitude, latitude, intensity] of cities) {
    const { x, y } = projectCoordinate([longitude, latitude], width, height);
    const spread = width * 0.011 * intensity;
    const glow = context.createRadialGradient(x, y, 0, x, y, spread);
    glow.addColorStop(0, "rgba(255,205,135," + (0.44 * intensity) + ")");
    glow.addColorStop(0.28, "rgba(245,174,98," + (0.18 * intensity) + ")");
    glow.addColorStop(1, "rgba(225,150,88,0)");
    context.fillStyle = glow;
    context.fillRect(x - spread, y - spread, spread * 2, spread * 2);

    for (let light = 0; light < 78 * intensity; light += 1) {
      const angle = random() * Math.PI * 2;
      const distance = Math.sqrt(random()) * spread * (0.35 + random() * 0.7);
      const lightX = x + Math.cos(angle) * distance;
      const lightY = y + Math.sin(angle) * distance * 0.54;
      const radius = width * (0.00038 + random() * 0.0007) * intensity;
      context.fillStyle = random() > 0.72 ? "rgba(255,220,168,.86)" : "rgba(247,183,111,.66)";
      context.beginPath();
      context.arc(lightX, lightY, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createCloudTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas is unavailable for cloud detail.");

  const random = seededRandom(55219);
  for (let band = 0; band < 130; band += 1) {
    const x = random() * width;
    const y = height * (0.12 + random() * 0.76);
    const clusterWidth = width * (0.012 + random() * 0.036);
    const clusterHeight = height * (0.004 + random() * 0.018);
    for (let puff = 0; puff < 9 + random() * 15; puff += 1) {
      const px = x + (random() - 0.5) * clusterWidth * 1.9;
      const py = y + (random() - 0.5) * clusterHeight * 1.8;
      const rx = width * (0.0015 + random() * 0.0038);
      const ry = height * (0.0012 + random() * 0.0031);
      const alpha = 0.025 + random() * 0.055;
      context.fillStyle = "rgba(224,239,246," + alpha + ")";
      context.beginPath();
      context.ellipse(px, py, rx, ry, (random() - 0.5) * 0.6, 0, Math.PI * 2);
      context.fill();
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createEarthTextures(land: LandFeatureCollection, compact: boolean): EarthTextures {
  const width = compact ? 1024 : 2048;
  const height = width / 2;
  const { path, polygonCount } = createLandPath(land, width, height);
  return {
    day: createDayTexture(path, width, height),
    night: createNightTexture(path, width, height),
    clouds: createCloudTexture(compact ? 512 : 1024, compact ? 256 : 512),
    landFeatureCount: polygonCount,
  };
}

function disposeEarthTextures(textures: EarthTextures) {
  textures.day.dispose();
  textures.night.dispose();
  textures.clouds.dispose();
}

function Earth({
  compact,
  animate,
  onTextureReady,
  onRotationFrame,
}: {
  compact: boolean;
  animate: boolean;
  onTextureReady: (featureCount: number) => void;
  onRotationFrame: (rotation: number) => void;
}) {
  const [textures, setTextures] = useState<EarthTextures | null>(null);
  const planet = useRef<Group>(null);
  const cloudLayer = useRef<Group>(null);
  const lastRotationReport = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let created: EarthTextures | null = null;

    async function loadEarth() {
      try {
        const response = await fetch("/earth-land.json", { cache: "force-cache" });
        if (!response.ok) throw new Error("Earth land geometry returned HTTP " + response.status);
        const land = await response.json() as LandFeatureCollection;
        created = createEarthTextures(land, compact);
        if (cancelled) {
          disposeEarthTextures(created);
          return;
        }
        setTextures(created);
        onTextureReady(created.landFeatureCount);
      } catch (error) {
        if (!cancelled) console.error("Earth texture preparation failed:", error);
      }
    }

    void loadEarth();
    return () => {
      cancelled = true;
      if (created) disposeEarthTextures(created);
    };
  }, [compact, onTextureReady]);

  const surfaceMaterial = useMemo(() => {
    if (!textures) return null;
    return new ShaderMaterial({
      uniforms: {
        uDayMap: { value: textures.day },
        uNightMap: { value: textures.night },
        uSunDirection: { value: new Vector3(0.42, 0.34, 0.84).normalize() },
      },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      toneMapped: false,
    });
  }, [textures]);

  const atmosphereMaterial = useMemo(() => new ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    transparent: true,
    side: BackSide,
    blending: AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }), []);

  useEffect(() => () => {
    surfaceMaterial?.dispose();
    atmosphereMaterial.dispose();
  }, [surfaceMaterial, atmosphereMaterial]);

  useFrame((state, delta) => {
    if (!animate) return;
    const safeDelta = Math.min(delta, 0.05);
    if (planet.current) {
      planet.current.rotation.y += safeDelta * (compact ? 0.075 : 0.062);
      planet.current.rotation.x += (state.pointer.y * 0.035 - planet.current.rotation.x) * 0.018;
      if (state.clock.elapsedTime - lastRotationReport.current > 0.45) {
        onRotationFrame(planet.current.rotation.y);
        lastRotationReport.current = state.clock.elapsedTime;
      }
    }
    if (cloudLayer.current) cloudLayer.current.rotation.y += safeDelta * 0.071;
  });

  return (
    <group rotation={[0.035, -0.46, -0.055]}>
      <group ref={planet}>
        <mesh>
          <sphereGeometry args={[1.12, compact ? 56 : 88, compact ? 40 : 64]} />
          {surfaceMaterial ? (
            <primitive object={surfaceMaterial} attach="material" />
          ) : (
            <meshStandardMaterial color="#17435c" roughness={0.8} metalness={0.04} />
          )}
        </mesh>

        {textures && (
          <group ref={cloudLayer}>
            <mesh scale={1.013}>
              <sphereGeometry args={[1.12, compact ? 48 : 72, compact ? 36 : 52]} />
              <meshBasicMaterial map={textures.clouds} transparent opacity={0.34} depthWrite={false} />
            </mesh>
          </group>
        )}

        <mesh scale={1.063}>
          <sphereGeometry args={[1.12, 64, 48]} />
          <primitive object={atmosphereMaterial} attach="material" />
        </mesh>
      </group>

      <mesh rotation={[1.18, 0.18, 0.48]}>
        <torusGeometry args={[1.35, 0.005, 8, 144]} />
        <meshBasicMaterial color="#91b9d0" transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[0.44, -0.74, 1.12]}>
        <torusGeometry args={[1.44, 0.0035, 8, 144]} />
        <meshBasicMaterial color="#e2b487" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function DiscoveryGlobe({ compact = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [textureFeatureCount, setTextureFeatureCount] = useState(0);

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

  const markTextureReady = useCallback((featureCount: number) => {
    setTextureFeatureCount(featureCount);
  }, []);

  const reportRotation = useCallback((rotation: number) => {
    if (root.current) root.current.dataset.earthRotation = rotation.toFixed(3);
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
      // The Three.js globe remains usable if optional scroll-linked motion cannot load.
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [entered, reducedMotion]);

  const earthMotion = visible && !reducedMotion ? "rotating" : "paused";

  return (
    <div
      ref={root}
      className={"discovery-globe" + (compact ? " is-compact" : "")}
      data-discovery-globe
      data-webgl-ready={webglReady ? "ready" : entered ? "pending" : "waiting"}
      data-earth-texture-ready={textureFeatureCount > 0 ? "true" : "false"}
      data-earth-land-polygons={textureFeatureCount}
      data-earth-motion={earthMotion}
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
            setWebglReady(true);
          }}
          fallback={<div className="discovery-globe__fallback" />}
        >
          <Earth
            compact={compact}
            animate={!reducedMotion && visible}
            onTextureReady={markTextureReady}
            onRotationFrame={reportRotation}
          />
        </Canvas>
      ) : (
        <div className="discovery-globe__fallback" />
      )}
    </div>
  );
}
