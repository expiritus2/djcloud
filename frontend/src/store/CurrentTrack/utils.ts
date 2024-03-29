import { adminPageTableLimit, mainPageMobileTrackLimit, mainPageTrackLimit } from 'settings';
import { sign } from 'settings/sign';
import { Track } from 'types/track';

import store from '..';

import { RequestPageTracksProps } from './types';

export const getCurrentTrackIndex = (): number => {
  const tracks = store.tracks.data?.data || [];
  const currentTrackData = store.currentTrack.data;
  return tracks.findIndex((track) => track.id === currentTrackData?.id);
};

export const getCurrentPageTracks = (): Track[] => {
  return store.tracks.data?.data || [];
};

export const isVeryLastTrack = (currentEndTrackIndex: number, tracks: Track[]): boolean => {
  return currentEndTrackIndex === tracks.length - 1;
};

export const isVeryFirstTrack = (currentEndTrackIndex: number): boolean => {
  return currentEndTrackIndex === 0;
};

export const isNotLastTrack = (currentTrackIndex: number, tracks: Track[]) => {
  return currentTrackIndex !== tracks.length - 1;
};

export const isNotFirstTrack = (currentTrackIndex: number) => {
  return currentTrackIndex > 0;
};

export const getTracksNextPage = (): number => {
  const tracksMeta = store.tracks.meta;
  const currentPage = tracksMeta.page || 0;
  return currentPage + 1;
};

export const getTracksPrevPage = (): number => {
  const tracksMeta = store.tracks.meta;
  const currentPage = tracksMeta.page || 0;
  return currentPage - 1;
};

export const getActualTrackIndex = (isMobile: boolean) => {
  const currentTrackIndex = getCurrentTrackIndex();
  const tracksMeta = store.tracks.meta;
  const currentPage = tracksMeta.page || 0;
  const limit = isMobile ? mainPageMobileTrackLimit : mainPageTrackLimit;
  return limit * currentPage + currentTrackIndex + 1;
};

export const isNotLastTrackOnLastPage = (actualTrackIndex: number) => {
  return store.tracks.data && actualTrackIndex < store.tracks.data?.count;
};

export const isNotFirstTrackOnFirstPage = (actualTrackIndex: number) => {
  return store.tracks.data && actualTrackIndex !== 1;
};

export const requestPageTracks = (
  { page: nextPage, isAdmin = false, isMobile = false }: RequestPageTracksProps,
  cb: Function
) => {
  const mainPageLimit = isMobile ? mainPageMobileTrackLimit : mainPageTrackLimit;
  store.tracks.getAll(
    { page: nextPage, limit: isAdmin ? adminPageTableLimit : mainPageLimit },
    {},
    cb
  );
};

export const setDocumentTitle = (title?: string) => {
  document.title = title ? `${sign} - ${title}` : sign;
};
