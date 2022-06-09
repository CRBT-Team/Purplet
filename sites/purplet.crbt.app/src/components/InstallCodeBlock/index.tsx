import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const packageManagers = {
    'npm': <><span className={styles.pkg}>npm</span> init purplet</>,
    'yarn': <><span className={styles.pkg}>yarn</span> create purplet</>,
    'pnpm': <><span className={styles.pkg}>pnpm</span> create purplet</>,
}

export default function InstallCodeBlock(): JSX.Element {
    const [tab, setTab] = useState('pnpm');

    return <>
        <ul className={clsx("tabs", styles.tabs)}>
            {Object.entries(packageManagers).map(([name]) => {
                return <li
                    className={clsx('tabs__item', tab === name && 'tabs__item--active')}
                    onClick={() => setTab(name)}
                >
                    {name}
                </li>;
            })}        
        </ul>
        <pre className={styles.pre}><code>{packageManagers[tab]}</code></pre>
    </>
  }
  