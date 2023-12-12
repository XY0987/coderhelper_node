import { ApiProperty } from '@nestjs/swagger';

export class CreateCodeTemDto {
  @ApiProperty()
  codeStr: string;
  @ApiProperty()
  codeType: string;
}
