import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_OWNER_KEY } from '../decorators/check-ownership.decorator';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const paramName = this.reflector.getAllAndOverride<string>(IS_OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!paramName) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params[paramName];

    if (!user) return false;

    // Se o ID da rota for diferente do ID do usuário logado, barra a ação
    if (resourceId !== user.id) {
      throw new ForbiddenException(
        'Você não tem permissão para editar ou excluir este perfil',
      );
    }

    return true;
  }
}
