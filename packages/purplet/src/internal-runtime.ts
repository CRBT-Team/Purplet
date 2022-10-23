/* eslint-disable no-else-return */
import interactionFeatures from '$$features/interaction';
import { toBlob } from '@purplet/utils';
import { FormDataEncoder } from 'form-data-encoder';
import { sign } from 'tweetnacl';
import { $interaction } from './lib/hook-core';
import { runHook } from './lib/hook-run';
import { createInteraction } from './structures';

function hexStringToUint8Array(str: string) {
  const arr = new Uint8Array(str.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}

const te = new TextEncoder();

export async function handleInteraction(
  request: Request,
  publicKey: Uint8Array
): Promise<Response> {
  const signature = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');
  const body = await request.text();

  if (!signature || !timestamp || !body) {
    return new Response('Bad request.', { status: 400 });
  }
  if (
    !sign.detached.verify(te.encode(timestamp + body), hexStringToUint8Array(signature), publicKey)
  ) {
    return new Response('Bad request signature.', { status: 401 });
  }

  const raw = JSON.parse(body);

  return new Promise((resolve, reject) => {
    let responded = false;
    const interaction = createInteraction(raw, async ({ data, type, files }) => {
      responded = true;

      if (files && files.length) {
        const form = new FormData();

        if (data) {
          form.append(
            'payload_json',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
          );
        }

        for (const [index, file] of files.entries()) {
          form.append(file.key ?? `files[${index}]`, toBlob(file.data));
        }

        const encoder = new FormDataEncoder(form);
        const parts = [];
        for await (const part of encoder.encode()) {
          parts.push(part);
        }
        const response = new Response(parts);
        response.headers.set('Content-Type', encoder.contentType);
        if (encoder.contentLength) {
          response.headers.set('Content-Type', encoder.contentLength);
        }
        resolve(response);
      } else {
        resolve(Response.json({ type, data }));
      }
    });

    runHook(interactionFeatures, $interaction, interaction)
      .then(() => {
        if (!responded) {
          resolve(new Response('Internal Server Error', { status: 500 }));
        }
      })
      .catch(reject);
  });
}
