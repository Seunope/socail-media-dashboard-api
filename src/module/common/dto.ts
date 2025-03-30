import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseData {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Action was successful' })
  message: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @IsNotEmpty()
  data: any;

  @IsOptional()
  token?: string;
}
