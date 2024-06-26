import { apiServer } from 'settings/web-services/api';
import {
  CreateTrackDto,
  GetTrackDto,
  RemoveTrackDto,
  UpdateTrackDto,
} from 'store/ModifyTrack/types';
import { SendToTelegramDto, TrackGenreParams } from 'store/Tracks/types';
import { PaginationParams } from 'types/request';

export const getAll = (cfg: PaginationParams) => {
  return apiServer.get('/tracks/list', { params: cfg });
};

export const getTracksGenres = (cfg: TrackGenreParams) => {
  return apiServer.get('/tracks/tracks-genres', { params: cfg });
};

export const create = (cfg: CreateTrackDto) => {
  return apiServer.post('/tracks/create', cfg);
};

export const update = (cfg: UpdateTrackDto) => {
  const { id, ...config } = cfg;
  return apiServer.patch(`/tracks/${id}`, config);
};

export const remove = (cfg: RemoveTrackDto) => {
  return apiServer.delete(`/tracks/${cfg.id}`);
};

export const archive = (cfg: RemoveTrackDto) => {
  const { id, ...body } = cfg;
  return apiServer.patch(`/tracks/${id}/archive`, body);
};

export const getById = (cfg: GetTrackDto) => {
  return apiServer.get(`/tracks/${cfg.id}`);
};

export const sendToTelegram = (cfg: SendToTelegramDto) => {
  return apiServer.post(`/tracks/send-to-telegram`, cfg);
};
