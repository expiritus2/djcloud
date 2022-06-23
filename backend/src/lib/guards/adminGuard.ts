import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { RolesEnum } from '../../roles/roles.enum';

export class AdminGuard implements CanActivate {
    constructor(@Inject(UsersService) private userService: UsersService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const userId = request.session.userId;
        if (!userId) {
            return false;
        }

        const user = await this.userService.findOne(userId);
        return user.role.name === RolesEnum.ADMIN;
    }
}
