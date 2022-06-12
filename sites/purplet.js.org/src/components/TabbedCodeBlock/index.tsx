import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import styles from './styles.module.css';

export function TabbedCodeBlock(props): JSX.Element {
  return <Tabs className={styles.tabs}>{props.children}</Tabs>;
}

export { TabItem };
