'use client';

import styles from './page.module.css'
import MugScene from '@/three/mug-scene';
import ImageInput from '@/components/file-input/image-input';
import { useState } from 'react';

export default function Home() {

  const [image, setImage] = useState<HTMLImageElement>();

  return (
    <main className={styles.main}>
      <div className={styles.canvasContainer}>
        <MugScene textureImage={image} />
      </div>

      <div>
        <ImageInput onImageUploaded={setImage} />
      </div>
    </main>
  )
}
