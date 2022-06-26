import React, { FC } from 'react';
import classNames from 'classnames';
import { Track } from 'store/Tracks/types';
import { formatDate, getDuration } from 'helpers/formatters';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, title, duration, createdAt } = props;

    return (
        <div className={classNames(styles.track, className)}>
            <div>
                <div>DjCloud</div>
                <div>{title}</div>
            </div>
            <div>{getDuration(duration)}</div>
            <div>{formatDate(createdAt)}</div>
        </div>
    );
};

export default TrackComponent;
