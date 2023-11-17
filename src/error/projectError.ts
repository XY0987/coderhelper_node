// project 错误状态码以-2开头
type codeEnum = -2001 | -2002 | -2003 | -2004 | -2005 | 500;
export const getErrResProject = (code: codeEnum, err?: any) => {
  switch (code) {
    case -2001:
      return {
        code,
        info: '接口访问地址出错',
        message: '请输入正确接口访问地址',
      };
    case -2002:
      return {
        code,
        info: '权限不足',
        message: '权限不足，请联系项目管理员',
      };
    case -2003:
      return {
        code,
        info: '用户已添加过',
        message: '该用户已在项目中',
      };
    case -2004:
      return {
        code,
        info: '将自己从项目中删除',
        message: '您不能删除自己',
      };
    case -2005:
      return {
        code,
        info: '已经收藏过',
        message: '您已经收藏过该项目,请勿重复收藏',
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
