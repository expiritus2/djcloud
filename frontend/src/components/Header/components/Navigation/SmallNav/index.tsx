import React, { FC, useRef, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import classNames from 'classnames';
import { useOutsideClick } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import List from '../List';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

const FullNav: FC<ComponentProps> = (props) => {
  const { className } = props;
  const [open, setOpen] = useState(false);
  const { navCategories } = useStore();
  const listRef = useRef(null);
  const hamburgerRef = useRef(null);

  useOutsideClick([listRef, hamburgerRef], () => setOpen(false));

  const onOpen = () => {
    setOpen(!open);
  };

  const onClickLink = () => {
    setOpen(false);
  };

  return (
    <div className={classNames(styles.smallNav, className)}>
      <div ref={hamburgerRef}>
        <GiHamburgerMenu
          onClick={onOpen}
          className={styles.hamburger}
        />
      </div>
      {open && (
        <List
          // @ts-ignore
          ref={listRef}
          onClickLink={onClickLink}
          navCategories={navCategories.data?.data || []}
          styles={styles}
        />
      )}
    </div>
  );
};

export default observer(FullNav);
