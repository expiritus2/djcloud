import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import Header from '../../components/Header';

type ComponentProps = {
    className?: string;
}

const Main: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.main, className)}>
            <Header />
        </div>
    );
};

export default Main;