import { IsString, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackDto {
  @ApiProperty({ example: 'pack.school', description: 'The unique identifier for the pack' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'The School Pack', description: 'The name of the pack' })
  @IsString()
  packName!: string;

  @ApiProperty({ example: true, description: 'Whether the pack is active' })
  @IsBoolean()
  active!: boolean;

  @ApiProperty({ example: 10, description: 'The price of the pack' })
  @IsNumber()
  price!: number;

  @ApiProperty({ example: ['furniture.whiteboard'], description: 'The content of the pack' })
  @IsArray()
  @IsString({ each: true })
  content!: string[];

  @ApiProperty({ example: ['pack.classroom', 'pack.playground'], description: 'The child pack IDs' })
  @IsArray()
  @IsString({ each: true })
  childPackIds!: string[];
}
