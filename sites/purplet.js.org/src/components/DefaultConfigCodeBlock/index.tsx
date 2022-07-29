import purpletDefault from '!!raw-loader!../../../../../packages/purplet/src/config/default';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import { TabbedCodeBlock, TabItem } from '../TabbedCodeBlock';

const configValues = (/\/\/ START CONFIG\n(.*)\/\/ END CONFIG/s.exec(String(purpletDefault)))[1]
  .trim();

const jsSource = `
/** @type {import('purplet').Config} */
const config = {
  ${configValues}
};

export default config
`;

const tsSource = `
import { Config } from 'purplet';

const config: Config = {
  ${configValues}
};

export default config;
`;

export function DefaultConfigCodeBlock() {
  return (
    <TabbedCodeBlock>
      <TabItem value='ts' label='TypeScript'>
        <CodeBlock language='ts' title='purplet.config.ts'>
          {tsSource.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value='js' label='JavaScript'>
        <CodeBlock language='js' title='purplet.config.js'>
          {jsSource.trim()}
        </CodeBlock>
      </TabItem>
    </TabbedCodeBlock>
  );
}
