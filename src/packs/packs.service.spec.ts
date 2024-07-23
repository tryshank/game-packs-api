import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { PacksService } from './packs.service';
import { Pack } from './pack.entity';
import { CreatePackDto } from './dto/create-pack.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockPackRepository = (): MockRepository<Pack> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('PacksService', () => {
  let service: PacksService;
  let repository: MockRepository<Pack>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacksService,
        { provide: getRepositoryToken(Pack), useValue: mockPackRepository() },
      ],
    }).compile();

    service = module.get<PacksService>(PacksService);
    repository = module.get<MockRepository<Pack>>(getRepositoryToken(Pack));
  });
  
  // TODO: should throw an error if a pack with the same ID already exists
  describe('create', () => {
    it('should create a new pack', async () => {
      const newPackDto: CreatePackDto = {
        id: 'pack.new',
        packName: 'New Pack',
        active: true,
        price: 10.99,
        content: ['item1', 'item2'],
        childPackIds: [],
      };

      repository.find?.mockResolvedValueOnce([]);
      repository.create?.mockReturnValue(newPackDto);
      repository.save?.mockResolvedValueOnce(newPackDto);

      const result = await service.create(newPackDto);
      expect(result).toEqual(newPackDto);
    });

    it('should throw an error if a child pack does not exist', async () => {
      const newPackDto: CreatePackDto = {
        id: 'pack.new',
        packName: 'New Pack',
        active: true,
        price: 10.99,
        content: ['item1', 'item2'],
        childPackIds: ['pack.nonexistent'],
      };

      repository.find?.mockResolvedValueOnce([]); // No child packs found

      await expect(service.create(newPackDto)).rejects.toThrow(
        new BadRequestException('One or more child packs do not exist'),
      );
    });
  });
  
  // TODO: add should throw an error if the pack does not exist
  describe('findContent', () => {
    it('should return the content of the pack including its child packs recursively', async () => {
      const packSchool = {
        id: 'pack.school',
        content: ['furniture.whiteboard'],
        childPackIds: ['pack.classroom', 'pack.playground'],
      };
      const packClassroom = {
        id: 'pack.classroom',
        content: ['furniture.desk'],
        childPackIds: [],
      };
      const packPlayground = {
        id: 'pack.playground',
        content: ['toy.ball'],
        childPackIds: [],
      };

      repository.findOne?.mockResolvedValueOnce(packSchool)
        .mockResolvedValueOnce(packClassroom)
        .mockResolvedValueOnce(packPlayground);

      const result = await service.findContent('pack.school');
      expect(result).toEqual(['furniture.whiteboard', 'furniture.desk', 'toy.ball']);
    });

    it('should return an empty array if the pack has no content', async () => {
      const pack = {
        id: 'pack.empty',
        content: [],
        childPackIds: [],
      };

      repository.findOne?.mockResolvedValueOnce(pack);

      const result = await service.findContent('pack.empty');
      expect(result).toEqual([]);
    });
  });
});
