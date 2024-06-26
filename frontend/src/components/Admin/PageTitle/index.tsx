import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';

import { Button } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
  title: string;
  onClickNew: MouseEventHandler<HTMLElement>;
};

const PageTitle: FC<ComponentProps> = (props) => {
  const { className, title, onClickNew } = props;

  return (
    <div className={classNames(styles.pageTitle, className)}>
      <div className={styles.title}>
        <span>{title}</span>
      </div>
      <Button
        label="New"
        onClick={onClickNew}
        className={styles.newButton}
      />
    </div>
  );
};

export default PageTitle;
