import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
  loaderWrapperClassName?: string;
  className?: string;
};

const CircleSpinner: FC<ComponentProps> = (props) => {
  const { loaderWrapperClassName, className } = props;

  return (
    <div className={classNames(styles.loaderWrapper, loaderWrapperClassName)}>
      <div className={classNames(styles['lds-ring'], className)}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default CircleSpinner;
