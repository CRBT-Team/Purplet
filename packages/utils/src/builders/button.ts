import type { APIButtonComponentWithURL } from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

export function createLinkButton(label: string, url: string): APIButtonComponentWithURL {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    label,
    url,
  };
}
