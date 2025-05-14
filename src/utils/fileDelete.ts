import fs from 'fs';

const deleteFile = (filePath: string): void => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error('Failed to delete file.');
    }
  });
};

export const fileDelete = deleteFile;
