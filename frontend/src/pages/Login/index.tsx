import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { useStore } from '../../store';

import styles from './styles.module.scss';
import { RequestStateEnum } from '../../types/request';

interface ComponentProps {
    className?: string;
}

const Login: FC<ComponentProps> = (props) => {
    const { user } = useStore();
    const { className } = props;

    useEffect(() => {
        setTimeout(() => {
            user.setState(RequestStateEnum.READY)
        }, 1000);
    }, []);

    console.log(user.state);
    return <div className={classNames(styles.wrapper, className)}>Login</div>;
};

export default Login;