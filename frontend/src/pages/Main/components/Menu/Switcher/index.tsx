import React, { FC } from 'react';
import classNames from 'classnames';
import { TrackGenresViewEnum } from 'types/track';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    active?: TrackGenresViewEnum;
    onClick: Function;
};

const Switcher: FC<ComponentProps> = (props) => {
    const { className, active, onClick } = props;

    return (
        <div className={classNames(styles.switcher, className)}>
            <div
                className={classNames(styles.tab, active === TrackGenresViewEnum.GENRE || !active ? styles.active : '')}
                onClick={(e) => onClick(e, TrackGenresViewEnum.GENRE)}
            >
                Genre
            </div>
            <div
                className={classNames(styles.tab, active === TrackGenresViewEnum.DATE ? styles.active : '')}
                onClick={(e) => onClick(e, TrackGenresViewEnum.DATE)}
            >
                Date
            </div>
        </div>
    );
};

export default Switcher;
