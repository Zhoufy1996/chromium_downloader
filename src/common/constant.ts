/* eslint-disable import/prefer-default-export */
export const chromeFoldName = '.chrome';

export const userDataFoldName =
  process.env.NODE_ENV === 'development'
    ? 'chromium-downloder-dev'
    : 'chromium-downloder';
