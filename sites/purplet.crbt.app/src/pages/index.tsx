import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const example1 = `export const helloWorld = $chatCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.reply({
      content: 'Hello, World!',
    });
  },
});`;

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className={clsx("container", styles.header)}>
          <div className={styles.logo}>
            <img src="https://user-images.githubusercontent.com/67973777/169643730-2b03ecb8-3510-471f-8e3d-2c2485750962.png" alt="Purplet Logo" />
          </div>
          <div className={styles.headerContent}>
            <p className={styles.lead}>
              Purplet is a framework that leverages Vite, Discord.js, and TypeScript to give a developer experience never seen before:
            </p>
            <CodeBlock language='ts' className={styles.scrollX}>{example1}</CodeBlock>
            <div>
              <Link className='button button--secondary button--lg' href='/docs/getting-started'>Get Started</Link>
            </div>
          </div>
        </div>
      </header>
      <section className='hero'>
      
      </section>

    </Layout>
  );
}
