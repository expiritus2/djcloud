import React, { FC, useMemo } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    count: number | undefined;
    current: number;
    displayCount?: number;
    limit?: number;
    onClickPage: (e: any, page: number) => void;
};

const TablePagination: FC<ComponentProps> = (props) => {
    const { className, current = 0, displayCount = 5, count = 0, limit = 0, onClickPage } = props;

    const pages = useMemo(() => {
        const countPages = Math.ceil(count / limit) || 0;
        const pagesOffset = Math.floor((displayCount - 1) / 2);
        const prevPages =
            current > 0
                ? new Array(
                      current + 1 === countPages || current + 2 === countPages ? pagesOffset * 2 - 1 : pagesOffset,
                  )
                      .fill(0)
                      .map((_, i) => current + 1 - (i + 1))
                      .filter((p) => p > 0)
                      .reverse()
                : [];
        const nextPages =
            current < countPages
                ? new Array(prevPages.length === 0 ? pagesOffset * 2 - 1 : pagesOffset)
                      .fill(0)
                      .map((_, i) => current + 1 + (i + 1))
                      .filter((p) => p <= countPages)
                : [];
        return {
            prev: prevPages,
            next: nextPages,
            countPages,
        };
    }, [count, displayCount, current, limit]);

    const isLastPage = pages.countPages - current === 1;
    const isFirstPage = current <= 0;

    const onClickPageHandler = (e: any, page: number) => {
        onClickPage(e, page - 1);
    };

    const onClickNext = (e: any) => {
        if (!isLastPage) {
            onClickPage(e, current + 1);
        }
    };

    const onClickLast = (e: any) => {
        if (!isLastPage) {
            onClickPage(e, pages.countPages - 1);
        }
    };

    const onClickPrev = (e: any) => {
        if (!isFirstPage) {
            onClickPage(e, current - 1);
        }
    };

    const onClickFirst = (e: any) => {
        if (!isFirstPage) {
            onClickPage(e, 0);
        }
    };

    return (
        <div className={classNames(styles.tablePagination, className)}>
            <div className={classNames(styles.controls)}>
                <div
                    onClick={onClickFirst}
                    className={classNames(styles.page, styles.first, { [styles.disabled]: isFirstPage })}
                >
                    First
                </div>
                <div onClick={onClickPrev} className={classNames(styles.page, { [styles.disabled]: isFirstPage })}>
                    Prev
                </div>
                {!!pages.prev.length && !pages.prev.includes(1) && (
                    <div className={classNames(styles.page, styles.dots)}>...</div>
                )}
            </div>
            <div className={styles.pages}>
                {pages.prev.map((page) => (
                    <div onClick={(e) => onClickPageHandler(e, page)} key={page} className={styles.page}>
                        {page}
                    </div>
                ))}
                <div className={classNames(styles.page, styles.current)}>{current + 1}</div>
                {pages.next.map((page) => (
                    <div onClick={(e) => onClickPageHandler(e, page)} key={page} className={styles.page}>
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
                <div onClick={onClickNext} className={classNames(styles.page, { [styles.disabled]: isLastPage })}>
                    Next
                </div>
                <div onClick={onClickLast} className={classNames(styles.page, { [styles.disabled]: isLastPage })}>
                    Last
                </div>
            </div>
        </div>
    );
};

export default TablePagination;
