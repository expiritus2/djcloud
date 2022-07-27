import React, { FC } from 'react';
import classNames from 'classnames';
import { FaTelegram } from 'react-icons/fa';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const TelegramLink: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.telegramLink, className)}>
            <a className={styles.link} href="https://t.me/ddjcloud" target="_blank">
                <FaTelegram className={styles.icon} />
            </a>
        </div>
    );
};

export default TelegramLink;
