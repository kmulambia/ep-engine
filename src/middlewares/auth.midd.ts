import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata } from '@loopback/authorization';
import { securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      'id',
      'username',
      'email',
      'roleId',
    ]);
    currentUser = { [securityId]: user.id, username: user.username, email: user.email, roleId: user.roleId };
  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roleId) {
    return AuthorizationDecision.DENY;
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  let aclIsAllowed = false;
  if (metadata.allowedRoles!.some(r => currentUser.roleId.indexOf(r) >= 0)

  ) {
    aclIsAllowed = true;
  }

  if (!aclIsAllowed) {
    return AuthorizationDecision.DENY;
  }

  return AuthorizationDecision.ALLOW;
}