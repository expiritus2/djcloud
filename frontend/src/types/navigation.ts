import React from 'react';

export interface INavigation {
    path: string;
    Component: React.FunctionComponent;
    roles?: string[];
}
