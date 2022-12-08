import { inject, Getter, Constructor } from '@loopback/core';
import { DefaultCrudRepository, repository, HasOneRepositoryFactory, ReferencesManyAccessor, BelongsToAccessor} from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { User, UserRelations, UserCredentials, Acl, Role} from '../models';
import { UserCredentialsRepository } from './user-credentials.repository';
import { AclRepository } from './acl.repository';
import { AuthenticationBindings} from '@loopback/authentication';
import { AuditRepositoryMixin, IAuditMixinOptions } from '@sourceloop/audit-log';
import {securityId, UserProfile} from '@loopback/security';
import {RoleRepository} from './role.repository';

export type Credentials = {
  email: string;
  password: string;
  roleId?: string;
  acl?: string[]
  status?: boolean
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;
  public readonly acls: ReferencesManyAccessor<Acl, typeof User.prototype.id>;

  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('AclRepository') protected aclRepositoryGetter: Getter<AclRepository>,
   @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.acls = this.createReferencesManyAccessorFor('acls', aclRepositoryGetter,);
    this.registerInclusionResolver('acls', this.acls.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
