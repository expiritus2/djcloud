import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TrackEntity } from '../tracks/track.entity';

import { TrackRatingEntity } from './trackRating.entity';
import { TrackRatingsService } from './trackRatings.service';

describe('TrackRatingsService', () => {
  let service: TrackRatingsService;
  let mockTrackRatingsRepo;
  let mockTrackRepo;
  let mockQueryBuilder;
  const track = {
    id: 1,
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      getMany: jest.fn(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
    };
    mockTrackRatingsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    mockTrackRepo = {
      findOne: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        TrackRatingsService,
        {
          provide: getRepositoryToken(TrackRatingEntity),
          useValue: mockTrackRatingsRepo,
        },
        {
          provide: getRepositoryToken(TrackEntity),
          useValue: mockTrackRepo,
        },
      ],
    }).compile();

    service = module.get(TrackRatingsService);
  });

  it('can create an instance of trackRatings service', async () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    const newTrackRatings = {
      track: {
        id: 1,
      },
      rating: 10,
    };

    it('should add and return trackRating', async () => {
      mockTrackRepo.findOne.mockResolvedValueOnce(track);
      mockTrackRatingsRepo.create.mockReturnValueOnce(newTrackRatings);
      mockTrackRatingsRepo.save.mockReturnValue(newTrackRatings);
      mockQueryBuilder.getMany.mockReturnValue([{ trackId: 1, rating: 10 }]);

      const trackRating = await service.add({ trackId: track.id, rating: newTrackRatings.rating });

      expect(mockTrackRatingsRepo.create).toBeCalledWith(newTrackRatings);
      expect(mockTrackRatingsRepo.save).toBeCalledWith(newTrackRatings);
      expect(trackRating).toEqual({ trackId: 1, rating: 10, countRatings: 1 });
    });
  });

  describe('getByTrackId', () => {
    const trackRating = {
      track,
      rating: 10,
    };

    it('should add and return trackRating', async () => {
      mockQueryBuilder.getMany.mockResolvedValueOnce([trackRating]);

      const ratings = await service.getByTrackId(track.id);

      expect(mockTrackRatingsRepo.createQueryBuilder).toBeCalledWith('trackRatings');
      expect(mockQueryBuilder.leftJoinAndSelect).toBeCalledWith('trackRatings.track', 'track');
      expect(mockQueryBuilder.where).toBeCalledWith('trackRatings.trackId = :trackId', { trackId: track.id });
      expect(mockQueryBuilder.getMany).toBeCalled();
      expect(ratings).toEqual([trackRating]);
    });
  });
});
