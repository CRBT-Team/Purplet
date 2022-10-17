// Purplet runtime for Bun.js
import { handleInteraction } from '../generated-build';
import { hexStringToUint8Array } from 'purplet/internal';
import { sign } from 'tweetnacl';

const te = new TextEncoder();

export default {
  port: 3000,
  async fetch(req) {
    const signature = req.headers.get('X-Signature-Ed25519');
    const timestamp = req.headers.get('X-Signature-Timestamp');
    const body = await req.text();

    if (!signature || !timestamp || !body) {
      return new Response('Bad request.', { status: 400 });
    }
    if (
      !sign.detached.verify(
        te.encode(timestamp + body),
        hexStringToUint8Array(signature),
        hexStringToUint8Array(process.env.DISCORD_PUBLIC_KEY)
      )
    ) {
      return new Response('Bad request signature.', { status: 401 });
    }

    return new Response(JSON.stringify(await handleInteraction(JSON.parse(body))));
  },
};
