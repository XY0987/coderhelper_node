import { ApiProperty } from '@nestjs/swagger';

export class AddInterfaceDto {
  @ApiProperty()
  interfaceProjectId: number;
  @ApiProperty()
  interfaceName: string;
  @ApiProperty()
  interfaceType: string;
  @ApiProperty()
  interfaceData: string;
  @ApiProperty()
  interfaceRes: string;
  @ApiProperty()
  interfaceDutyUser: string;
  @ApiProperty()
  interfaceStatus: number;
  @ApiProperty()
  interfaceDocs: string;
  @ApiProperty()
  interfaceConfig: string;
}

export class EditInterfaceDto {
  @ApiProperty()
  interfaceProjectId: number;
  @ApiProperty()
  interfaceId: number;
  @ApiProperty()
  interfaceName: string;
  @ApiProperty()
  interfaceType: string;
  @ApiProperty()
  interfaceData: string;
  @ApiProperty()
  interfaceRes: string;
  @ApiProperty()
  interfaceDutyUser: number;
  @ApiProperty()
  interfaceStatus: number;
  @ApiProperty()
  interfaceDocs: string;
  @ApiProperty()
  interfaceConfig: string;
}
