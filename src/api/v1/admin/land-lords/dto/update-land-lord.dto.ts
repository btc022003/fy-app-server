import { PartialType } from '@nestjs/swagger';
import { CreateLandLordDto } from './create-land-lord.dto';

export class UpdateLandLordDto extends PartialType(CreateLandLordDto) {}
