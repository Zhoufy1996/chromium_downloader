/* eslint-disable import/prefer-default-export */
export const sleep = (timeount = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeount);
  });
};

export const debounce = <T extends unknown[], U>(
  cb: (...args: T) => PromiseLike<U> | U,
  wait: number
) => {
  let timer: NodeJS.Timeout;
  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        const result = cb(...args);
        resolve(result);
      }, wait);
    });
  };
};
