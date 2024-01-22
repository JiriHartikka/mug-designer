import { TextureControls } from "@/components/texture-controls/texture-controls";
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

function rotate(region: UVRegion): UVRegion {
  return {
    origin: [1 - region.origin[0], 1 - region.origin[1]],
    height: region.width,
    width: region.height,
  }
}

/*const WALL: UVRegion = {
  origin: [0.15, 0],
  height: 0.3,
  width: 0.7,
};*/

const WALL: UVRegion = {
  origin: [0.725, 0.315],
  height: 0.685, 
  width: 0.256,
}; 

const TEST: 
UVRegion = {
  origin: [0, 0],
  height: 1, 
  width: 0.5,
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
  textureControls?: TextureControls,
  insideColor?: string,
  handleColor?: string,
};

export default function useMugTexture({
  textureImage,
  textureControls,
  insideColor,
  handleColor,
}: UseMugTextureOptions) {
  const [texture, setTexture] = useState<Texture>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  
  useEffect(() => {
    const canvas = createMugTexture(textureImage, textureControls, insideColor, handleColor);
    const dataTexture = new CanvasTexture(canvas);
    setTexture(dataTexture);
    setCanvas(canvas);
  }, [textureImage, insideColor, handleColor]);

  useEffect(() => {
    const textureH = textureImage?.height ?? 1000;
    const backgroundHeight = textureH * 3;
    const backgroundWidth = textureH * 3;
    const ctx = canvas?.getContext('2d');

    if (ctx && textureImage && textureControls?.selectedPosition) {
      console.log("drawing");
      drawTexture(
        ctx,
        textureImage,
        backgroundHeight,
        backgroundWidth,
        textureControls?.selectedPosition
      );
      if (texture) {
        console.log("needs update...");
        texture.needsUpdate = true;
      }
    }
  }, [canvas, textureImage, textureControls]);

  return texture;
}

export function createMugTexture(
  image?: HTMLImageElement,
  textureControls?: TextureControls,
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
      drawTextureImage(ctx, image, backgroundHeight, backgroundWidth, textureControls?.selectedPosition ?? [0, 0]);
    }

    /*fillUVRegion(
      ctx,
      backgroundHeight,
      backgroundWidth,
      WALL,
      "green",
    )*/

    /*fillUVRegion(
      ctx,
      backgroundHeight,
      backgroundWidth,
      TEST,
      "magenta",
    )*/

    // Color the inside of the mug.
    /*if (insideColor) {
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
    }*/

    // Color the handle of the mug
    /*if (handleColor) {
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
    }*/
  }

  return canvas;
}

function drawTexture(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  backgroundHeight: number,
  backgroundWidth: number,
  selectedPosition: [x: number, y: number],
): void {

  fillBackgroundTransparent(ctx, backgroundHeight, backgroundWidth);
  drawTextureImage(ctx, image, backgroundHeight, backgroundWidth, selectedPosition);
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
  selectedPosition: [x: number, y: number],
): void {

  console.log("texture position: ", selectedPosition)

  ctx.save();

  const region = WALL;

  ctx.translate(
    region.origin[0] * backgroundWidth,
    
    region.origin[1] * backgroundHeight + region.height * (1 - selectedPosition[0]) * backgroundHeight,
  );

  ctx.rotate(-Math.PI/2);
  
  // Magic number for scaling the texture after flipping.
  const scale =  0.77;
  ctx.drawImage(image, 0, 0, scale * image.width, scale * image.height);
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