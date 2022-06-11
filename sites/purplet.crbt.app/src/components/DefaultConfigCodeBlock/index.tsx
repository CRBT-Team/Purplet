// @ts-ignore
import tsSource from '!!raw-loader!../../../../../docs/04-default-config.ts';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import { TabbedCodeBlock, TabItem } from '../TabbedCodeBlock';

const jsSource = `/** @type {import('purplet').Config} */
const config = {
${tsSource.split('\n').slice(3).join('\n')}`;

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
