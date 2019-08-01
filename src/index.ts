import http from 'http';
import https from 'https';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import path from 'path';
import fs from 'fs';

import config from './config';
import handlers from './lib/handlers';

const router: any = {
  ping: handlers.ping,
};

const unifiedServer = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void => {
  const parseUrl = url.parse(req.url ? req.url : '', true);
  const pathUrl = parseUrl.pathname;
  const trimmedPath = pathUrl ? pathUrl.replace(/^\/+|\/+$/g, '') : '';
  const method = req.method ? req.method.toLowerCase() : '';
  const queryString = parseUrl.query;
  const headersObject = req.headers;
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data: any) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    const route = trimmedPath !== '' ? typeof router[trimmedPath] : 'notfound';
    const chosenHandler =
      route !== 'notfound' ? router[trimmedPath] : handlers.notFound;

    const data = {
      trimmedPath,
      queryString,
      method,
      headers: headersObject,
      payload: buffer,
    };

    chosenHandler(data, (statusCode: number, payload: {}) => {
      const status = typeof statusCode === 'number' ? statusCode : 200;
      const body = typeof payload === 'object' ? payload : {};
      const payloadString = JSON.stringify(body);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(status);
      res.end(payloadString);

      // eslint-disable-next-line no-console
      console.log(status, payloadString);
    });
  });
};

const httpServer = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    unifiedServer(req, res);
  },
);

const httpsServerOptions = {
  key: fs.readFileSync(path.resolve('src/https/key.pem')),
  cert: fs.readFileSync(path.resolve('src/https/cert.pem')),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort);
httpServer.on('listening', (err: {}): void => {
  if (err) {
    console.log('ERROR', err); // eslint-disable-line
  } else {
    // eslint-disable-next-line
    console.log(
      `The HTTP server listening on port ${config.httpPort} in ${config.envName} mode`,
    );
  }
});

httpsServer.listen(config.httpsPort);
httpsServer.on('listening', (err: {}): void => {
  if (err) {
    console.log('ERROR', err); // eslint-disable-line
  } else {
    // eslint-disable-next-line
    console.log(
      `The HTTPS server listening on port ${config.httpsPort} in ${config.envName} mode`,
    );
  }
});
