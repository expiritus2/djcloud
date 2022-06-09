import React, { FC } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Header } from 'components';
import { LoginForm } from './components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Login: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.login, className)}>
            <Header />
            <div className={styles.content}>
                <LoginForm />
            </div>
        </div>
    );
};

export default observer(Login);