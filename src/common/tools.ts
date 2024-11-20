import { authenticator } from 'otplib';

export const dynamicImport = async (packageName: string) => {
  const module = await (eval(`import('${packageName}')`) as Promise<any>);
  return module;
};

// export async function getQRcode() {
//   const userName = '';
//   const appName = '';
//   const secret = authenticator.generateSecret();
//   console.log(secret);
//   const googleKeyuri = authenticator.keyuri(userName, appName, secret);
//   const qrcodeUrl = await QRCode.toDataURL(googleKeyuri);
//   console.log(qrcodeUrl);
// }

export function checkCode(code: string) {
  return authenticator.check(code, process.env.GATL || 'haha');
}
