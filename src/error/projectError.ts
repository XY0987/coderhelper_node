// project 错误状态码以-2开头
type codeEnum = -2001 | 500;
export const getErrResProject = (code: codeEnum, err?: any) => {
  switch (code) {
    case -2001:
      return {
        code,
        info: '接口访问地址出错',
        message: '请输入正确接口访问地址',
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
