import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {User} from './models';
import {Credentials} from './repositories';
import {PasswordHasher} from './services';
import * as AMP_CONFIG from './services.config.json';
import {FileHandler} from './types';


export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = AMP_CONFIG.TOKEN.SECRET;
  export const TOKEN_EXPIRES_IN_VALUE = AMP_CONFIG.TOKEN.EXPIRES;
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}

//FILE//SERVICE
export const FILE_SERVICE =
   BindingKey.create<FileHandler>('services.FileUpload',);// Binding key for the storage directory
export const STORAGE_DIRECTORY = BindingKey.create<string>
   ('storage.directory');
