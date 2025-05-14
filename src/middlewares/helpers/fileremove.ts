import * as fs from 'fs';

export const deleteFiles = (files: string[]): Promise<void[]> => {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<void>((res, rej) => {
          try {
            setTimeout(() => {
              fs.unlink(file, (err) => {
                if (err) {
                  return rej(err);
                }
                res();
              });
            }, 10000);
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
};
