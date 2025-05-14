import path from 'path';
import multer, { StorageEngine, Multer, FileFilterCallback } from 'multer';

interface RequestWithUser extends Express.Request {
  user?: { _id: string };
  profile?: { _id: string };
  admin?: { _id: string; role: string };
}


const storageByUser: StorageEngine = multer.diskStorage({
  destination: (req: RequestWithUser, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
    cb(null, './public/uploads');
  },
  filename: (req: RequestWithUser, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
    cb(null, `${file.fieldname}-${req.user?._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});


const storage: StorageEngine = multer.diskStorage({
  destination: (req: RequestWithUser, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
    cb(null, './public/uploads');
  },
  filename: (req: RequestWithUser, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
    cb(null, `${file.fieldname}-${req.profile?._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});


const storageBySuperAdmin: StorageEngine = multer.diskStorage({
  destination: (req: RequestWithUser, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
    cb(null, './public/uploads');
  },
  filename: (req: RequestWithUser, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
    cb(null, `${file.fieldname}-${req.admin?.role}${req.admin?._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});


const fileFilter: multer.Options['fileFilter'] = (req: RequestWithUser, file: Express.Multer.File, callback: FileFilterCallback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
    return callback(new Error('Not Image'));
  }
  callback(null, true);
};


const limits = { fileSize: 2480 * 3230 };


export const uploadAdminDoc = multer({ storage, fileFilter, limits }).single('doc');
export const uploadAdminPhoto = multer({ storage, fileFilter, limits }).single('photo');
export const uploadUserPhoto = multer({ storage: storageByUser, fileFilter, limits }).single('photo');
export const uploadProductImages = multer({ storage, fileFilter, limits }).array('productImages', 5);
export const uploadBannerPhoto = multer({ storage: storageBySuperAdmin, fileFilter, limits: { fileSize: 8480 * 4230 } }).single('bannerPhoto');
