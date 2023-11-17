// interface 错误状态码以-3开头
type codeEnum = -3001 | 500;
export const getErrResInterface = (code: codeEnum, err?: any) => {
  switch (code) {
    case -3001:
      return {
        code,
        info: '接口添加过',
        message: '该接口已添加过，请修改添加信息',
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
