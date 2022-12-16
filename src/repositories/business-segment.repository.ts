import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {BusinessSegment, BusinessSegmentRelations} from '../models';

export class BusinessSegmentRepository extends DefaultCrudRepository<
  BusinessSegment,
  typeof BusinessSegment.prototype.id,
  BusinessSegmentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(BusinessSegment, dataSource);
  }
}
