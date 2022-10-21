// Purplet adapter entrypoint for an express middleware/server

/// <reference path="../../../../adapter-imports.d.ts" />

import { handleInteraction, setGlobalEnv, setRestOptions } from '$$adapter';
import type { Handler } from 'express';
import { errorNoPublicKey, errorNoToken, isDirectlyRun, Spinner } from 'purplet/internal';
import { sign } from 'tweetnacl';
import type { BotMiddlewareOptions } from './types';

setGlobalEnv({ env: process.env });

const te = new TextEncoder();

function hexStringToUint8Array(str: string) {
  const arr = new Uint8Array(str.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}

export default function botMiddleware({ token, publicKey }: BotMiddlewareOptions): Handler {
  setRestOptions({ token });

  return async (req, res, next) => {
    if (req.method !== 'POST') {
      return next();
    }

    const signature = req.header('X-Signature-Ed25519');
    const timestamp = req.header('X-Signature-Timestamp');

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!signature || !timestamp || !body) {
        res.status(400).send('Bad request.');
        return;
      }

      if (
        !sign.detached.verify(
          te.encode(timestamp + body),
          hexStringToUint8Array(signature),
          hexStringToUint8Array(publicKey)
        )
      ) {
        res.status(401).send('Bad request signature.');
        return;
      }

      handleInteraction(JSON.parse(body)) //
        .then(response => res.send(JSON.stringify(response)));
    });
  };
}

if (isDirectlyRun(import.meta.url)) {
  let express: typeof import('express');
  try {
    express = (await import('express')).default;
  } catch (error) {
    throw new Error('Running this file directly requires the `express` package to be installed.');
  }

  const token = process.env.DISCORD_TOKEN!;
  if (!token) {
    throw errorNoToken();
  }
  const publicKey = process.env.DISCORD_PUBLIC_KEY!;
  if (!token) {
    throw errorNoPublicKey();
  }

  const spinner = new Spinner({ text: 'Starting server' });
  const app = express();
  app.use(botMiddleware({ token, publicKey }));
  app.listen(process.env.PORT ?? 3000, () => {
    spinner.success('Server started');
  });
}
