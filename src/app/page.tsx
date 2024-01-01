'use client';

import ColorSelect, { ColorOption } from '@/components/color-select/color-select';
import styles from './page.module.css'
import ImageInput from '@/components/file-input/image-input';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const MugScene = dynamic(() => import('@/three/mug-scene'), {
  ssr: false,
});

export default function Home() {
  const [image, setImage] = useState<HTMLImageElement>();
  const [insideColor, setInsideColor] = useState<ColorOption>();
  const [handleColor, setHandleColor] = useState<ColorOption>();

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
            <label htmlFor='select-inside-color'>Select color for the inside of the mug</label>
            <ColorSelect id="select-inside-color" onSelected={setInsideColor}></ColorSelect>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='select-handle-color'>Select color for the handle of the mug</label>
            <ColorSelect id="select-handle-color" onSelected={setHandleColor}></ColorSelect>
          </div>
        </div>  

      </main>
    </Suspense>
  )
}
