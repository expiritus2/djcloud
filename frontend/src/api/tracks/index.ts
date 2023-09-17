import { groupBy } from 'lodash';
import { apiServer } from 'settings/web-services/api';
import { CreateTrackDto, GetTrackDto, RemoveTrackDto, UpdateTrackDto } from 'store/ModifyTrack/types';
import { SendToTelegramDto, TrackGenreParams } from 'store/Tracks/types';
import { PaginationParams } from 'types/request';

import { firestore } from '../../firestore';

const COLLECTION_NAME = 'tracks';

export class Tracks {
    static async getAll(cfg: PaginationParams) {
        const docs = await firestore.getDocuments(COLLECTION_NAME, cfg);
        return { data: { data: docs } };
    }

    static async getTracksGenres(cfg: TrackGenreParams) {
        const tracks = await Tracks.getAll({ filters: cfg.filters });
        const groupedTracksByCategory = groupBy(tracks.data.data, (track) => track.category.id);
        const reduced = Object.entries(groupedTracksByCategory).reduce((acc, [categoryId, track]) => {
            return { ...acc, [categoryId]: track.map((t) => ({ ...t.genre })) };
        }, {});

        return { data: reduced };
    }

    static async create(cfg: CreateTrackDto) {
        const result = await firestore.addDocument(COLLECTION_NAME, cfg);
        return result.id;
    }

    static async update(cfg: UpdateTrackDto) {
        const { id, ...config } = cfg;
        await firestore.updateDocument(COLLECTION_NAME, id, config);
        return Tracks.getById({ id });
    }

    static async remove({ id }: RemoveTrackDto) {
        await firestore.deleteDocument(COLLECTION_NAME, id);
        return { data: { data: 'Success' } };
    }

    static async archive({ id }: RemoveTrackDto) {
        return Tracks.update({ id, archive: true });
    }

    static async getById({ id }: GetTrackDto) {
        const category = await firestore.getDocument(COLLECTION_NAME, id);
        return { data: category };
    }

    static async sendToTelegram(cfg: SendToTelegramDto) {
        return apiServer.post(`/tracks/send-to-telegram`, cfg);
    }
}
