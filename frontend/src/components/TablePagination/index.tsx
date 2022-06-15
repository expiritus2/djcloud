import React, { FC, useMemo } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    count: number | undefined;
    current: number;
    displayCount?: number;
    limit?: number;
};

const TablePagination: FC<ComponentProps> = (props) => {
    const { className, current = 0, displayCount = 5, count = 0, limit = 0 } = props;

    const pages = useMemo(() => {
        const countPages = Math.ceil(count / limit);
        const pagesOffset = Math.floor((displayCount - 1) / 2);
        const prevPages =
            current > 0
                ? new Array(pagesOffset)
                      .fill(0)
                      .map((_, i) => current + 1 - (i + 1))
                      .filter((p) => p > 0)
                      .reverse()
                : [];
        const nextPages =
            current < countPages
                ? new Array(pagesOffset)
                      .fill(0)
                      .map((_, i) => current + 1 + (i + 1))
                      .filter((p) => p <= countPages)
                : [];
        console.log(prevPages, nextPages);
        return {
            prev: prevPages,
            next: nextPages,
            countPages,
        };
    }, [count, displayCount, current, limit]);

    return (
        <div className={classNames(styles.tablePagination, className)}>
            <div className={styles.controls}>
                <div className={classNames(styles.page, styles.first)}>First</div>
                <div className={classNames(styles.page)}>Prev</div>
            </div>
            <div className={styles.pages}>
                {pages.prev.map((page) => (
                    <div key={page} className={styles.page}>
                        {page}
                    </div>
                ))}
                <div className={classNames(styles.page, styles.current)}>{current + 1}</div>
                {pages.next.map((page) => (
                    <div key={page} className={styles.page}>
                        {page}
                    </div>
                ))}
            </div>
            {pages.next[pages.next.length - 1] !== pages.countPages && current + 1 !== pages.countPages ? (
                <>
                    {pages.next[pages.next.length - 1] + 1 !== pages.countPages ? (
                        <div className={classNames(styles.page, styles.dots)}>...</div>
                    ) : null}
                    <div className={styles.page}>{pages.countPages}</div>
                </>
            ) : null}
            <div className={styles.controls}>
                <div className={classNames(styles.page)}>Next</div>
                <div className={classNames(styles.page)}>Last</div>
            </div>
        </div>
    );
};

export default TablePagination;
