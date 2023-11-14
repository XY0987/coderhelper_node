import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  projectName: string;
  @ApiProperty()
  projectDesc: string;
  @ApiProperty()
  projectApiUrl: string;
  @ApiProperty()
  projectBaseUrl: string;
  @ApiProperty()
  projectIsPub: boolean;
  @ApiProperty()
  projectDemand: string;
}
