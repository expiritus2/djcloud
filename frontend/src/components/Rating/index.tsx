import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { AiOutlineStar, AiFillStar } from 'react-icons/ai';

import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { TrackRating } from '../../types/track';

type ComponentProps = {
    className?: string;
    trackId: number;
} & TrackRating;

const Rating: FC<ComponentProps> = (props) => {
    const { className, trackId, rating, countRatings, isDidRating } = props;
    const { trackRating, tracks } = useStore();
    const [currentRating, setCurrentRating] = useState(rating);

    const onMouseOver = (e: any, index: number) => {
        setCurrentRating(index + 1);
    };

    const onMouseLeave = () => {
        setCurrentRating(rating);
    };

    const onClick = () => {
        if (currentRating && trackId && !isDidRating) {
            trackRating.addTrackRating({ trackId, rating: currentRating }, {}, (err: any, response: any) => {
                if (!err) {
                    tracks.setTrackRating(response.data, trackId);
                }
            });
        }
    };

    const getStars = () => {
        return new Array(10).fill(null).map((_, index) => {
            const iconProps = {
                key: index,
                onMouseOver: (e: any) => onMouseOver(e, index),
                className: styles.star,
                onClick,
            };
            if (currentRating && index <= currentRating - 1) {
                return <AiFillStar {...iconProps} />;
            }
            return <AiOutlineStar {...iconProps} />;
        });
    };

    return (
        <div className={classNames(styles.rating, className)} onMouseLeave={onMouseLeave}>
            <div className={classNames(styles.stars, isDidRating ? styles.disable : '')}>{getStars()}</div>
            <div>({countRatings})</div>
        </div>
    );
};

export default observer(Rating);
