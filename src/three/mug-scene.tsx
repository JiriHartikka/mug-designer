'use client';

import useMugTexture from '@/utils/image-processing/use-mug-texture';
import { OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export type MugSceneProps = {
  textureImage?: HTMLImageElement,
  insideColor?: string,
  handleColor?: string,
};

export default function MugScene(props: MugSceneProps) {
  const gltf = useLoader(GLTFLoader, '/assets/models/zipinkent-cambridge-mug.glb');

  const { 
    insideColor, 
    handleColor,
    textureImage, 
  } = props;

  return (
    <Canvas camera={{ position: [-2.5, 13, 15] }} shadows>
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
        model={gltf}
        textureImage={textureImage} 
        insideColor={insideColor}
        handleColor={handleColor} 
      />
      <OrbitControls target={[0, 1, 0]} />
    </Canvas>
  )  
}

type MugProps = {
  textureImage?: HTMLImageElement,
  insideColor?: string,
  handleColor?: string,
  /** 3D model to use for the mug */
  model: { scene: any },
}

function Mug(props: MugProps) {
  const { 
    model: { scene }, 
    textureImage,
    insideColor, 
    handleColor,
  } = props;

  const texture = useMugTexture({ textureImage, insideColor, handleColor });

  if (texture && scene) {
    texture.flipY = true;
    scene.children[0].material.map = texture;
  }

  return (
    <primitive
      object={scene}
      position={[0, 1, 0]}
      children-0-castShadow
    />
  );
}






