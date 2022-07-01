import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { AiOutlineStar, AiFillStar } from 'react-icons/ai';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    rating?: number | null;
};

const Rating: FC<ComponentProps> = (props) => {
    const { className, rating = 5 } = props;
    const [currentRating, setCurrentRating] = useState(rating);

    const onMouseOver = (e: any, index: number) => {
        setCurrentRating(index + 1);
    };

    const onMouseLeave = () => {
        setCurrentRating(rating);
    };

    const onClick = (e: any, index: number) => {
        setCurrentRating(index + 1);
    };

    const getStars = () => {
        return new Array(10).fill(null).map((_, index) => {
            const iconProps = {
                key: index,
                onMouseOver: (e: any) => onMouseOver(e, index),
                className: styles.star,
                onClick: (e: any) => onClick(e, index),
            };
            if (currentRating && index <= currentRating - 1) {
                return <AiFillStar {...iconProps} />;
            }
            return <AiOutlineStar {...iconProps} />;
        });
    };

    return (
        <div className={classNames(styles.rating, className)} onMouseLeave={onMouseLeave}>
            {getStars()}
        </div>
    );
};

export default Rating;
