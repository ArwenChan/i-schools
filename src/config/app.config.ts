export default () => ({
  environment: process.env.NODE_ENV,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    synchronize: eval(process.env.DATABASE_SYNC),
  },
  verify: {
    secret: process.env.SECRET || 'secret',
  },
  wechat: {
    appid: process.env.WECHAT_APPID,
    secret: process.env.WECHAT_SECRET,
  },
  image: {
    access_key: process.env.QINIU_AK,
    secret_key: process.env.QINIU_SK,
    bucket: process.env.QINIU_BUCKET,
    domain: process.env.QINIU_DOMAIN,
  },
  cookieS: process.env.COOKIE_SECRET,
});
