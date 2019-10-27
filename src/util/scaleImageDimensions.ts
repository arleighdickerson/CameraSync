type ScaleOptions = {
    width: number
    height: number,
    maxWidth?: number,
    maxHeight?: number,
}

export function scaleImageDimensions(opts: ScaleOptions) {
  let { width, height, maxWidth = undefined, maxHeight = undefined } = opts;
  let newWidth = width;
  let newHeight = height;

  if (maxWidth && width > maxWidth) {
    const ratio = maxWidth / width;
    newWidth = maxWidth;
    newHeight = height * ratio;
    height = height * ratio;
    width = width * ratio;
  }

  if (maxHeight && height > maxHeight) {
    const ratio = maxHeight / height;
    newHeight = maxHeight;
    newWidth = width * ratio;
    // width = width * ratio;
    // height = height * ratio;
  }

  return { width: newWidth, height: newHeight };
}
