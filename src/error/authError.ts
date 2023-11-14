// authError和用户状态码以-1开头
type codeEnum = -1001 | -1002 | -1003 | -1004 | -1005 | 500;

/* 
没有message不提示
如果状态码为负数或者500，就会警告提示message信息
如果状态码为200，就会成功提示message信息
*/

export const getErrorResTo = (code: codeEnum, err?: any) => {
  switch (code) {
    case -1001:
      return {
        code,
        info: '邮箱错误',
        message: '请输入正确邮箱',
      };
    case -1002:
      return {
        code,
        info: '验证码错误',
        message: '验证码错误或过期，请重新输入',
      };
    case -1003:
      return {
        code,
        info: '邮箱已注册过',
        message: '您已注册过，请登录',
      };
    case -1004:
      return {
        code,
        info: '账号或密码错误',
        message: '账号或密码错误，请重新输入',
      };
    case -1005:
      return {
        code,
        info: '邮箱未注册',
        message: '邮箱未注册，请先注册账号',
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
