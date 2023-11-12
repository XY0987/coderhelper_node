import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  userEmail: string;
  @ApiProperty()
  password: string;
}

export class SignUpDto {
  @ApiProperty()
  userEmail: string;
  @ApiProperty()
  code: number;
  @ApiProperty()
  password: string;
}

export class EditPasswordDto {
  @ApiProperty()
  userEmail: string;
  @ApiProperty()
  code: number;
  @ApiProperty()
  password: string;
}
