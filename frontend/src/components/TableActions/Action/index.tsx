import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { Spinner } from '../..';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    isPending: boolean;
    children: ReactNode;
    loaderClassName?: string;
};

const Action: FC<ComponentProps> = (props) => {
    const { className, isPending, children, loaderClassName } = props;

    return (
        <div className={classNames(styles.action, className)}>
            {isPending ? (
                <Spinner
                    loaderWrapperClassName={classNames(styles.loaderWrapper, loaderClassName)}
                    className={styles.loader}
                />
            ) : (
                children
            )}
        </div>
    );
};

export default Action;
