import React, { FC } from 'react';
import classNames from 'classnames';
import { SortEnum } from 'types/request';
import { GoTriangleDown } from 'react-icons/go';

import styles from './styles.module.scss';

export type Column = {
    key: string;
    title: string;
    width?: string;
    isSort?: boolean;
    sort?: SortEnum;
};

type ComponentProps = {
    className?: string;
    columns: Column[];
    rows: any;
    onSortClick?: Function;
};

const Table: FC<ComponentProps> = (props) => {
    const { className, columns, rows, onSortClick } = props;

    return (
        <div className={classNames(styles.tableHolder, className)}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.theadItem}>
                        {columns.map((column) => (
                            <td
                                key={column.key}
                                className={classNames(styles.theadCell, styles.cell)}
                                style={{ width: column.width }}
                            >
                                <div
                                    className={classNames(
                                        styles.title,
                                        column.isSort === undefined ? styles.clickable : '',
                                        column.sort === SortEnum.DESC ? styles.desc : styles.asc,
                                    )}
                                    onClick={(e) => column.isSort === undefined && onSortClick?.(e, column)}
                                >
                                    <div>{column.title}</div>
                                    {column.isSort === false ? null : (
                                        <GoTriangleDown
                                            className={classNames(
                                                styles.sortArrow,
                                                column.sort === SortEnum.DESC ? styles.desc : styles.asc,
                                            )}
                                        />
                                    )}
                                </div>
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
