import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routesConfig from 'settings/navigation/config';

const AppRouter: FC = () => (
    <BrowserRouter>
        <Routes>
            {routesConfig.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
        </Routes>
    </BrowserRouter>
);

export default AppRouter;