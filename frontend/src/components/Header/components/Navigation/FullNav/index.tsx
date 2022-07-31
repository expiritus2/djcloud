import React, { FC } from 'react';
import classNames from 'classnames';

import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import List from '../List';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const FullNav: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { navCategories } = useStore();

    return (
        <div className={classNames(styles.fullNav, className)}>
            <List navCategories={navCategories.data?.data || []} styles={styles} />
        </div>
    );
};

export default observer(FullNav);
