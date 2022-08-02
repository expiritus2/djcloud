import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useScreen } from '../../../hooks';
import { MOBILE_SMALL } from '../../../settings/constants/screen';

type ComponentProps = {
    className?: string;
    currentRating: number;
    index: number;
    isNumbers: boolean;
    iconProps: any;
    rating: number;
};

const StarIcon: FC<ComponentProps> = (props) => {
    const { className, currentRating, index, isNumbers, iconProps, rating } = props;
    const { screen } = useScreen();
    const isMobile = screen.width <= MOBILE_SMALL && !isNumbers;

    return (
        <div className={classNames(styles.starIcon, className)}>
            {currentRating && index <= currentRating - 1 ? (
                <AiFillStar {...iconProps} />
            ) : (
                <AiOutlineStar {...iconProps} />
            )}
            {isMobile ? <span className={styles.mobileRating}>{rating}</span> : null}
        </div>
    );
};

export default StarIcon;
