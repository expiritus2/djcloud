import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type Column = {
    key: string;
    title: string;
    width?: string;
};

type ComponentProps = {
    className?: string;
    columns: Column[];
    rows: any;
};

const Table: FC<ComponentProps> = (props) => {
    const { className, columns, rows } = props;

    return (
        <div className={classNames(styles.tableWrapper, className)}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.theadItem}>
                        {columns.map((column) => (
                            <td key={column.key} className={classNames(styles.theadCell, styles.cell)} style={{ width: column.width }}>
                                {column.title}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row: any) => (
                        <tr className={styles.tbodyItem} key={row.id}>
                            {columns.map((col) => (
                                <td key={col.key} className={classNames(styles.tbodyCell, styles.cell)}>
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
