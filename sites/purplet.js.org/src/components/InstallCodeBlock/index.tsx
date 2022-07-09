import clsx from 'clsx';
import React, { useState } from 'react';
import { useBetween } from 'use-between';
import styles from './styles.module.css';

const stateFunc = () => {
  return useState('pnpm');
};

const useTabState = () => useBetween(stateFunc);

const packageManagers = {
  npm: (
    <>
      <span className={styles.pkg}>npm</span> init purplet
    </>
  ),
  yarn: (
    <>
      <span className={styles.pkg}>yarn</span> create purplet
    </>
  ),
  pnpm: (
    <>
      <span className={styles.pkg}>pnpm</span> create purplet
    </>
  ),
};

const packageManagerDevCommands = {
  npm: (
    <>
      <span className={styles.pkg}>npm</span> run{' '}
    </>
  ),
  yarn: (
    <>
      <span className={styles.pkg}>yarn</span>{' '}
    </>
  ),
  pnpm: (
    <>
      <span className={styles.pkg}>pnpm</span>{' '}
    </>
  ),
};

const packageManagerDevCommands2 = {
  npm: (
    <>
      <span className={styles.pkg}>npx</span>{' '}
    </>
  ),
  yarn: (
    <>
      <span className={styles.pkg}>yarn</span>{' '}
    </>
  ),
  pnpm: (
    <>
      <span className={styles.pkg}>pnpm</span>{' '}
    </>
  ),
};

export function InstallCodeBlock(): JSX.Element {
  const [tab, setTab] = useTabState();

  return (
    <>
      <ul className={clsx('tabs', styles.tabs)}>
        {Object.entries(packageManagers).map(([name]) => {
          return (
            <li
              className={clsx('tabs__item', tab === name && 'tabs__item--active')}
              onClick={() => setTab(name)}>
              {name}
            </li>
          );
        })}
      </ul>
      <pre className={styles.pre}>
        <code>{packageManagers[tab]}</code>
      </pre>
    </>
  );
}

export function RunScriptCodeBlock({ name }): JSX.Element {
  const [tab, setTab] = useTabState();
  return (
    <code>
      {name.startsWith('purplet ')
        ? packageManagerDevCommands2[tab]
        : packageManagerDevCommands[tab]}{' '}
      {name}
    </code>
  );
}
