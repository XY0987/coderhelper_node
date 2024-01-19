import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { NextFunction, Request, Response } from 'express';
//代理中间件
@Injectable()
export class DynamicProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const targetUrl = req.query.targetUrl || 'http://localhost:8080';
    // 从请求路径中移除 '/dynamic-proxy' 部分
    const targetPath = req.url.replace(/^\/dynamic-proxy/, '');

    // 创建代理中间件，并设置动态获取的代理地址和路径
    const proxyMiddleware = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/dynamic-proxy': '', // 移除 '/dynamic-proxy' 部分
      },
    } as Options);
    // 修改请求路径
    req.url = targetPath;
    proxyMiddleware(req, res, next);
  }
}
