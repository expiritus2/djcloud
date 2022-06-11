import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const NotFound: FC<ComponentProps> = (props) => {
    const { className } = props;

    return <div className={classNames(styles.wrapper, className)}>NotFound</div>;
};

export default NotFound;
