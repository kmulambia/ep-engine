import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Bank, BankRelations, VendorAccount} from '../models';
import {VendorAccountRepository} from './vendor-account.repository';

export class BankRepository extends DefaultCrudRepository<
  Bank,
  typeof Bank.prototype.id,
  BankRelations
> {

  public readonly vendorAccounts: HasManyRepositoryFactory<VendorAccount, typeof Bank.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('VendorAccountRepository') protected vendorAccountRepositoryGetter: Getter<VendorAccountRepository>,
  ) {
    super(Bank, dataSource);
    this.vendorAccounts = this.createHasManyRepositoryFactoryFor('vendorAccounts', vendorAccountRepositoryGetter,);
    this.registerInclusionResolver('vendorAccounts', this.vendorAccounts.inclusionResolver);
  }
}
