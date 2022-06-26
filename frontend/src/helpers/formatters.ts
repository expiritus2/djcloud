import formatDuration from 'format-duration';
import { format as dateFnsFormat, parseISO } from 'date-fns';

export const getDuration = (durationSeconds: number) => {
    return formatDuration(durationSeconds * 1000, { leading: true });
};

export enum DateFormat {
    dd_MM_yyyy_HH_mm = 'dd-MM-yyyy HH:mm',
}

export const formatDate = (date: string, format: DateFormat = DateFormat.dd_MM_yyyy_HH_mm) => {
    return dateFnsFormat(parseISO(date), format);
};
