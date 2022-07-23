import React, { FC } from 'react';
import classNames from 'classnames';

import { Header } from 'components';
import { LoginForm } from './components';

import { useStore } from 'store';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Login: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { currentTrack } = useStore();

    return (
        <div className={classNames(styles.login, className)}>
            <Header />
            <div className={classNames(styles.content, currentTrack.data ? styles.withPlayer : '')}>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
