import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  Request,
  RestBindings,
  Response,
} from '@loopback/rest';
import { authenticate } from 'loopback4-authentication';
import path from 'path';
import { FILE_SERVICE, STORAGE_DIRECTORY } from '../keys';
import { File } from '../models';
import { FileRepository } from '../repositories';
import { FileHandler } from '../types';

export class FileController {
  constructor(
    @inject(FILE_SERVICE) private handler: FileHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @repository(FileRepository)
    public fileRepository: FileRepository,
  ) { }

  @post('/files')
  @response(200, {
    description: 'File model instance',
    content: { 'application/json': { schema: getModelSchemaRef(File) } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {
            title: 'NewFile',
            exclude: ['id'],
          }),
        },
      },
    })
    file: Omit<File, 'id'>,
  ): Promise<File> {
    return this.fileRepository.create(file);
  }

  @get('/files/count')
  @response(200, {
    description: 'File model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async count(
    @param.where(File) where?: Where<File>,
  ): Promise<Count> {
    return this.fileRepository.count(where);
  }

  @get('/files')
  @response(200, {
    description: 'Array of File model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(File, { includeRelations: true }),
        },
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async find(
    @param.filter(File) filter?: Filter<File>,
  ): Promise<File[]> {
    return this.fileRepository.find(filter);
  }

  @patch('/files')
  @response(200, {
    description: 'File PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, { partial: true }),
        },
      },
    })
    file: File,
    @param.where(File) where?: Where<File>,
  ): Promise<Count> {
    return this.fileRepository.updateAll(file, where);
  }

  @get('/files/{id}')
  @response(200, {
    description: 'File model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(File, { includeRelations: true }),
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async findById(
    @param.path.number('id') id: number,
    @param.filter(File, { exclude: 'where' }) filter?: FilterExcludingWhere<File>
  ): Promise<File> {
    return this.fileRepository.findById(id, filter);
  }

  @patch('/files/{id}')
  @response(204, {
    description: 'File PATCH success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, { partial: true }),
        },
      },
    })
    file: File,
  ): Promise<void> {
    await this.fileRepository.updateById(id, file);
  }

  @put('/files/{id}')
  @response(204, {
    description: 'File PUT success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() file: File,
  ): Promise<void> {
    await this.fileRepository.replaceById(id, file);
  }
  // File uploads

  @del('/files/{id}')
  @response(204, {
    description: 'File DELETE success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    var fs = require('fs');
    await this.fileRepository.findById(id).then(file => {
      fs.unlinkSync(path.join(__dirname, '../../uploads/') + file.url);
      this.fileRepository.deleteById(id);
    })
  }
  @post('/files/upload')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
    description: 'Files and fields',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async upload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          let fileFields = FileController.getFilesAndFields(request);
          //insert many files
          fileFields.files.forEach(file => {
            try {
              fileFields.fields.url = (<File>file).url
              fileFields.fields.encoding = (<File>file).encoding
              fileFields.fields.size = (<File>file).size
              fileFields.fields.mimetype = (<File>file).mimetype
              // insert file
              this.fileRepository.create({}).then(file => { });
            } catch (error) {
            }
          })
          resolve(fileFields.fields);
        }
      });
    });
  }

  // Helpers
  /**
   * Get files and fields for the request
   * @param request - Http request
   */

  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      name: typeof f.fieldname == "undefined" ? "" : f.fieldname,
      url: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });

    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return { files, fields: request.body };
  }
}
