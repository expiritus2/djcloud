import { format as dateFnsFormat, parseISO } from 'date-fns';
import formatDuration from 'format-duration';

export const getDuration = (durationSeconds: number) => {
  return formatDuration(durationSeconds * 1000, { leading: true });
};

export enum DateFormat {
  dd_MMMM_yyyy_HH_mm = 'dd MMMM yyyy HH:mm',
  dd_MMMM_yyyy = 'dd MMMM yyyy',
  dd_MM_yyyy = 'dd MMM yyyy HH:mm',
}

export const formatDate = (date: string, format: DateFormat = DateFormat.dd_MM_yyyy) => {
  return dateFnsFormat(parseISO(date), format);
};
