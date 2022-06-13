import React, { FC } from 'react';
import classNames from 'classnames';

import { AiFillDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClickEdit?: any;
    onClickDelete?: any;
};

const TableActions: FC<ComponentProps> = (props) => {
    const { className, onClickDelete, onClickEdit } = props;

    return (
        <div className={classNames(styles.tableActions, className)}>
            <FaRegEdit onClick={onClickEdit} className={classNames(styles.edit, styles.icon)} />
            <AiFillDelete onClick={onClickDelete} className={classNames(styles.remove, styles.icon)} />
        </div>
    );
};

export default TableActions;
