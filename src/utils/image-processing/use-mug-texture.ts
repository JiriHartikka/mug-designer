import { TextureControls } from "@/components/texture-controls/texture-controls";
import { useEffect, useState } from "react";
import { CanvasTexture, } from "three";

type MugRenderingContext = {
  canvasContext: CanvasRenderingContext2D,
  texture: CanvasTexture,
  image?: HTMLImageElement,
  height: number,
  width: number,
};

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

const WALL: UVRegion = {
  origin: [0.725, 0.315],
  height: 0.685, 
  width: 0.256,
}; 

const INSIDE_WALLS: UVRegion = {
  origin: [0.48, 0.017],
  height: 0.67,
  width: 0.2458,
};

const INSIDE_BOTTOM: UVRegion = {
  origin: [0.269, 0.246],
  height: 0.2,
  width: 0.2,
};

const HANDLE1: UVRegion = {
  origin: [0.02, 0.68326],
  height: 0.096,
  width: 0.162,
};

const HANDLE2: UVRegion = {
  origin: [0.308, 0.0305],
  height: 0.1,
  width: 0.16,
}

export type UseMugTextureOptions = {
  textureImage?: HTMLImageElement,
  textureControls?: TextureControls,
  insideColor?: string,
  handleColor?: string,
  onNeedsUpdate?: (texture: CanvasTexture) => void,
};

export default function useMugTexture({
  textureImage,
  textureControls,
  insideColor,
  handleColor,
}: UseMugTextureOptions): CanvasTexture | undefined {
  const [renderingContext, setRenderingContext] = useState<MugRenderingContext>();
  
  useEffect(() => {
    const renderingContext = createMugTexture(textureImage);
    setRenderingContext(renderingContext);
  }, [textureImage]);

  useEffect(() => {
    if (renderingContext) {
      drawTexture(renderingContext, textureControls, insideColor, handleColor);
      renderingContext.texture.needsUpdate = true;
    }
  }, [renderingContext, textureImage, textureControls, handleColor, insideColor]);

  return renderingContext?.texture;
}

export function createMugTexture(
  image?: HTMLImageElement,
): MugRenderingContext | undefined {
  
  const textureH = image?.height ?? 1000;
  const backgroundHeight = textureH * 3;
  const backgroundWidth = textureH * 3;

  const canvas = document.createElement('canvas');
  canvas.width = backgroundWidth
  canvas.height = backgroundHeight;
  const texture = new CanvasTexture(canvas);
  const ctx = canvas.getContext('2d');

  return ctx ? 
    {
      canvasContext: ctx,
      texture: texture,
      image,
      width: canvas.width,
      height: canvas.height,
    }
    : undefined;
}

function drawTexture(
  renderingContext: MugRenderingContext,
  textureControls?: TextureControls,
  insideColor?: string,
  handleColor?: string,
): void {
  const { image } = renderingContext;

  fillBackgroundTransparent(renderingContext);
  
  if (image){
    drawTextureImage(renderingContext, image, textureControls?.selectedPosition ?? [0, 0]);
  }

  if (insideColor) {
    fillUVRegions(renderingContext, [INSIDE_WALLS, INSIDE_BOTTOM], insideColor);
  }

  if (handleColor) {
    fillUVRegions(renderingContext, [HANDLE1, HANDLE2], handleColor);
  }
}

function fillBackgroundTransparent(mugRenderingContext: MugRenderingContext): void {
  const region: UVRegion = {
    origin: [0, 0],
    width: 1,
    height: 1,
  };

  const fillStyle = "rgba(255, 255, 255, 1.0)";

  fillUVRegion(mugRenderingContext, region, fillStyle);
}

function drawTextureImage(
  mugRenderingContext: MugRenderingContext,
  image: HTMLImageElement,
  selectedPosition: [x: number, y: number],
): void {

  const { canvasContext: ctx, width, height} = mugRenderingContext;

  ctx.save();

  const region = WALL;

  const offsetX = region.origin[0] * width
  const offsetY = region.origin[1] * height + 
    region.height * (1 - selectedPosition[0]) * height  

  ctx.translate(offsetX, offsetY);

  ctx.rotate(-Math.PI/2);
  
  // Magic number for scaling the texture after flipping.
  const scale =  0.77;
  ctx.drawImage(image, 0, 0, scale * image.width, scale * image.height);
  ctx.restore();
  
}

function fillUVRegions(
  renderingContext: MugRenderingContext,
  regions: UVRegion[],
  fillColor: string
): void {
  regions.forEach(region => fillUVRegion(renderingContext, region, fillColor));
}

function fillUVRegion(
  renderingContext: MugRenderingContext,
  region: UVRegion,
  fillColor: string): void {

    const { canvasContext: ctx, width, height } = renderingContext;

    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.translate(
      width * region.origin[0],
      height * region.origin[1]
    );
    ctx.fillRect(
      0,
      0,
      width * region.width,
      height * region.height
    );
    ctx.restore();
}