import React, { FC } from 'react';
import classNames from 'classnames';
import { Header, PageWrapper } from 'components';
import { MainMenu, Content } from './components';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

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
