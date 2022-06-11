import React, { FC } from 'react';
import classNames from 'classnames';
import { Header } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Tracks: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.tracks, className)}>
            <Header />
            Tracks
        </div>
    );
};

export default Tracks;