import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProxyController } from './Proxy.controller';
import { DynamicProxyMiddleware } from './dynamic-proxy-middleware';
@Module({
  imports: [],
  controllers: [ProxyController],
  providers: [],
  exports: [],
})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DynamicProxyMiddleware).forRoutes('dynamic-proxy');
  }
}
