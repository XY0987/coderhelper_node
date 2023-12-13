import { ApiProperty } from '@nestjs/swagger';

export class CreateCodeTemDto {
  @ApiProperty()
  codeStr: string;
  @ApiProperty()
  codeType: string;
  @ApiProperty()
  codeTheme: string;
  @ApiProperty()
  codeDesc: string;
}

export class EditCodeTemDto {
  @ApiProperty()
  codeId: number;
  @ApiProperty()
  codeStr: string;
  @ApiProperty()
  codeType: string;
  @ApiProperty()
  codeTheme: string;
  @ApiProperty()
  codeDesc: string;
}
