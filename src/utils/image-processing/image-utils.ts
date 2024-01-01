import { useEffect, useState } from "react";
import { CanvasTexture, Texture } from "three";

/** 
 * Represents a point in texture mapping UV coordinate space.
 * The x and y coordinates range from 0 to 1 and 
 * represent a percentage of the corresponding dimension of
 * the texture (width or height).  
 */
type UVPoint = [x: number, y: number];

/** Represents a rectangle in the UV coordinate space.  */
type UVRegion = {
  origin: UVPoint,
  height: number,
  width: number,
};

const INSIDE_WALLS: UVRegion = {
  origin: [0, 0.33],
  height: 0.7,
  width: 0.29,
};

const INSIDE_BOTTOM: UVRegion = {
  origin: [0.3, 0.77],
  height: 0.3,
  width: 0.23,
};

export type UseMugTextureOptions = {
  textureImage?: HTMLImageElement,
  insideColor?: string,
};

export function useMugTexture({textureImage, insideColor}: UseMugTextureOptions) {
  const [texture, setTexture] = useState<Texture>();
  
  useEffect(() => {
    const canvas = createMugTexture(textureImage, insideColor);
    const dataTexture = new CanvasTexture(canvas);
    setTexture(dataTexture);
  }, [textureImage, insideColor]);

  return texture;
}


export function createMugTexture(
  image?: HTMLImageElement,
  insideColor?: string
): HTMLCanvasElement {
  
  const textureH = image?.height ?? 1000;
  const backgroundHeight = textureH * 3;
  const backgroundWidth = textureH * 3;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = backgroundWidth
  canvas.height = backgroundHeight;

  if (ctx) {
    // Transparent layer.
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    //ctx.beginPath();
    ctx.fillRect(0, 0, backgroundWidth, backgroundHeight);
    //ctx.fill();
    ctx.restore();

    // Draw image on top of the transparent layer. 
    // Flip image because of how model's UV coordinates are set up.
    if (image) {
      ctx.save();
      ctx.translate(0.2 * backgroundHeight, textureH);
      ctx.scale(1, -1);

      ctx.drawImage(image, 0, 0);
      ctx.restore();
    }

    // Color the inside of the mug.
    if (insideColor) {
      fillUVRegion(
        ctx,
        backgroundHeight,
        backgroundWidth,
        INSIDE_WALLS,
        insideColor
      );
      fillUVRegion(
        ctx,
        backgroundHeight,
        backgroundWidth,
        INSIDE_BOTTOM,
        insideColor
      );
    }
  }

  return canvas;
}

function fillUVRegion(
  ctx: CanvasRenderingContext2D,
  backgroundHeight: number,
  backgroundWidth: number,
  region: UVRegion,
  fillColor: string): void {

    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.translate(
      backgroundWidth * region.origin[0],
      backgroundHeight * region.origin[1]
    );
    ctx.fillRect(
      0,
      0,
      backgroundWidth * region.width,
      backgroundHeight * region.height
    );
    ctx.restore();
}