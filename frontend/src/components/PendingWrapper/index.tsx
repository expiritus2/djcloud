import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import { Spinner } from 'components';
import styles from './styles.module.scss';
import { RequestStateEnum } from '../../types/request';

type ComponentProps = {
    className?: string;
    children: ReactElement;
    state: RequestStateEnum;
};

const PendingWrapper: FC<ComponentProps> = (props) => {
    const { className, state, children } = props;

    return (
        <div className={classNames(styles.pendingWrapper, className)}>
            {state === RequestStateEnum.PENDING ? <Spinner /> : children}
        </div>
    );
};

export default PendingWrapper;
