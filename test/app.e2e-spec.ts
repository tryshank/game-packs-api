import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pack } from '../src/packs/pack.entity';

describe('PacksController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Pack>;

  beforeAll(async () => {
    jest.setTimeout(20000); // Increase timeout for initialization
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Pack>>(getRepositoryToken(Pack));
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    await repository.query('TRUNCATE TABLE pack CASCADE');
  });

  it('/packs (POST) should create a new pack', async () => {
    const newPack = {
      id: 'pack.new',
      packName: 'New Pack',
      active: true,
      price: 10.99,
      content: ['item1', 'item2'],
      childPackIds: [],
    };

    return request(app.getHttpServer())
      .post('/packs')
      .send(newPack)
      .expect(201)
      .expect(({ body }: { body: Pack }) => {
        expect(body).toEqual(expect.objectContaining(newPack));
      });
  });

  it('/packs (GET) should return an array of packs', async () => {
    const pack1 = repository.create({
      id: 'pack1',
      packName: 'Pack 1',
      active: true,
      price: 10.99,
      content: ['item1'],
      childPackIds: [],
    });

    const pack2 = repository.create({
      id: 'pack2',
      packName: 'Pack 2',
      active: true,
      price: 15.99,
      content: ['item2'],
      childPackIds: [],
    });

    await repository.save([pack1, pack2]);

    return request(app.getHttpServer())
      .get('/packs')
      .expect(200)
      .expect(({ body }: { body: Pack[] }) => {
        expect(body.length).toBe(2);
        expect(body).toEqual(expect.arrayContaining([expect.objectContaining(pack1), expect.objectContaining(pack2)]));
      });
  });

  it('/packs/:id/content (GET) should return the content of a pack including its child packs', async () => {
    const packSchool = {
      id: 'pack.school',
      packName: 'School Pack',
      active: true,
      price: 20.99,
      content: ['furniture.whiteboard'],
      childPackIds: ['pack.classroom', 'pack.playground'],
    };

    const packClassroom = {
      id: 'pack.classroom',
      packName: 'Classroom Pack',
      active: true,
      price: 15.99,
      content: ['furniture.desk'],
      childPackIds: [],
    };

    const packPlayground = {
      id: 'pack.playground',
      packName: 'Playground Pack',
      active: true,
      price: 10.99,
      content: ['toy.ball'],
      childPackIds: [],
    };

    await repository.save([packSchool, packClassroom, packPlayground]);

    return request(app.getHttpServer())
      .get('/packs/pack.school/content')
      .expect(200)
      .expect(({ body }: { body: string[] }) => {
        expect(body).toEqual(['furniture.whiteboard', 'furniture.desk', 'toy.ball']);
      });
  });

  it('/packs/:id/content (GET) should throw a NotFoundException if the pack does not exist', async () => {
    return request(app.getHttpServer())
      .get('/packs/pack.nonexistent/content')
      .expect(404);
  });
});
