import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Spinner } from 'components';

type ComponentProps = {
    className?: string;
    children: ReactElement;
    pending: boolean;
}

const PendingWrapper: FC<ComponentProps> = (props) => {
    const { className, pending, children } = props;

    return (
        <div className={classNames(styles.pageWrapper, className)}>
            {pending ? <Spinner /> : children}
        </div>
    );
};

export default PendingWrapper
;