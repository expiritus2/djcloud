import React, { FC, useState } from 'react';
import { InputText, ContentModal } from 'components';
import { useNavigate } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { ButtonType } from 'components/ContentModal';
import classNames from 'classnames';

import { AxiosError } from 'axios';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const LoginForm: FC<ComponentProps> = (props) => {
    const formId = 'login-form';
    const { className } = props;
    const navigate = useNavigate();
    const { user } = useStore();
    const [values, setValues] = useState({ email: '', password: '' });

    const onClickCancel = () => {
        navigate(routes.index);
    };

    const onClickSubmit = (event: any) => {
        event.preventDefault();
        user.loginAction(values, {}, (err: AxiosError) => {
            if (!err) {
                navigate(routes.adminCategoriesList);
            }
        });
    };

    const onChangeFieldValue = (event: any) => {
        const { name } = event.target;
        const { value } = event.target;
        setValues((prevVal) => ({ ...prevVal, [name]: value }));
    };

    const buttons: ButtonType[] = [
        { id: 'cancel', onClick: onClickCancel, label: 'Cancel', variant: 'secondary' },
        { id: 'submit', onClick: onClickSubmit, label: 'Submit', variant: 'primary' },
    ];

    return (
        <ContentModal
            title="Login"
            buttons={buttons}
            opacityLayerClassName={styles.opacityLayer}
            className={classNames(styles.loginForm, className)}
            wrapperClassName={styles.modalWrapper}
        >
            <form className={styles.form} id={formId} onSubmit={onClickSubmit}>
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
        </ContentModal>
    );
};

export default observer(LoginForm);
