import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import { Count, CountSchema, Filter, FilterExcludingWhere, model, property, repository, Where } from '@loopback/repository';
import { del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody, response } from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { User } from '../models';
import { Credentials, OtpRepository, RoleRepository, UserRepository, LogRepository } from '../repositories';
import { PasswordHasher, validateCredentials } from '../services';
import { CredentialsRequestBody, UserProfileSchema, ForgotPasswordRequestBody } from './specs/user-controller.specs';
import _ from 'lodash';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../keys';
import { basicAuthorization } from '../middlewares/auth.midd';
import useMailerService from '../services/mailer.service';



const moment = require('moment');
const mailerService = useMailerService();

@model()
export class request extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @repository(OtpRepository) public optRepository: OtpRepository,
    @repository(LogRepository) public logRepository: LogRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {
  }

  // SIGN UP USER
  @post('/users/sign-up', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signup(
    @requestBody(CredentialsRequestBody)
    request: Credentials,
  ): Promise<User> {
    /*make first sign up admin user*/
    if ((await this.userRepository.find()).length == 0) {
      request.roleId = 'ADMIN1';//admin role 
      request.acl = ["UMFA"];
    } else {
      request.roleId = 'USER1';//user role
      request.status = false;
      request.acl = ["UMRU"];
    }
    /***/
    validateCredentials(_.pick(request, ['email', 'password']));
    const password = await this.passwordHasher.hashPassword(
      request.password,
    );
    try {
      const userDetails = await this.userRepository.create(
        _.omit(request, 'password'),
      );
      await this.userRepository
        .userCredentials(userDetails.id)
        .create({ password });
      var roleDetails = await this.roleRepository.findById(userDetails.roleId);
      /*send email*/
      mailerService({
        template: "welcome-email-umodzisource",
        metadata: {
          username: userDetails.username,
          email: userDetails.email,
          password: request.password,
          phone: userDetails.phone,
          role: roleDetails.name
        }
      });
      /***/
      return userDetails;
    } catch (error) {
      // duplicate key
      if (error.code == '23505' && error.detail.includes('already exists.')) {
        throw new HttpErrors.Conflict(error.detail);
      } else {
        throw error;
      }
    }
  }
  // SIGNIN USER
  @post('/users/sign-in', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async signin(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ user: object, token: object }> {
    try {
      // ensure the user exists, and the password is correct
      const user = await this.userService.verifyCredentials(credentials);
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);
      //get user roles
      var userDetails = await this.userRepository.findById(user.id, {
        include: ['acls', 'role']
      });
      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);

      if (userDetails) {
        /**audit-logs*/
        this.logRepository.create({
          actor: "USER",
          action: "SIGIN",
          entity: userDetails,
          entityId: userProfile.id,
          before: { "email": credentials.email, password: '***********' },
          status: true,
          after: userDetails
        });
        /******/
      }
      return { user: userDetails, token: { id: token, expire: 3600 } };
    }
    catch (error) {
      throw new HttpErrors.Unauthorized(error);
    }
  }
  // PING USER
  @get('/users/ping', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findById(userId, {
      include: ['acls']
    });
  }

  // USER MANAGEMENT
  ///REGISTER USER
  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async register(
    @requestBody(CredentialsRequestBody)
    request: Credentials,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(userId);
    const password = await this.passwordHasher.hashPassword(
      request.password,
    );
    try {
      const userDetails = await this.userRepository.create(
        _.omit(request, 'password'),
      );
      await this.userRepository
        .userCredentials(userDetails.id)
        .create({ password }).then(() => {
          //send email or sms
        });
      var roleDetails = await this.roleRepository.findById(userDetails.roleId);
      /*send email*/
      mailerService({
        template: "welcome-email-umodzisource",
        metadata: {
          username: userDetails.username,
          email: userDetails.email,
          password: request.password,
          phone: userDetails.phone,
          role: roleDetails.name
        }
      });
      /****/
      /**audit-logs*/
      this.logRepository.create({
        actor: "USER",
        action: "REGISTER-USER",
        entity: currentUser,
        entityId: currentUser.id,
        before: {},
        status: true,
        after: userDetails
      });
      /******/

      return userDetails;
    } catch (error) {
      // duplicate key
      if (error.code == '23505' && error.detail.includes('already exists.')) {
        throw new HttpErrors.Conflict(error.detail);
      } else {
        throw error;
      }
    }
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async updateAll(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    const userId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(userId);
    var beforeUserDetails = await this.userRepository.findById(user.id);
    var userDetails = await this.userRepository.updateAll(user, where);

    /**audit-logs*/
    this.logRepository.create({
      actor: "USER",
      action: "UPDATE-USER",
      entity: currentUser,
      entityId: currentUser.id,
      before: beforeUserDetails,
      status: true,
      after: userDetails
    });
    /******/

    return userDetails;
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
  ): Promise<void> {
    const userId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(userId);
    var beforeUserDetails = await this.userRepository.findById(id);
    var userDetails = await this.userRepository.updateById(id, user);
    /**audit-logs*/
    this.logRepository.create({
      actor: "USER",
      action: "UPDATE-USER",
      entity: currentUser,
      entityId: currentUser.id,
      before: beforeUserDetails,
      status: true,
      after: userDetails
    });
    /******/
    return userDetails
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  @authorize({
    allowedRoles: ["ADMIN1"],
    voters: [basicAuthorization],
  })
  /***/
  async deleteById(@inject(SecurityBindings.USER)
  currentUserProfile: UserProfile, @param.path.string('id') id: string): Promise<void> {
    const userId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(userId);
    var beforeUserDetails = await this.userRepository.findById(id);
    /**audit-logs*/
    this.logRepository.create({
      actor: "USER",
      action: "DELETE-USER",
      entity: currentUser,
      entityId: currentUser.id,
      before: beforeUserDetails,
      status: true,
      after: {}
    });
    /******/
    await this.userRepository.deleteById(id);
  }


  ///FORGOT PASSWORD
  @post('/users/forgot-password', {
    responses: {
      '204': {
        description: 'forgot user password',
      },
    },
  })
  /***/
  async recoverPassword(
    @requestBody(ForgotPasswordRequestBody) request: { email: string },
  ): Promise<void> {

    const user = await this.userRepository.findOne({ where: { email: request.email } });

    if (user) {
      /*create otp */
      const otp = await this.optRepository.create({ code: Math.floor(100000 + Math.random() * 900000), userId: user.id, status: false });
      /*send email*/
      mailerService({
        template: "password-reset-email-umodzisource",
        metadata: {
          id: otp.id,
          otp: otp.code,
          email: user.email,
          username: user.username
        }
      });
      /**audit-logs*/
      this.logRepository.create({
        actor: "USER",
        action: "PASSWORD-RECOVERY-REQUEST",
        entity: user,
        entityId: user.id,
        before: {},
        status: true,
        after: {}
      });
      /******/
    }
  }

  ///RECOVER PASSWORD
  @post('/users/reset-password', {
    responses: {
      '204': {
        description: 'reset user password',
      },
    },
  })
  /***/
  async resetPassword(
    @requestBody() request: { token: string, password: string },
  ): Promise<void> {

    const otp = await this.optRepository.findById(request.token,);
    if (otp) {
      if (moment() < moment(otp.created).add(900, 'seconds') && otp.status == false) {
        otp.status = true;
        const user = await this.userRepository.findById(otp.userId);
        const passwordHash = await this.passwordHasher.hashPassword(
          request.password,
        );
        await this.userRepository
          .userCredentials(otp.userId)
          .patch({ password: passwordHash });

        await this.optRepository.updateById(otp.id, otp);

        mailerService({
          template: "password-changed-email-umodzisource",
          metadata: {
            email: user.email,
            username: user.username
          }
        });

        /**audit-logs*/
        this.logRepository.create({
          actor: "USER",
          action: "PASSWORD-RESET",
          entity: user,
          entityId: user.id,
          before: {},
          status: true,
          after: {}
        });
        /******/
      }
      else {
        throw new HttpErrors.Unauthorized('expired password reset token');
      }
    }
    else {
      throw new HttpErrors.Unauthorized('invalid password reset token');
    }
  }

  ///CHANGE PASSWORD
  @patch('/users/change-password', {
    responses: {
      '200': {
        description: 'successfully changed password',
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async updatePassword(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody() request: { password: string },
  ): Promise<string> {
    const currentUserId = currentUserProfile[securityId];
    if (!currentUserId) {
      throw new HttpErrors.Unauthorized(
        'you have to log in first to change your password',
      );
    }
    var currentUser = await this.userRepository.findById(currentUserId);
    const passwordHash = await this.passwordHasher.hashPassword(
      request.password,
    );
    try {
      await this.userRepository
        .userCredentials(currentUserId)
        .patch({ password: passwordHash });

        /**audit-logs*/
        this.logRepository.create({
          actor: "USER",
          action: "PASSWORD-CHANGE",
          entity: currentUser ,
          entityId:currentUserId,
          before: {},
          status: true,
          after: {}
        });
        /******/
    } catch (e) {
      return e;
    }
    return 'Password change successful';
  }
}
