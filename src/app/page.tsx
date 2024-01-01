'use client';

import styles from './page.module.css'
import ImageInput from '@/components/file-input/image-input';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const MugScene = dynamic(() => import('@/three/mug-scene'), {
  ssr: false,
});

export default function Home() {

  const [image, setImage] = useState<HTMLImageElement>();

  return (
    <Suspense>
      <main className={styles.main}>
        <div className={styles.canvasContainer}>
          <MugScene textureImage={image} />
        </div>

        <div>
          <ImageInput onImageUploaded={setImage} />
        </div>
      </main>
    </Suspense>
  )
}
