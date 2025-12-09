"use client";

import { useState, useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

export interface ChessModelProps {
    modelPath: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    scrollX?: number;
    shouldRotate?: boolean;
    centerPivot?: boolean;
    color?: string | number;
}

export function ChessModel({
    modelPath,
    position,
    rotation = [0, 0, 0],
    scale = 0.5,
    scrollX = 0,
    shouldRotate = false,
    centerPivot = false,
    color = 0x888888
}: ChessModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const obj = useLoader(OBJLoader, modelPath);
    const [idleRotation, setIdleRotation] = useState(0);

    // Clone and prepare the object once
    const clonedObj = useMemo(() => {
        const clone = obj.clone();

        // Calculate bounding box to find center
        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const min = box.min;

        // Offset the mesh based on pivot mode
        if (centerPivot) {
            // Center at geometric center for horizontal rotation
            clone.position.set(-center.x, -center.y, -center.z);
        } else {
            // Center at bottom for standing pieces
            clone.position.set(-center.x, -min.y, -center.z);
        }

        // Apply material to all meshes
        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: 0.3,
                    roughness: 0.4,
                    side: THREE.DoubleSide,
                });
            }
        });

        return clone;
    }, [obj, centerPivot]);

    // Animation frame - rotate the GROUP, not the mesh
    useFrame((state) => {
        if (groupRef.current) {
            // Subtle idle animation - floating
            const time = state.clock.getElapsedTime();
            groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;

            if (shouldRotate) {
                // Idle rotation
                setIdleRotation((prev) => prev + 0.005);

                // Scroll-based rotation
                const scrollRotation = scrollX * 0.01;

                // Rotate around LOCAL Y-axis (horizontal spin)
                groupRef.current.rotation.y = idleRotation + scrollRotation;
            }
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={new THREE.Euler(...rotation)}>
            {/* Wrapper group for orientation correction (standing up) */}
            <group rotation={[-Math.PI / 2, 0, 0]}>
                <primitive object={clonedObj} scale={scale} />
            </group>
        </group>
    );
}
