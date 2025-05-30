/**
 * In order to build a proper callback to handle proxy servers in a prod env
 * We would have to get the real protocol and the real host that we can send to
 * google to use as the callback uri to avoid any issues with the
 * URI
 *
 *
 *
 *
 *
 *
 */

import type { Context } from 'hono';

// TODO 1: Utility function to get the real protocol from the proxy headers

const getRealProtocol = (c: Context): string => {
  const req = c.req;
  // Check the x-forwarded-proto header
  const forwardedProto = req.header('x-forwarded-proto');
  if (forwardedProto) {
    return forwardedProto.split(',')[0].trim();
  }

  // Fallback to checking other headers
  const forwardedSsl = req.header('x-forwarded-ssl');
  if (forwardedSsl === 'on') {
    return 'https';
  }

  //Check if the original URL had https
  const url = new URL(req.url);
  return url.protocol.replace(':', '');
};

// TODO 2: Utility function to get the real host from the proxy headers

const getRealHost = (c: Context): string => {
  const req = c.req;
  //Try forwarded host first
  const forwardedHost = req.header('x-forwarded-host');
  if (forwardedHost) {
    return forwardedHost.split(',')[0].trim();
  }

  // Fallback to the host header
  return req.header('host') || 'localhost';
};

//TODO 3: Main function to construct the proper callback URL
export const buildCallbackURL = (c: Context, path: string = '/auth/google'): string => {
  const protocol = getRealProtocol(c);
  const host = getRealHost(c);

  // In prod, always force HTTPS regardless of what we detect
  const finalProtocol = process.env.NODE_ENV === 'production' ? 'https' : protocol;

  const newURL = `${finalProtocol}://${host}${path}`;

  console.log(`\n\nThis is the new URL: ${newURL}\n\n`);

  return newURL;
};
