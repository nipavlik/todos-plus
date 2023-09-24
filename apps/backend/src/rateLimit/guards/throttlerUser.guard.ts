import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerUserGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user.id;
  }

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const userId = req.user.id;
    const key = `${req.method}-${req.url}-userId:${userId}`;
    const { totalHits, timeToExpire } = await this.storageService.increment(
      key,
      ttl,
    );
    if (totalHits > limit) {
      res.header(`Retry-After`, timeToExpire);
      throw new ThrottlerException();
    }

    res.header(`${this.headerPrefix}-Limit`, limit);
    res.header(
      `${this.headerPrefix}-Remaining`,
      Math.max(0, limit - totalHits),
    );
    res.header(`${this.headerPrefix}-Reset`, timeToExpire);

    return true;
  }
}
