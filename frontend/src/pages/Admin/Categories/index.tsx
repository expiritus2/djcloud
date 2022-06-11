import React, { FC } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Categories: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.categories, className)}>
            <Header />
            <PendingWrapper pending={false} className={styles.pendingWrapper}>
                <div>Content</div>
            </PendingWrapper>
        </div>
    );
};

export default Categories;
