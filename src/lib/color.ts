export function getColorByString(value: string, colorArray: readonly string[]) {
  const charCode = value.toLowerCase().charCodeAt(0);
  const index = charCode % colorArray.length;
  return colorArray[index];
}
