import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper, AdminPageWrapper, AdminMenu, AdminContentWrapper } from 'components';
import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

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
                    <AdminContentWrapper>
                        <PendingWrapper state={tracks.store.state}>
                            <div>Tracks</div>
                        </PendingWrapper>
                    </AdminContentWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default observer(Tracks);
