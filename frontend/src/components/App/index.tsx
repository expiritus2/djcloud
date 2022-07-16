import React, { useEffect } from 'react';
import { useStore } from 'store';
import { RequestStateEnum } from 'types/request';
import { observer } from 'mobx-react-lite';
import { Spinner } from 'components';
import AppRouter from './AppRouter';

import styles from './styles.module.scss';

export function App() {
    const { user } = useStore();
    const isWaitUser = user.state === RequestStateEnum.IDLE || user.state === RequestStateEnum.PENDING;

    useEffect(() => {
        user.currentUser();
    }, []); // eslint-disable-line

    return isWaitUser ? <Spinner loaderWrapperClassName={styles.loader} /> : <AppRouter />;
}

export default observer(App);
