import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { ContentModal } from 'components';

import { useStore } from 'store';

import { observer } from 'mobx-react-lite';
import { TrackRating } from 'types/track';
import { ButtonType } from '../ContentModal';
import StarWrapper from './StarWrapper';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    trackId: number;
} & TrackRating;

const Rating: FC<ComponentProps> = (props) => {
    const { className, trackId, rating, countRatings, isDidRating } = props;
    const { trackRating, tracks } = useStore();
    const [isConfirmRatingOpen, setIsConfirmRatingOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [currentRating, setCurrentRating] = useState(rating);

    const onMouseOver = (e: any, index: number) => {
        setCurrentRating(index + 1);
    };

    const onMouseLeave = () => {
        setCurrentRating(rating);
    };

    const onClick = () => {
        setIsConfirmRatingOpen(true);
    };

    const getStars = (isNumbers = false) => {
        return new Array(10).fill(null).map((_, index) => {
            const iconProps = {
                key: index,
                onMouseOver: (e: any) => onMouseOver(e, index),
                className: classNames(styles.star, isDidRating ? styles.isDidRating : ''),
                onClick,
            };
            if (currentRating && index <= currentRating - 1) {
                return (
                    <StarWrapper key={index} num={index + 1} isNumbers={isNumbers}>
                        <AiFillStar {...iconProps} />
                    </StarWrapper>
                );
            }
            return (
                <StarWrapper key={index} num={index + 1} isNumbers={isNumbers}>
                    <AiOutlineStar {...iconProps} />
                </StarWrapper>
            );
        });
    };

    const onClickCancel = () => {
        setIsConfirmRatingOpen(false);
        setCurrentRating(rating);
    };

    const onClickSubmit = () => {
        setPending(true);
        if (currentRating && trackId && !isDidRating) {
            trackRating.addTrackRating({ trackId, rating: currentRating }, {}, (err: any, response: any) => {
                if (!err) {
                    tracks.setTrackRating(response.data, trackId);
                }
                setPending(false);
                setIsConfirmRatingOpen(false);
            });
        }
    };

    const buttons: ButtonType[] = [
        { id: 'cancel', onClick: onClickCancel, label: 'Cancel', variant: 'secondary' },
        {
            id: 'submit',
            onClick: onClickSubmit,
            label: 'submit',
            variant: 'primary',
            pending,
        },
    ];

    return (
        <div className={classNames(styles.rating, className)} onMouseLeave={onMouseLeave}>
            <div className={classNames(styles.stars, isDidRating ? styles.disable : '')}>{getStars()}</div>
            <div className={styles.count}>({countRatings})</div>
            <ContentModal open={isConfirmRatingOpen} title="Rating" buttons={buttons}>
                <div className={classNames(styles.stars)}>
                    <div className={styles.starsWrapper}>
                        <div className={styles.starsHolder}>{getStars(true)}</div>
                    </div>
                </div>
            </ContentModal>
        </div>
    );
};

export default observer(Rating);
