import React, { FC } from 'react';
import classNames from 'classnames';
import { getDuration } from 'helpers/formatters';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const TotalDuration: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();

    if (!tracks.data) return null;

    return (
        <div className={classNames(styles.totalDuration, className)}>
            <span className={styles.totalText}>Total Duration: </span>
            <span>{`${getDuration(tracks.data?.totalDuration || 0)} (${tracks.data?.count})`}</span>
        </div>
    );
};

export default observer(TotalDuration);
