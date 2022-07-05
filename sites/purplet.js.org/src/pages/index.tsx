import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './index.module.css';

const example1 = `export const helloWorld = $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.reply({
      content: 'Hello, World!',
    });
  },
});`;

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Home`} description='Description will go into a meta tag in <head />'>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className={clsx('container', styles.header)}>
          <div className={styles.logo}>
            <img
              src='https://user-images.githubusercontent.com/67973777/169643730-2b03ecb8-3510-471f-8e3d-2c2485750962.png'
              alt='Purplet Logo'
            />
          </div>
          <div className={styles.headerContent}>
            <p className={styles.lead}>
              Purplet is a Discord Bot Framework that leverages Vite to give a developer experience
              never seen before:
            </p>
            <CodeBlock language='ts' className={styles.scrollX}>
              {example1}
            </CodeBlock>
            <div>
              <Link className='button button--secondary button--lg' href='/docs/getting-started'>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      <section className='padding-top--xl'>
        <div className='container'>
          <div className='row'>
            <div className='col col--4'>
              <h2>Modular</h2>
              <p>
                Purplet achieves total modularity by breaking your bot into different{' '}
                <code>Feature</code> objects that define a single behavior, such as a{' '}
                <Link href='/docs/slash-commands'>Slash Command</Link> or Modal Component.
              </p>
            </div>
            <div className='col col--4'>
              <h2>Iterate Quickly</h2>
              <p>
                With the power of Vite's HMR, your bot loads new code the instant it is saved, and
                patches command lists without dropping any connections.
              </p>
            </div>
            <div className='col col--4'>
              <h2>Cloud Focused</h2>
              <p>
                The entire framework is built with exporting to Cloud Functions in mind. The same
                code handling interactions from the Gateway will work as an HTTP bot without any
                modification.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='padding-vert--lg'>
        <div className='container'>
          <h2>Bots Using Purplet</h2>
          <p>CRBT</p>
        </div>
      </section>
    </Layout>
  );
}
