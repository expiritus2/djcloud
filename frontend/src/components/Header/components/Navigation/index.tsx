import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Navigation: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.navigation, className)}>
            <ul className={styles.list}>
                <li className={styles.item}>Mix's</li>
                <li className={styles.item}>Created</li>
            </ul>
        </div>
    );
};

export default Navigation;