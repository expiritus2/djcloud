import React, { FC } from 'react';
import classNames from 'classnames';
import { Button, InputText } from 'components';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import { routes } from '../../../../settings/navigation/routes';

type ComponentProps = {
    className?: string;
}

const LoginForm: FC<ComponentProps> = (props) => {
    const { className } = props;
    const navigate = useNavigate();

    const onClickCancel = () => {
        navigate(routes.index);
    }

    return (
        <div className={classNames(styles.loginForm, className)}>
            <div className={classNames(styles.meta, styles.formHeader)}>Login</div>
            <form className={styles.form}>
                <InputText label="Email" className={styles.input} />
                <InputText label="Password" className={styles.input} />
            </form>
            <div className={classNames(styles.meta, styles.formFooter)}>
                <div className={styles.buttons}>
                    <Button onClick={onClickCancel} label="Cancel" className={styles.button} variant="secondary" />
                    <Button label="Submit" className={styles.button} variant="primary" />
                </div>
                <div className={styles.clear}></div>
            </div>
        </div>
    );
};

export default LoginForm;