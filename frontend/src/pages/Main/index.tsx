import React, { FC } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Header, PageWrapper } from 'components';

import { Content, MainMenu } from './components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Main: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.main, className)}>
            <Header />
            <PageWrapper>
                <>
                    <MainMenu />
                    <Content />
                </>
            </PageWrapper>
        </div>
    );
};

export default observer(Main);
