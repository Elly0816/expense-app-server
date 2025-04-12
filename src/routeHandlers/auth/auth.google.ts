import type { Context } from 'hono';
// import passport from 'passport';
import { TokenManager } from '../../redis/token.manager';
import { googleAuth } from '@hono/oauth-providers/google';

// export const googleOauth: (c: Context) => Promise<Response> = async (c) => {
//   const authenticate = () =>
//     new Promise((resolve, reject) => {
//       const res = {
//         ...c.res,
//         setHeader: (name: string, value: string) => {
//           c.header(name, value);
//           return res;
//         },
//         end: () => {},
//         redirect: (url: string) => {
//           return c.redirect(url);
//         },
//         statusCode: 302,
//         getHeader: (name: string) => c.header(name),
//         writeHead: (status: number) => {
//           res.statusCode = status;
//           return res;
//         },
//         headers: {
//           append: (name: string, value: string) => {
//             c.res.headers.append(name, value);
//             return res;
//           },
//           set: (name: string, value: string) => {
//             c.res.headers.set(name, value);
//             return res;
//           },
//         },
//       };

//       c.res = res as unknown as Response;
//       passport.authenticate('google', {
//         scope: ['profile', 'email'],
//         session: false,
//       })(c.req.raw, c.res, (err: Error) => {
//         if (err) reject(err);
//         resolve(c.redirect('https://accounts.google.com/o/oauth2/v2/auth'));
//       });
//     });

//   try {
//     return (await authenticate()) as Response;
//   } catch (err) {
//     console.log('Authentication Error: ', err);
//     return c.redirect(`${process.env.CLIENT_URL}/login`);
//   }
// };

export const googleOauth: (c: Context) => Response = (c) => {
  const token = c.get('token');
  const grantedScopes = c.get('granted-scopes');
  const user = c.get('user-google');

  return c.json({
    token,
    grantedScopes,
    user,
  });
};

export const logout: (c: Context) => Promise<Response> = async (c) => {
  const userId = c.get('user')?.id;
  if (userId) {
    await TokenManager.removeTokens(userId);
  }
  return c.redirect(`${process.env.CLIENT_URL}/login`);
};
