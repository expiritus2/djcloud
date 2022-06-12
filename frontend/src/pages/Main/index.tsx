import React, { FC } from 'react';
import classNames from 'classnames';
import { Header } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Main: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.main, className)}>
            <Header />
            Main
        </div>
    );
};

export default Main;
