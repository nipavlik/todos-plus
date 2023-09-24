import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerIpGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.headers['x-real-ip'] || '127.0.0.1';
  }

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const ip = req.headers['x-real-ip'] || '127.0.0.1';
    const key = `${req.method}-${req.url}-ip:${ip}`;
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
