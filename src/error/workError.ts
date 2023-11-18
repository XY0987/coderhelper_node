// work 错误状态码以-4开头
type codeEnum = -4001 | 500;
export const getErrResWork = (code: codeEnum, err?: any) => {
  switch (code) {
    case -4001:
      return {
        code,
        info: '用户未在项目组中',
        message: '用户未在项目组中，请添加后重试',
      };
    default:
      return {
        code: 500,
        info: '默认状态码错误',
        err,
        message: '未知错误，请稍后重试',
      };
  }
};
