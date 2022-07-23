import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    children: ReactNode;
};

const TableWrapper: FC<ComponentProps> = (props) => {
    const { className, children } = props;

    return <div className={classNames(styles.tableWrapper, className)}>{children}</div>;
};

export default TableWrapper;
