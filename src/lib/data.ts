import fs from 'fs';
import path from 'path';

interface Lib {
  baseDir: string;
  create: Function;
  read: Function;
  update: Function;
  delete: Function;
}

const lib: Lib = {
  baseDir: path.join(__dirname, '/../.data/'),
  create: (
    dir: string,
    file: string,
    data: string | object,
    callback: Function,
  ): void => {
    fs.open(
      `${lib.baseDir}${dir}/${file}.json`,
      'wx',
      (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, error => {
            if (!error) {
              fs.close(fileDescriptor, error => {
                if (!error) {
                  callback(false);
                } else {
                  callback('Error closing new file');
                }
              });
            } else {
              callback('Error writing to new faile');
            }
          });
        } else {
          callback('Could not create new file, it may ready exist');
        }
      },
    );
  },
  read: (dir: string, file: string, callback: Function) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
      callback(err, data);
    });
  },
  update: (dir: string, file: string, data: string, callback: Function) => {
    fs.open(
      `${lib.baseDir}${dir}/${file}.json`,
      'r+',
      (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
          const stringData = JSON.stringify(data);
          fs.ftruncate(fileDescriptor, err => {
            if (!err) {
              fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                  fs.close(fileDescriptor, err => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback('Error closing the file');
                    }
                  });
                } else {
                  callback('Error writing to existing file');
                }
              });
            } else {
              callback('Error truncate file');
            }
          });
        } else {
          callback(
            'Could not open the file for updating, it may not exist yet',
          );
        }
      },
    );
  },
  delete: (dir: string, file: string, callback: Function) => {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, err => {
      if (!err) {
        callback(false);
      } else {
        callback('Error deleting file');
      }
    });
  },
};

export default lib;
