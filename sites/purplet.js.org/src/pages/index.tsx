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
              Purplet is a framework that leverages Vite, Discord.js, and TypeScript to give a
              developer experience never seen before:
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
                patches it's command list without restarting the Discord client.
              </p>
            </div>
            <div className='col col--4'>
              <h2>Strongly Typed</h2>
              <p>
                We use inferred types to bring command and modal properties as strong typed function
                parameters. That is a complex sentence and its 1am i should rewrite that as
                something easier to understand; explain OptionBuilder here.
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
      <section className='padding-top--lg padding-bottom--xl'>
        <div className='container'>
          <h2>Another Section</h2>
        </div>
      </section>
    </Layout>
  );
}
