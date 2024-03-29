import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import routesConfig from 'settings/navigation/config';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { RequestStateEnum } from 'types/request';
import { UserRoleEnum } from 'types/user';

import { Player } from 'components';

import { canActivate } from './helpers';

const AppRouter: FC = () => {
  const { user, currentTrack } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        {routesConfig.map(({ path, Component, roles: pathRoles }) => {
          const userRole = user.data?.role?.name as UserRoleEnum;
          const isCanActivate = canActivate(userRole, pathRoles as UserRoleEnum[]);
          const exceptPlayerPaths = [!currentTrack.data ? routes.login : undefined, '*'];

          let Page = null;
          if (isCanActivate) {
            Page = (
              <>
                <Component />
                {!exceptPlayerPaths.includes(path) ? <Player /> : null}
              </>
            );
          } else if (
            user.state !== RequestStateEnum.PENDING &&
            user.state !== RequestStateEnum.IDLE
          ) {
            Page = <Navigate to={routes.login} />;
          }

          return (
            <Route
              key={path}
              path={path}
              element={Page}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default observer(AppRouter);
