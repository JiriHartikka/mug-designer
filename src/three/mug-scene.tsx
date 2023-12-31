'use client';

import { useMugTexture } from '@/utils/image-processing/image-utils';
import { OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export type MugSceneProps = {
  textureImage?: HTMLImageElement
};

export default function MugScene(props: MugSceneProps) {
  const gltf = useLoader(GLTFLoader, '/assets/models/zipinkent-cambridge-mug.glb');

  return (
    <Canvas camera={{ position: [-2.5, 13, 15] }} shadows>
      <directionalLight
        position={[3.3, 1.0, 4.4]}
        castShadow
        intensity={Math.PI * 2}
      />
      <ambientLight intensity={0.75} ></ambientLight>
      <Mug model={gltf} textureImage={props.textureImage} />
      <OrbitControls target={[0, 1, 0]} />
    </Canvas>
  )  
}

type MugProps = {
  textureImage?: HTMLImageElement,
  /** 3D model to use for the mug */
  model: { scene: any },
}

function Mug(props: MugProps) {

  const { model: { scene }, textureImage } = props;

  const texture = useMugTexture(textureImage);

  if (texture && scene) {
    console.log(scene);

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






