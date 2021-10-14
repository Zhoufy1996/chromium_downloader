import formatDuration from 'format-duration';

/* eslint-disable import/prefer-default-export */
export const sleep = (timeount = 300) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, timeount);
  });
};

export const calculateRestTime = (allCount: number, startIndex: number) => {
  let startTime = new Date().getTime();
  let lastTime = 0;

  const getRestTime = (currentIndex: number) => {
    const now = new Date().getTime();
    if (currentIndex - startIndex === 0) {
      return null;
    }
    const speed = (now - startTime + lastTime) / (currentIndex - startIndex);
    const restTime = speed * (allCount - currentIndex);
    return formatDuration(restTime);
  };
  const pause = () => {
    lastTime = new Date().getTime() - startTime + lastTime;
  };
  const continueFn = () => {
    startTime = new Date().getTime();
  };

  return {
    getRestTime,
    pause,
    continue: continueFn,
  };
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
