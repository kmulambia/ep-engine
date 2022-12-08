import {
  BindingScope,
  config,
  ContextTags,
  injectable,
  Provider
} from '@loopback/core';
import multer from 'multer';
import {FILE_SERVICE} from '../keys';
import {FileHandler} from '../types';

/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FILE_SERVICE},
})
export class FileUploadProvider implements Provider<FileHandler> {
  constructor(@config() private options: multer.Options = {}) {
    if (!this.options.storage) {
      // Default to in-memory storage
      this.options.storage = multer.memoryStorage();
    }
  }

  value(): FileHandler {
    return multer(this.options).any();
  }
}
