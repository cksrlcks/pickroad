import { Vibrant } from "node-vibrant/browser";

export function getColorByString(value: string, colorArray: readonly string[]) {
  const charCode = value.toLowerCase().charCodeAt(0);
  const index = charCode % colorArray.length;
  return colorArray[index];
}

export async function getImagePalette(imageUrl: string) {
  const palette = await Vibrant.from(imageUrl).getPalette();

  const vibrant_palette = [
    palette.Vibrant?.hex || "#000",
    palette.Vibrant?.bodyTextColor || "#fff",
    palette.DarkVibrant?.hex || "#000",
    palette.DarkVibrant?.bodyTextColor || "#fff",
    palette.LightVibrant?.hex || "#fff",
    palette.LightVibrant?.bodyTextColor || "#000",
  ];

  const muted_palette = [
    palette.Muted?.hex || "#000",
    palette.Muted?.bodyTextColor || "#fff",
    palette.DarkMuted?.hex || "#000",
    palette.DarkMuted?.bodyTextColor || "#fff",
    palette.LightMuted?.hex || "#fff",
    palette.LightMuted?.bodyTextColor || "#000",
  ];

  return {
    vibrant_palette,
    muted_palette,
  };
}
