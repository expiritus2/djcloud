import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import { useStore } from 'store';
import { RequestStateEnum } from 'types/request';
import { observer } from 'mobx-react-lite';
import { Spinner } from 'components';

import styles from './styles.module.scss';

export const App = () => {
  const { user } = useStore();
  const isWaitUser = user.data.state === RequestStateEnum.IDLE || user.data.state === RequestStateEnum.PENDING;

  useEffect(() => {
    user.currentUser();
  }, []); // eslint-disable-line

  return isWaitUser ? <Spinner loaderWrapperClassName={styles.loader} /> : <AppRouter />;
}

export default observer(App);
