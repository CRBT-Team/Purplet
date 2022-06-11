import React, { useState } from 'react';
import { useBetween } from 'use-between';
import clsx from 'clsx';
import styles from './styles.module.css';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function TabbedCodeBlock(props): JSX.Element {
    console.log(props)
    return <>
        <Tabs className={styles.tabs}>
            {props.children}
        </Tabs>
    </>
}

export { TabItem }