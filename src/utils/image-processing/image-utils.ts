import { useEffect, useState } from "react";
import { CanvasTexture, Texture } from "three";

export function useMugTexture(textureImage?: HTMLImageElement) {
  const [texture, setTexture] = useState<Texture>();
  
  useEffect(() => {
    if (!textureImage) {
      return;
    }

    const canvas = createMugTexture(textureImage);
    const dataTexture = new CanvasTexture(canvas);
    setTexture(dataTexture);
  }, [textureImage]);

  return texture;
}


export function createMugTexture(image: HTMLImageElement): HTMLCanvasElement {
  const { 
    height: textureH,
    width: textureW 
  } = image;

  const backgroundHeight = textureH * 3;
  const backgroundWidth = textureH * 3;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = backgroundWidth
  canvas.height = backgroundHeight;

  if (ctx) {
    // Transparent layer.
    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    ctx.beginPath();
    ctx.fillRect(0, 0, backgroundWidth, backgroundHeight);
    ctx.fill();

    // Draw image on top of the transparent layer. 
    // Flip image because of how model's UV coordinates are set up.
    ctx.save();
    ctx.translate(0.2 * backgroundHeight, textureH);
    ctx.scale(1, -1);

    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }

  return canvas;
}