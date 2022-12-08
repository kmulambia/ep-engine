import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Otp, OtpRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class OtpRepository extends DefaultCrudRepository<
  Otp,
  typeof Otp.prototype.id,
  OtpRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Otp.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Otp, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
