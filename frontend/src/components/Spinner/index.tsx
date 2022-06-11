import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    loaderWrapperClassName?: string;
    className?: string;
}

const Spinner: FC<ComponentProps> = (props) => {
    const { loaderWrapperClassName, className } = props;

    return (
        <div className={classNames(styles.loaderWrapper, loaderWrapperClassName)}>
            <div className={classNames(styles.loader, className)}>Loading...</div>
        </div>
    );
};

export default Spinner;
