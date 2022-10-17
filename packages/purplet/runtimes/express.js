import { handleInteraction } from '../generated-build';
import { hexStringToUint8Array } from 'purplet/internal';
import express from 'express';
import { sign } from 'tweetnacl';

const te = new TextEncoder();

const app = express();
app.post('*', (req, res) => {
  const signature = req.headers.get('X-Signature-Ed25519');
  const timestamp = req.headers.get('X-Signature-Timestamp');

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
        hexStringToUint8Array(env.DISCORD_PUBLIC_KEY)
      )
    ) {
      res.status(401).send('Bad request signature.');
      return;
    }

    handleInteraction(JSON.parse(body)).then(response => res.send(JSON.stringify(response)));
  });
});
