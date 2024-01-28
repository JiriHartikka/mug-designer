'use client';

import useMugTexture from '@/utils/image-processing/use-mug-texture';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { TextureControls } from '@/components/texture-controls/texture-controls';
import { Group, Mesh, MeshPhongMaterial, Object3D } from 'three';
import { MutableRefObject, useEffect, useRef } from 'react';

export type MugSceneProps = {
  textureImage?: HTMLImageElement,
  textureControls?: TextureControls,
  insideColor?: string,
  handleColor?: string,
};

export default function MugScene(props: MugSceneProps) {
  const path = window.location.pathname;
  const model = useLoader(
    OBJLoader,
    `${path}assets/models/mug.obj`, 
  );

  const { 
    insideColor, 
    handleColor,
    textureImage, 
    textureControls,
  } = props;

  return (
    <Canvas camera={{ position: [100, 200, 150] }} shadows>
      <directionalLight
        position={[3.3, 1.0, 4.4]}
        castShadow
        intensity={Math.PI * 2}
      />
      <pointLight
        position={[-3.0, 30, 1.5]}
        castShadow
        intensity={Math.PI * 300}
      />
      <pointLight
        position={[-15.0, 1.0, 1.5]}
        castShadow
        intensity={Math.PI * 200}
      />
      <pointLight
        position={[2.0, 1.0, -15]}
        castShadow
        intensity={Math.PI * 200}
      />
      <ambientLight intensity={0.75} ></ambientLight>
      <Mug 
        model={model}
        textureImage={textureImage}
        textureControls={textureControls} 
        insideColor={insideColor}
        handleColor={handleColor} 
      />
      <OrbitControls target={[0, 0, 0]} />
    </Canvas>
  )  
}

type MugProps = {
  textureImage?: HTMLImageElement,
  textureControls?: TextureControls,
  insideColor?: string,
  handleColor?: string,
  /** 3D model to use for the mug */
  model: Object3D /*{ scene: any }*/,
}

function Mug(props: MugProps) {
  const { 
    model, 
    textureImage,
    textureControls,
    insideColor, 
    handleColor,
  } = props;

  const ref: MutableRefObject<Group | undefined> = useRef();
  const material = (ref.current?.children[0] as Mesh | undefined)?.material as MeshPhongMaterial | undefined;

  const texture = useMugTexture({ 
    textureImage,
    textureControls,
    insideColor,
    handleColor,
  });

  useEffect(() => {
    if (material && texture) {
      material.map = texture;
      material.map.needsUpdate = true;
      material.toneMapped = false;
    }
  }, [material, texture]);

  return <primitive ref={ref} object={model}></primitive>
}






