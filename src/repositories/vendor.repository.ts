import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Vendor, VendorRelations, VendorType, VendorAccount, BusinessSegment, User, VendorUser} from '../models';
import {VendorTypeRepository} from './vendor-type.repository';
import {VendorAccountRepository} from './vendor-account.repository';
import {BusinessSegmentRepository} from './business-segment.repository';
import {VendorUserRepository} from './vendor-user.repository';
import {UserRepository} from './user.repository';

export class VendorRepository extends DefaultCrudRepository<
  Vendor,
  typeof Vendor.prototype.id,
  VendorRelations
> {

  public readonly vendorType: BelongsToAccessor<VendorType, typeof Vendor.prototype.id>;

  public readonly vendorAccounts: HasManyRepositoryFactory<VendorAccount, typeof Vendor.prototype.id>;

  public readonly businessSegment: BelongsToAccessor<BusinessSegment, typeof Vendor.prototype.id>;

  public readonly users: HasManyThroughRepositoryFactory<User, typeof User.prototype.id,
          VendorUser,
          typeof Vendor.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('VendorTypeRepository') protected vendorTypeRepositoryGetter: Getter<VendorTypeRepository>, @repository.getter('VendorAccountRepository') protected vendorAccountRepositoryGetter: Getter<VendorAccountRepository>, @repository.getter('BusinessSegmentRepository') protected businessSegmentRepositoryGetter: Getter<BusinessSegmentRepository>, @repository.getter('VendorUserRepository') protected vendorUserRepositoryGetter: Getter<VendorUserRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Vendor, dataSource);
    this.users = this.createHasManyThroughRepositoryFactoryFor('users', userRepositoryGetter, vendorUserRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.businessSegment = this.createBelongsToAccessorFor('businessSegment', businessSegmentRepositoryGetter,);
    this.registerInclusionResolver('businessSegment', this.businessSegment.inclusionResolver);
    this.vendorAccounts = this.createHasManyRepositoryFactoryFor('vendorAccounts', vendorAccountRepositoryGetter,);
    this.registerInclusionResolver('vendorAccounts', this.vendorAccounts.inclusionResolver);
    this.vendorType = this.createBelongsToAccessorFor('vendorType', vendorTypeRepositoryGetter,);
    this.registerInclusionResolver('vendorType', this.vendorType.inclusionResolver);
  }
}
