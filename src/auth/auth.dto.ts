import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  userEmail: string;
  password: string;
}

export class SignUpDto {
  userEmail: string;
  code: number;
  password: string;
}
