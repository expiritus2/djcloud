import React, { FC, useRef, useState } from 'react';
import classNames from 'classnames';

import { Avatar } from 'components';
import { routes } from 'settings/navigation/routes';

import { useNavigate } from 'react-router-dom';
import { useOutsideClick } from 'hooks';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const LoginAvatar: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { user } = useStore();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const avatarRef = useRef(null);

    useOutsideClick([menuRef, avatarRef], () => setOpen(false));

    const onClickLogin = () => {
        setOpen(!open);
    };

    const onLogin = () => {
        navigate(routes.login);
    };

    const onLogout = () => {
        user.logoutAction();
    };

    return (
        <div className={classNames(styles.avatarWrapper, className)}>
            <Avatar ref={avatarRef} src="/images/default_avatar.png" className={styles.avatar} onClick={onClickLogin} />
            {open && (
                <div ref={menuRef} className={styles.menu}>
                    <ul className={styles.list}>
                        <li className={styles.item} onClick={onLogin}>
                            Login
                        </li>
                        {user.data && (
                            <li className={styles.item} onClick={onLogout}>
                                Logout
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LoginAvatar;
