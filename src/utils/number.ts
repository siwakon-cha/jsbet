import { isUndefined } from 'lodash';

export const numberWithCommas = (
  x: any,
  hideDigit?: boolean,
  digit?: number,
) => {
  return !isUndefined(x)
    ? new Intl.NumberFormat('en-US', {
        maximumFractionDigits: digit ?? 2,
        minimumFractionDigits: hideDigit ? 0 : 2,
      }).format(Number(x))
    : 0;
};
