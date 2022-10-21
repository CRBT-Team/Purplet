export interface BotMiddlewareOptions {
  token: string;
  publicKey: string;
}

export default function BotMiddleware(options: BotMiddlewareOptions): Handler;
