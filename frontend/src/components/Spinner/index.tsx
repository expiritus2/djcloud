import React, { FC } from 'react';
import classNames from 'classnames';

import CircleSpinner from './CircleSpinner';

import styles from './styles.module.scss';

export enum LoaderTypeEnum {
  CIRCLE = 'circle',
}

type ComponentProps = {
  loaderWrapperClassName?: string;
  className?: string;
  loaderType?: LoaderTypeEnum;
};

const Spinner: FC<ComponentProps> = (props) => {
  const { loaderWrapperClassName, className, loaderType } = props;

  if (loaderType === LoaderTypeEnum.CIRCLE) {
    return (
      <CircleSpinner
        loaderWrapperClassName={loaderWrapperClassName}
        className={className}
      />
    );
  }

  return (
    <div className={classNames(styles.loaderWrapper, loaderWrapperClassName)}>
      <div className={classNames(styles.loader, className)}>Loading...</div>
    </div>
  );
};

export default Spinner;
