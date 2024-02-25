import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import * as multer from 'multer';
//代理中间件
@Injectable()
export class DynamicProxyMiddleware implements NestMiddleware {
  private upload = multer();
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Incoming request:', req.method, req.url);
    const targetUrl = req.query.targetUrl || 'http://localhost:8080';
    // 从请求路径中移除 '/dynamic-proxy' 部分
    const targetPath = req.url.replace(/^\/dynamic-proxy/, '');
    const proxyMiddleware = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/dynamic-proxy': '', // 移除 '/dynamic-proxy' 部分
      },
      methods: ['GET', 'POST', 'DELETE', 'PUT'], // 指定支持的请求方法
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //在转发之前，对body数据进行处理
      onProxyReq: (proxyReq: ClientRequest, req: Request) => {
        const contentType = req.headers['content-type'];
        if (contentType) {
          if (contentType.includes('multipart/form-data')) {
            console.log('发送文件数据');
            this.upload.none()(req, res, (err: any) => {
              if (!err && req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader(
                  'Content-Length',
                  Buffer.byteLength(bodyData),
                );
                proxyReq.write(bodyData);
              }
            });
          } else {
            console.log('发送JSON数据');
            // 处理JSON数据
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }
        }
      },
    } as Options);
    // 修改请求路径
    req.url = targetPath;
    proxyMiddleware(req, res, next);
  }
}
