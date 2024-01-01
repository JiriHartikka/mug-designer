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

const HANDLE1: UVRegion = {
  origin: [0.78, 0.6],
  height: 0.4,
  width: 0.32,
};

const HANDLE2: UVRegion = {
  origin: [0.55, 0.4],
  height: 0.2,
  width: 0.5,
}

export type UseMugTextureOptions = {
  textureImage?: HTMLImageElement,
  insideColor?: string,
  handleColor?: string,
};

export default function useMugTexture({
  textureImage,
  insideColor,
  handleColor,
}: UseMugTextureOptions) {
  const [texture, setTexture] = useState<Texture>();
  
  useEffect(() => {
    const canvas = createMugTexture(textureImage, insideColor, handleColor);
    const dataTexture = new CanvasTexture(canvas);
    setTexture(dataTexture);
  }, [textureImage, insideColor, handleColor]);

  return texture;
}


export function createMugTexture(
  image?: HTMLImageElement,
  insideColor?: string,
  handleColor?: string,
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
    fillBackgroundTransparent(ctx, backgroundHeight, backgroundWidth);

    // Draw image on top of the transparent layer. 
    // Flip image because of how model's UV coordinates are set up.
    if (image) {
      drawTextureImage(ctx, image, backgroundHeight, backgroundWidth);
    }

    // Color the inside of the mug.
    if (insideColor) {
      const regions = [INSIDE_WALLS, INSIDE_BOTTOM];

      regions.forEach((region) => 
        fillUVRegion(
          ctx,
          backgroundHeight,
          backgroundWidth,
          region,
          insideColor
        )
      );
    }

    // Color the handle of the mug
    if (handleColor) {
      const regions = [HANDLE1, HANDLE2];

      regions.forEach((region) => 
        fillUVRegion(
          ctx,
          backgroundHeight,
          backgroundWidth,
          region,
          handleColor
        )
      );
    }
  }

  return canvas;
}

function fillBackgroundTransparent(
  ctx: CanvasRenderingContext2D,
  backgroundHeight: number,
  backgroundWidth: number,
): void {
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
  ctx.fillRect(0, 0, backgroundWidth, backgroundHeight);
  ctx.restore();
}

function drawTextureImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  backgroundHeight: number,
  backgroundWidth: number,
): void {
  const height = image.height;

  ctx.save();
  ctx.translate(0.2 * backgroundHeight, height);
  ctx.scale(1, -1);

  ctx.drawImage(image, 0, 0);
  ctx.restore();
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