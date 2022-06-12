import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper, AdminPageWrapper, AdminMenu } from 'components';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Categories: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { categories } = useStore();

    useEffect(() => {
        categories.getAll();
    }, []); // eslint-disable-line

    return (
        <div className={classNames(styles.categories, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <PendingWrapper pending={false} className={styles.pendingWrapper}>
                        <div>Categories</div>
                    </PendingWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default Categories;
