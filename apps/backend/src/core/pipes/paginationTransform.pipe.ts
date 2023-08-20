import { plainToInstance } from 'class-transformer';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationRequestDto } from '../dtos/paginationRequest.dto';

@Injectable()
export class PaginationTransformPipe implements PipeTransform {
  async transform(dto: PaginationRequestDto, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return dto;
    }

    return plainToInstance(metatype, dto);
  }
}
