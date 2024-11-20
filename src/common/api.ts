import axios from 'axios';
import { logger } from '../logger/logger.service';

interface SessionResponse {
  openid: string;
  session_key: string;
  unionid: string;
  errcode: number;
  errmsg: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  errcode: number;
  errmsg: string;
}

export async function codeToSession(
  appid: string,
  secret: string,
  code: string,
) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid=${appid}&secret=${secret}&js_code=${code}`;
  const { data } = await axios.get<SessionResponse>(url);
  if (data.errcode && data.errcode !== 0) {
    logger.info('get error when code to session.');
    logger.info(`[API]: returned: \n${data}`);
    throw data.errmsg;
  }
  return data;
}

export async function getToken(appid: string, secret: string) {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  const { data } = await axios.get<TokenResponse>(url);
  if (data.errcode && data.errcode !== 0) {
    logger.info('get error when get weixin token.');
    logger.info(`[API]: returned: \n${data}`);
    throw data.errmsg;
  }
  return data;
}
