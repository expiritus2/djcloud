import React, { useEffect } from 'react';
import ScreenContext from 'contexts/screen';
import { useResize } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { RequestStateEnum } from 'types/request';

import { Spinner } from 'components';

import AppRouter from './AppRouter';

import styles from './styles.module.scss';

export function App() {
  const { user } = useStore();
  const { screen, mobileOS, isMobile } = useResize();
  const isWaitUser =
    user.state === RequestStateEnum.IDLE || user.state === RequestStateEnum.PENDING;

  useEffect(() => {
    user.currentUser();
  }, []); // eslint-disable-line

  return (
    <ScreenContext.Provider value={{ screen, mobileOS, isMobile }}>
      {isWaitUser ? <Spinner loaderWrapperClassName={styles.loader} /> : <AppRouter />}
    </ScreenContext.Provider>
  );
}

export default observer(App);
