import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper, AdminPageWrapper, AdminMenu } from 'components';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Genres: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { genres } = useStore();

    useEffect(() => {
        genres.getAll();
    }, []); // eslint-disable-line

    return (
        <div className={classNames(styles.genres, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <PendingWrapper pending={false} className={styles.pendingWrapper}>
                        <div>Genres</div>
                    </PendingWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default Genres;
