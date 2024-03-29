import React, { FC } from 'react';
import classNames from 'classnames';

import { Search } from './components';
import { LoginAvatar, Logo, Navigation, TelegramLink } from './components';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

const Header: FC<ComponentProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(styles.header, className)}>
      <Logo className={styles.logo} />
      <div className={styles.info}>
        <Navigation />
        <Search className={styles.search} />
        <TelegramLink className={styles.telegram} />
        <LoginAvatar />
      </div>
    </div>
  );
};

export default Header;
