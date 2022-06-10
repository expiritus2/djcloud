import { UserRoleEnum } from 'types/user';

export const canActivate = (userRole: UserRoleEnum, pathRoles: UserRoleEnum[]) => {
    return (userRole && pathRoles?.includes(userRole)) || (!pathRoles || !pathRoles.length);
}