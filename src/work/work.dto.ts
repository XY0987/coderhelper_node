import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkDto {
  @ApiProperty()
  workProjectId: number;
  @ApiProperty()
  workName: string;
  @ApiProperty()
  workDesc: string;
  @ApiProperty()
  workUserId: number;
  @ApiProperty()
  workCreateTime: string;
  @ApiProperty()
  workEndTime: string;
  @ApiProperty()
  workStatus: number;
  @ApiProperty()
  workRaiseUserId: number;
  @ApiProperty()
  workVexation: number;
  @ApiProperty()
  workType: number;
}

export class EditWorkDto {
  @ApiProperty()
  workId: number;
  @ApiProperty()
  workProjectId: number;
  @ApiProperty()
  workName: string;
  @ApiProperty()
  workDesc: string;
  @ApiProperty()
  workUserId: number;
  @ApiProperty()
  workCreateTime: string;
  @ApiProperty()
  workEndTime: string;
  @ApiProperty()
  workStatus: number;
  @ApiProperty()
  workRaiseUserId: number;
  @ApiProperty()
  workVexation: number;
  @ApiProperty()
  workType: number;
}
