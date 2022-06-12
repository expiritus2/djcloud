import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PendingWrapper, AdminPageWrapper, AdminMenu, AdminPageTitle, AdminContentWrapper, Table } from 'components';
import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

type ComponentProps = {
    className?: string;
};

const Categories: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { categories } = useStore();

    useEffect(() => {
        categories.getAll();
    }, []); // eslint-disable-line

    const onClickNew = () => {};

    const getColumns = () => {
        return [
            { key: 'id', title: 'Id', width: '33%' },
            { key: 'name', title: 'Name', width: '33%' },
            { key: 'actions', title: 'Actions', width: '33%' },
        ];
    };

    const getRows = () => {
        return (
            categories.store.data?.data?.map((row) => ({
                id: row.id,
                name: row.name,
                value: row.value,
                actions: <div>Actions</div>,
            })) || []
        );
    };

    return (
        <div className={classNames(styles.categories, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={categories.store.state}>
                            <>
                                <AdminPageTitle title="Categories" onClickNew={onClickNew} />
                                <Table columns={getColumns()} rows={getRows()} />
                            </>
                        </PendingWrapper>
                    </AdminContentWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default observer(Categories);
