import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }

  handleRequest(err: any, user: any, info: Error) {
    if (err || !user) {
      throw (
        err || new HttpException(`${info?.message}`, HttpStatus.UNAUTHORIZED)
      );
    }
    // if (!user) return { roles: ['GUEST'] };
    return user;
  }
}
