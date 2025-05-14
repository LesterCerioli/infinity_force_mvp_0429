import Jimp from "jimp";
import path from "path";

interface ImageResizeParams {
  filename: string;
  width: number;
  inputPath: string;
  outputPath: string;
  outputFolder: string;
}

export const resizeImage = async ({
  filename,
  width,
  inputPath,
  outputPath,
  outputFolder,
}: ImageResizeParams): Promise<string> => {
  try {
    const image = await Jimp.read(inputPath);
    image.resize(width, Jimp.AUTO).write(path.resolve(outputPath, outputFolder, filename));
    return `${outputFolder}/${filename}`;
  } catch (error) {
    console.error("Error at reducing size / converting picture:", error);
    throw error; // rethrow the error to be handled elsewhere if needed
  }
};
