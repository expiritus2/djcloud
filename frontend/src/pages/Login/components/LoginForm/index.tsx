import React, { FC, useState } from 'react';
import { InputText, Button } from 'components';
import { useNavigate } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { AxiosError } from 'axios';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const LoginForm: FC<ComponentProps> = (props) => {
    const { className } = props;
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();
    const { user } = useStore();
    const [values, setValues] = useState({ email: '', password: '' });

    const onClickCancel = () => {
        navigate(routes.index);
    };

    const onClickSubmit = (event: any) => {
        event.preventDefault();
        setPending(true);
        user.loginAction(values, {}, (err: AxiosError) => {
            if (!err) {
                navigate(routes.adminCategoriesList);
            }
            setPending(false);
        });
    };

    const onChangeFieldValue = (event: any) => {
        const { name } = event.target;
        const { value } = event.target;
        setValues((prevVal) => ({ ...prevVal, [name]: value }));
    };

    return (
        <div className={classNames(styles.loginForm, className)}>
            <div className={classNames(styles.holder, className)}>
                <div className={classNames(styles.meta, styles.header)}>Login</div>
                <form className={styles.form} onSubmit={onClickSubmit}>
                    <InputText
                        onChange={onChangeFieldValue}
                        name="email"
                        label="Email"
                        className={styles.input}
                        value={values.email}
                    />
                    <InputText
                        type="password"
                        onChange={onChangeFieldValue}
                        name="password"
                        label="Password"
                        className={styles.input}
                        value={values.password}
                    />
                </form>
                <div className={classNames(styles.meta, styles.footer)}>
                    <div className={styles.buttons}>
                        <Button
                            type="button"
                            onClick={onClickCancel}
                            label="Cancel"
                            className={classNames(styles.button)}
                            variant="secondary"
                        />

                        <Button
                            type="submit"
                            pending={pending}
                            onClick={onClickSubmit}
                            label="Submit"
                            className={classNames(styles.button)}
                            variant="primary"
                        />
                    </div>
                    <div className={styles.clear} />
                </div>
            </div>
        </div>
    );
};

export default observer(LoginForm);
