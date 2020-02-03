const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const limitSize = 1048576;

  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exist');
        return;
      }

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Internal server error');
        return;
      }

      const writeStream = fs.createWriteStream(filepath, {flags: 'wx+'});
      const transformStream = new LimitSizeStream({limit: limitSize});

      writeStream.on('error', (error) => {
        console.log('Something went wrong', error);
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('The attachment file was created successfully.');
      });

      req
          .on('aborted', () => {
            fs.unlink(filepath, () => {
              res.statusCode = 500;
              res.end('Internal server error');
            });
          })
          .pipe(transformStream)
          .on('error', (error) => {
            fs.unlink(filepath, () => {
              res.statusCode = 413;
              res.end('Max allowable request size: 1Mb');
            });
          })
          .pipe(writeStream)
          .on('error', (error) => {
            fs.unlink(filepath, () => {
              res.statusCode = 500;
              res.end('Internal server error');
            });
          });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
