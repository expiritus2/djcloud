import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper, AdminPageWrapper, AdminMenu, AdminContentWrapper } from 'components';
import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

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
                    <AdminContentWrapper>
                        <PendingWrapper state={genres.store.state}>
                            <div>Genres</div>
                        </PendingWrapper>
                    </AdminContentWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default observer(Genres);
