// interface 错误状态码以-5开头
type codeEnum = -5001 | 500;
export const getErrResMeeting = (code: codeEnum, err?: any) => {
  switch (code) {
    case -5001:
      return {
        code,
        info: '权限不足，非会议创建者',
        message: '权限不足，请联系会议创建者',
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
