import React, { FC } from 'react';
import classNames from 'classnames';

import { Spinner } from '../../index';
import { LoaderTypeEnum } from '../../Spinner';

import styles from './styles.module.scss';

type ComponentProps = {
    progress: number;
    className?: string;
    loaderWrapperClassName?: string;
};

const CreateZipSpinner: FC<ComponentProps> = (props) => {
    const { className, loaderWrapperClassName, progress } = props;

    return (
        <div className={classNames(styles.createZipSpinner, className)}>
            <Spinner
                className={styles.loader}
                loaderWrapperClassName={classNames(styles.loaderWrapper, loaderWrapperClassName)}
                loaderType={LoaderTypeEnum.CIRCLE}
            />
            <div className={styles.progress}>{progress}</div>
        </div>
    );
};

export default CreateZipSpinner;
