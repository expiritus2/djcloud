import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Categories: FC<ComponentProps> = (props) => {
    const { className } = props;

    return <div className={classNames(styles.categories, className)}>Categories</div>;
};

export default Categories;