import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {DocumentationType, DocumentationTypeRelations, Documentation} from '../models';
import {DocumentationRepository} from './documentation.repository';

export class DocumentationTypeRepository extends DefaultCrudRepository<
  DocumentationType,
  typeof DocumentationType.prototype.id,
  DocumentationTypeRelations
> {

  public readonly documentations: HasManyRepositoryFactory<Documentation, typeof DocumentationType.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DocumentationRepository') protected documentationRepositoryGetter: Getter<DocumentationRepository>,
  ) {
    super(DocumentationType, dataSource);
    this.documentations = this.createHasManyRepositoryFactoryFor('documentations', documentationRepositoryGetter,);
    this.registerInclusionResolver('documentations', this.documentations.inclusionResolver);
  }
}
