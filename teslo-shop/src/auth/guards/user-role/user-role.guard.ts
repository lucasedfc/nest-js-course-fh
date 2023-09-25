import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validaRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validaRoles) return true;
    if (validaRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validaRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `${user.fullName} needs a valid role [${validaRoles}]`,
    );
  }
}
