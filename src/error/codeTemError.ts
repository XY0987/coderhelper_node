// codeTem 错误状态码以-6开头
type codeEnum = -6001 | 500;
export const getErrorResCodeTem = (code: codeEnum, err?: any) => {
  switch (code) {
    case -6001:
      return {
        code,
        info: '仅能删除自己定义的代码片段',
        message: '您不能删除自己创建以外的代码片段',
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
