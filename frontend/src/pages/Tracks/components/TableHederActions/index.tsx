import React, { FC, memo } from 'react';
import classNames from 'classnames';

import { DownloadAll, TotalDuration } from 'components';

import { Filter } from '..';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

const TableHeaderActions: FC<ComponentProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(styles.tableHeaderActions, className)}>
      <Filter />
      <div className={styles.totalDurationWrapper}>
        <TotalDuration />
        <DownloadAll />
      </div>
    </div>
  );
};

export default memo(TableHeaderActions);
