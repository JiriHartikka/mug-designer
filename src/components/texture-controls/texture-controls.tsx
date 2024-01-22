import { MouseEvent, useEffect, useRef, useState } from "react";
import styles from './texture-controls.module.css';

export type TextureControls = {
  /** Relative selected position as percentages of width and height */
  selectedPosition: [x: number, y: number],
};

export type TextureControlsProps = {
  onControlsChanged?: (controls: TextureControls) => void;
  aspectRatio: number;
  textureImage?: HTMLImageElement,
};

export default function TextureControlsForm(props: TextureControlsProps) {
  const { aspectRatio, textureImage, onControlsChanged } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPosition, setSelectedPosition] = useState<[x: number, y: number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawCanvas(canvas);
    }
  }, [aspectRatio, textureImage, canvasRef, selectedPosition]);

  const drawCanvas = (canvas: HTMLCanvasElement) => {
    if (!textureImage) {
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const [posX, posY] = selectedPosition;

    const scale = canvas.height / textureImage.height;
    ctx?.drawImage(
      textureImage,
      posX * canvas.width,
      posY * canvas.height,
      textureImage.width * scale,
      textureImage.height * scale
    );
  };

  const handleClick = ({ clientX, clientY, target }: MouseEvent<HTMLCanvasElement, any>) => {
    //const rect = canvasRef.current?.getBoundingClientRect();
    const rect = (target as HTMLCanvasElement).getBoundingClientRect();
    
    if (!rect) {
      return;
    }

    const { left, top, right, bottom } = rect; 

    const relX = (clientX - left) / (right - left) ;
    const relY = (clientY - top) / (bottom - top);

    setSelectedPosition([relX, relY]);
    emitControlChangeEvent();
  };

  const emitControlChangeEvent = () => {
    if (onControlsChanged) {
      console.log("emitting", selectedPosition);

      const event: TextureControls = {
        selectedPosition,
      }
      onControlsChanged(event);
    }
  };
  
  return (
    <div style={{ aspectRatio: aspectRatio }}>
      <canvas 
        ref={canvasRef}
        className={styles.controlCanvas}
        onClick={ handleClick }
        >
      </canvas>
    </div>
  );
} 