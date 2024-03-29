import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
  isNumbers: boolean;
  children: ReactElement;
  num: number;
};

const StarWrapper: FC<ComponentProps> = (props) => {
  const { className, isNumbers, num, children } = props;

  if (isNumbers) {
    return (
      <div className={classNames(styles.starWrapper, className)}>
        <div className={styles.ratingNumber}>{num}</div>
        {children}
      </div>
    );
  }
  return children;
};

export default StarWrapper;
