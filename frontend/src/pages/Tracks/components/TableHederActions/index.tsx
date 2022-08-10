import React, { FC } from 'react';
import classNames from 'classnames';

import { Filter } from '..';
import { TotalDuration } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const TableHeaderActions: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.tableHeaderActions, className)}>
            <Filter />
            <TotalDuration className={styles.totalDuration} />
        </div>
    );
};

export default TableHeaderActions;
