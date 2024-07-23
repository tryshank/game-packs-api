import { Test, TestingModule } from '@nestjs/testing';
import { PacksController } from './packs.controller';
import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PacksController', () => {
  let controller: PacksController;
  let service: PacksService;

  const mockPacksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findContent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacksController],
      providers: [
        {
          provide: PacksService,
          useValue: mockPacksService,
        },
      ],
    }).compile();

    controller = module.get<PacksController>(PacksController);
    service = module.get<PacksService>(PacksService);
  });

  describe('create', () => {
    it('should create a new pack', async () => {
      const createPackDto: CreatePackDto = {
        id: 'pack.new',
        packName: 'New Pack',
        content: ['item.new'],
        childPackIds: [],
        active: true,
        price: 10,
      };
      mockPacksService.create.mockResolvedValue(createPackDto);

      const result = await controller.create(createPackDto);
      expect(result).toEqual(createPackDto);
      expect(mockPacksService.create).toHaveBeenCalledWith(createPackDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of packs', async () => {
      const packs = [{ id: 'pack1', packName: 'Pack 1', content: ['item1'], childPackIds: [], active: true, price: 10 }];
      mockPacksService.findAll.mockResolvedValue(packs);

      const result = await controller.findAll();
      expect(result).toEqual(packs);
    });
  });

  describe('findContent', () => {
    it('should return the content of a pack including its child packs', async () => {
      const content = ['item1', 'item2'];
      mockPacksService.findContent.mockResolvedValue(content);

      const result = await controller.findContent('pack1');
      expect(result).toEqual(content);
    });

    it('should throw a BadRequestException if ID parameter is missing', async () => {
      await expect(() => controller.findContent('')).toThrow(BadRequestException);
    });
  });
});
