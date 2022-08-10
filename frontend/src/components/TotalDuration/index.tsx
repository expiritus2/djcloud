import React, { FC } from 'react';
import classNames from 'classnames';

import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { getDuration } from 'helpers/formatters';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const TotalDuration: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();

    return (
        <div className={classNames(styles.totalDuration, className)}>
            <span className={styles.totalText}>Total Duration: </span>
            <span>{getDuration(tracks.data?.totalDuration || 0)}</span>
        </div>
    );
};

export default observer(TotalDuration);
