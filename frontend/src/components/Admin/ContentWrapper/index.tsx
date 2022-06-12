import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    children: ReactElement;
};

const ContentWrapper: FC<ComponentProps> = (props) => {
    const { className, children } = props;

    return <div className={classNames(styles.contentWrapper, className)}>{children}</div>;
};

export default ContentWrapper;
