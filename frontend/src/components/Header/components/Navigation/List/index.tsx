import React, { FC, forwardRef } from 'react';
import { NavLink, useLocation, useMatch } from 'react-router-dom';
import classNames from 'classnames';
import { link } from 'settings/navigation/link';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { Category } from 'types/track';
import { UserRoleEnum } from 'types/user';

type ComponentProps = {
  className?: string;
  styles: { [key: string]: string };
  navCategories: Category[];
  onClickLink?: Function;
};

const List: FC<ComponentProps> = forwardRef<any, ComponentProps>((props, ref) => {
  const { className, styles, navCategories, onClickLink } = props;
  const { user, adminState } = useStore();
  const match = useMatch({ path: routes.tracks });
  const location = useLocation();

  const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
    return classNames(styles.link, isActive ? styles.active : '');
  };

  const onClickAll = (e: any) => {
    onClickLink?.(e);
  };

  return (
    <ul
      ref={ref}
      className={classNames(styles.list, className)}
    >
      <li className={styles.item}>
        <NavLink
          onClick={onClickAll}
          className={({ isActive }) => {
            return classNames(
              styles.link,
              isActive || location.pathname === routes.index ? styles.active : ''
            );
          }}
          to={routes.allTracks}
        >
          All
        </NavLink>
      </li>
      {(navCategories || []).map((category: Category) => {
        return (
          <li
            key={category.value}
            className={styles.item}
          >
            <NavLink
              onClick={(e) => onClickLink?.(e)}
              className={({ isActive }) => {
                return getLinkClassName({
                  isActive: isActive || +match?.params.categoryId! === category.id,
                });
              }}
              to={link.toAllCategoryTracks(category.id.toString())}
            >
              {category.name}
            </NavLink>
          </li>
        );
      })}
      {user.data?.role?.name === UserRoleEnum.ADMIN && (
        <li className={styles.item}>
          <NavLink
            className={({ isActive }) =>
              getLinkClassName({ isActive: isActive || location.pathname.startsWith('/admin') })
            }
            to={link.toAdminPage(adminState.tab.admin)}
          >
            Admin
          </NavLink>
        </li>
      )}
    </ul>
  );
});

export default List;
