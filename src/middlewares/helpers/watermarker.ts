import Jimp from 'jimp';
import { Request, Response, NextFunction } from 'express';

interface File {
  path: string;
}

interface RequestWithFiles extends Request {
  files: File[];
}

const applyWatermark = async (req: RequestWithFiles, res: Response, next: NextFunction) => {
  if (!req.files.length) {
    return next();
  }

  const options = {
    ratio: 0.6,
    opacity: 0.4,
    text: 'K I N D E E M',
    textSize: Jimp.FONT_SANS_64_BLACK,
  };

  const getDimensions = (H: number, W: number, h: number, w: number, ratio: number): [number, number] => {
    let hh: number, ww: number;
    if (H / W < h / w) {  // Greater Height
      hh = ratio * H;
      ww = (hh / h) * w;
    } else {  // Greater Width
      ww = ratio * W;
      hh = (ww / w) * h;
    }
    return [hh, ww];
  };

  const results = req.files.map(async (file) => {
    const watermark = await Jimp.read('./public/uploads/logo.png');
    const imagePath = file.path;

    const main = await Jimp.read(imagePath);
    const [newHeight, newWidth] = getDimensions(main.getHeight(), main.getWidth(), watermark.getHeight(), watermark.getWidth(), options.ratio);

    watermark.resize(newWidth, newHeight);
    const positionX = ((main.getWidth() - newWidth) / 2) + 250;
    const positionY = ((main.getHeight() - newHeight) / 2) + 200;

    watermark.opacity(options.opacity);
    main.composite(watermark, positionX, positionY, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

    return main.quality(100).write(imagePath);
  });

  await Promise.all(results);
  next();
};

export default applyWatermark;
