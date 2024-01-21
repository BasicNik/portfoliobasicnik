"use client"

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Wireframe } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";


export default function Shapes(){
    return (
        <div className="row-span-1 row-start-1 -mt-9 aspect-square
        md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas 
            className="z-0" 
            shadows 
            gl={{antialias:false}} 
            dpr={[1, 1.5]} 
            camera={{position: [0,0,25], fov:30, near:1, far:40}}>
                <Suspense fallback={null}>
                    <Geometries/>
                    <ContactShadows
                    resolution={256}
                    position={[0,-3.5,0]}
                    opacity={0.65}
                    scale={30}
                    blur={0.8}
                    far={4}/>
                    <Environment preset="studio" />
                </Suspense>
            </Canvas>
        </div>
    );
}

function Geometries(){
    const geometries = [
        {
            position: [0,0,0],
            r: 0.6,
            geometry: new THREE.TorusKnotGeometry( 2, 0.3, 200, 13), // The Gem one
        },
        {
            position: [1, -0.75, 4],
            r: 0.4,
            geometry: new THREE.CapsuleGeometry(0.5,2.6, 22, 16), // Pill
          },
          {
            position: [-1.4, 2, -4],
            r: 0.6,
            geometry: new THREE.IcosahedronGeometry(1), // Soccer ball
          },
          {
            position: [-0.8, -0.75, 5],
            r: 0.5,
            geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32), // Donut
          },
          {
            position: [1.6, 1.6, -4],
            r: 0.7,
            geometry: new THREE.OctahedronGeometry(1.5), // Diamond
          },
    ];

    const soundEffects = [
        // new Audio("/sounds/hedron.ogg"),
        // new Audio("/sounds/Rope.ogg"),
        new Audio("/sounds/lf1.ogg"),
        new Audio("/sounds/lf2.ogg"),
        new Audio("/sounds/lf3.ogg"),
      ];

      
    const materials = [
        new THREE.MeshNormalMaterial({roughness: 0}),
        new THREE.MeshStandardMaterial({ color: 0x2ecc71, metalness: 0.2,roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.4,roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0xe74c3c, metalness: 0.6,roughness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: 0x8e44ad, metalness: 0.8,roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0x1abc9c, metalness: 1,roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0x34495e, metalness: 0.3,roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xf39c12, metalness: 0.5,roughness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: 0x1abc9c, metalness: 0.7,roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xDBE2E9, metalness: 1,roughness: 0 }),
        new THREE.MeshStandardMaterial({ color: 0x2f3542, metalness: 0.55,roughness: 0.5 }),
        new THREE.MeshStandardMaterial({
            roughness: 0.5,
            metalness: 1,
            color: 0x2980b9,
          }),
          new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.5,
            metalness: 1,
          }),
    ]
 
    return geometries.map(({position, r, geometry})=>(
        <Geometry
            key={JSON.stringify(position)}
            position={position.map((p)=>p*2)}
            geometry={geometry}
            soundEffects={soundEffects}
            materials={materials}
            r={r}
            />
    ));
    //pass to geometry
}


function Geometry({r, position, geometry, soundEffects, materials}){
    const meshRef = useRef();
    const [visible, setVisible] = useState(false);

    const startingMaterial = getRandomMaterial();
    
    
    function getRandomMaterial(){
        return gsap.utils.random(materials);
    }

    
    function handleClick(e) {
        const mesh = e.object;
    
        gsap.utils.random(soundEffects).play();
    
        gsap.to(mesh.rotation, {
          x: `+=${gsap.utils.random(0, 2)}`,
          y: `+=${gsap.utils.random(0, 2)}`,
          z: `+=${gsap.utils.random(0, 2)}`,
          duration: 1.5,
          ease: "elastic.out(1,0.3)",
          //yoyo: true,
        });
    
        mesh.material = getRandomMaterial();
    }

    const handlePointerOver = ()=>{
        console.log('Pointer is over the mesh!');
        mesh.cursor = "pointer";
    }

    const handlePointerOut = ()=>{
        mesh.cursor = "default";
    }

    useEffect(() => {
        let ctx = gsap.context(() => {
          setVisible(true);
          gsap.from(meshRef.current.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: gsap.utils.random(0.8, 1.2),
            ease: "elastic.out(1,0.3)",
            delay: gsap.utils.random(0, 0.5),
          });
        });
        return () => ctx.revert();
      }, []);

    return (
        <group position={position} ref={meshRef}>
            <Float speed={8 * r} rotationIntensity={10 * r} floatIntensity={10 * r}>
                <mesh 
                geometry={geometry}
                onMouseOver={handlePointerOver}
                onMouseOut={handlePointerOut}
                onClick={handleClick}
                visible={visible}
                material={startingMaterial}
                ></mesh>

            </Float>
        </group>
    );
}