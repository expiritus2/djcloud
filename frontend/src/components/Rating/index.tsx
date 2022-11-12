import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useScreen } from 'hooks';
import { observer } from 'mobx-react-lite';
import { MOBILE_SMALL } from 'settings/constants/screen';
import { useStore } from 'store';
import { TrackRating } from 'types/track';

import { ContentModal } from 'components';

import { ButtonType } from '../ContentModal';

import { createStars } from './helpers';
import StarIcon from './StarIcon';
import StarWrapper from './StarWrapper';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    trackId: number;
    notActiveByClick?: boolean;
    white?: boolean;
} & TrackRating;

const Rating: FC<ComponentProps> = (props) => {
    const { className, trackId, rating, countRatings, isDidRating, notActiveByClick, white } = props;
    const { trackRating, tracks } = useStore();
    const { screen } = useScreen();
    const [isConfirmRatingOpen, setIsConfirmRatingOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [currentRating, setCurrentRating] = useState(rating);

    useEffect(() => {
        setCurrentRating(rating);
    }, [rating]);

    const onMouseOver = (e: any, index: number, isNumbers?: boolean) => {
        if (!isNumbers && notActiveByClick && isConfirmRatingOpen) {
            return;
        }
        setCurrentRating(index + 1);
    };

    const onMouseLeave = () => {
        if (notActiveByClick && isConfirmRatingOpen) {
            return;
        }
        setCurrentRating(rating);
    };

    const onClick = () => {
        setIsConfirmRatingOpen(true);
    };

    const getStars = (isNumbers = false) => {
        const isMobile = screen.width <= MOBILE_SMALL && !isNumbers;

        return createStars(screen, isNumbers).map((_, index) => {
            const iconProps = {
                onMouseOver: (e: any) => onMouseOver(e, index, isNumbers),
                className: classNames(
                    styles.star,
                    isDidRating ? styles.isDidRating : '',
                    isMobile ? styles.mobile : '',
                    white ? styles.white : '',
                ),
                onClick,
            };
            return (
                <StarWrapper key={index} num={index + 1} isNumbers={isNumbers}>
                    <StarIcon
                        iconProps={iconProps}
                        rating={rating}
                        currentRating={currentRating}
                        index={index}
                        isNumbers={isNumbers}
                    />
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
            <div className={classNames(styles.count, white ? styles.white : '')}>({countRatings})</div>
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
