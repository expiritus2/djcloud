import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import { Spinner } from 'components';
import styles from './styles.module.scss';
import { RequestStateEnum } from '../../types/request';

type ComponentProps = {
    className?: string;
    loaderClassName?: string;
    children: ReactElement;
    state: RequestStateEnum;
};

const PendingWrapper: FC<ComponentProps> = (props) => {
    const { className, state, children, loaderClassName } = props;

    return (
        <div className={classNames(styles.pendingWrapper, className)}>
            {state === RequestStateEnum.PENDING ? <Spinner className={loaderClassName} /> : children}
        </div>
    );
};

export default PendingWrapper;
