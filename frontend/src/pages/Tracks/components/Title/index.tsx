import React, { FC, memo } from 'react';
import classNames from 'classnames';

import { Play } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
  title: string;
  id: number;
};

const Title: FC<ComponentProps> = (props) => {
  const { className, title, id } = props;

  return (
    <div className={classNames(styles.title, className)}>
      <Play
        trackId={id}
        iconClassName={styles.playIcon}
      />
      <div className={styles.titleText}>{title}</div>
    </div>
  );
};

export default memo(Title);
