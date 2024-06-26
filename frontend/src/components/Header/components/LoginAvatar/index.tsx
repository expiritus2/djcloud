import React, { FC, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useOutsideClick } from 'hooks';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';

import { Avatar } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

const LoginAvatar: FC<ComponentProps> = (props) => {
  const { className } = props;
  const { user } = useStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  useOutsideClick([menuRef, avatarRef], () => setOpen(false));

  const onClickLogin = () => {
    setOpen(!open);
  };

  const onLogout = () => {
    user.logoutAction();
  };

  return (
    <div
      id="avatarWrapper"
      className={classNames(styles.avatarWrapper, className)}
    >
      <Avatar
        ref={avatarRef}
        src="/images/default_avatar.png"
        className={styles.avatar}
        onClick={onClickLogin}
      />
      {open && (
        <div
          ref={menuRef}
          className={styles.menu}
        >
          <ul className={styles.list}>
            <li>
              <Link
                className={styles.item}
                to={routes.login}
              >
                Login
              </Link>
            </li>
            {user.data && (
              <li onClick={onLogout}>
                <span className={styles.item}>Logout</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoginAvatar;
