import React, { FC, MouseEventHandler } from 'react';
import { RxArchive } from 'react-icons/rx';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClick: MouseEventHandler<HTMLDivElement>;
    active?: boolean;
};

const Archive: FC<ComponentProps> = (props) => {
    const { className, onClick, active = false } = props;

    return (
        <div onClick={onClick} className={classNames(styles.archive, className, { [styles.active]: active })}>
            <RxArchive />
        </div>
    );
};

export default Archive;
