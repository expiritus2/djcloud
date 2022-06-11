import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import routesConfig from 'settings/navigation/config';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { routes } from 'settings/navigation/routes';
import { canActivate } from './helpers';
import { UserRoleEnum } from 'types/user';
import { RequestStateEnum } from '../../../types/request';

const AppRouter: FC = () => {
    const { user } = useStore();

    return (
        <BrowserRouter>
            <Routes>
                {routesConfig.map(({ path, Component, roles: pathRoles }) => {
                    const userRole = user.data.data?.role?.name as UserRoleEnum;
                    const isCanActivate = canActivate(userRole, pathRoles as UserRoleEnum[]);
                    let Page = null;

                    if (isCanActivate) {
                        Page = <Component/>
                    } else {
                        if (user.data.state !== RequestStateEnum.PENDING && user.data.state !== RequestStateEnum.IDLE) {
                            Page = <Navigate to={routes.login}/>;
                        }
                    }

                    return (
                        <Route key={path} path={path} element={Page}/>
                    )
                })}
            </Routes>
        </BrowserRouter>
    );
}

export default observer(AppRouter);