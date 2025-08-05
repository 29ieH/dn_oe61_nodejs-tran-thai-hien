import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { randomUUID } from 'crypto';

type SwaggerPrimitive =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

interface CreateSuccessResponseOptions<T> {
  isArray?: boolean;
  exampleMessage?: string;
  examplePayload?: T | T[];
}

export interface SuccessResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  payload: T;
}

export function createSuccessResponseDto<T>(
  PayloadType: Type<T> | SwaggerPrimitive,
  options?: CreateSuccessResponseOptions<T>,
): Type<SuccessResponse<T | T[]>> {
  const isArray = options?.isArray ?? false;

  class DynamicSuccessResponse implements SuccessResponse<T | T[]> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({
      example: options?.exampleMessage ?? 'Request was successful',
    })
    message: string;

    @ApiProperty({
      type: PayloadType,
      isArray,
      example: options?.examplePayload ?? (isArray ? [] : {}),
    })
    payload: T | T[];
  }

  const typeName =
    typeof PayloadType === 'function' ? PayloadType.name : 'Primitive';
  const shortId = randomUUID().split('-')[0];

  Object.defineProperty(DynamicSuccessResponse, 'name', {
    value: `SuccessResponse_${typeName}_${isArray ? 'Array' : ''}_${shortId}`,
  });
  return DynamicSuccessResponse;
}
