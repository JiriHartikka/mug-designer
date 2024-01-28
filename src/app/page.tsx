'use client';

import ColorSelect, { ColorOption } from '@/components/color-select/color-select';
import styles from './page.module.css'
import ImageInput from '@/components/file-input/image-input';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import TextureControlsForm, { TextureControls } from '@/components/texture-controls/texture-controls';

const MugScene = dynamic(() => import('@/three/mug-scene'), {
  ssr: false,
});

export default function Home() {
  const [image, setImage] = useState<HTMLImageElement>();
  const [insideColor, setInsideColor] = useState<ColorOption>();
  const [handleColor, setHandleColor] = useState<ColorOption>();
  const [textureControls, setTextureControls] = useState<TextureControls>();

  const extractOptionValue = (option: ColorOption | undefined) => {
    const value = option?.value;
    return value !== '' ? value : undefined;
  };

  return (
    <Suspense>
      <main className={styles.main}>
        <h1>Mug designer</h1>
        <div className={styles.canvasContainer}>
          <MugScene 
            textureImage={image}
            textureControls={textureControls}
            insideColor={extractOptionValue(insideColor)}
            handleColor={extractOptionValue(handleColor)}
          />
        </div>

        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label htmlFor="texture-input">Choose an image to texture the mug with</label>
            <ImageInput id="texture-input" onImageUploaded={setImage} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='select-color'>Select a color for the inside and the handle of the mug</label>
            <ColorSelect id="select-color" onSelected={color => { setInsideColor(color); setHandleColor(color) }}></ColorSelect>
          </div>

          <div className={styles.textureControls}>
            <label>Click to change the position of the texture on the mug</label>
            <TextureControlsForm 
              aspectRatio={3}
              textureImage={image}
              onControlsChanged={setTextureControls} 
            />
          </div>

        </div>  

      </main>
    </Suspense>
  )
}
