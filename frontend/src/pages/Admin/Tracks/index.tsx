import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper, AdminPageWrapper, AdminMenu } from 'components';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Tracks: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();

    useEffect(() => {
        tracks.getAll();
    }, []); // eslint-disable-line

    return (
        <div className={classNames(styles.tracks, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <PendingWrapper pending={false} className={styles.pendingWrapper}>
                        <div>Tracks</div>
                    </PendingWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default Tracks;
