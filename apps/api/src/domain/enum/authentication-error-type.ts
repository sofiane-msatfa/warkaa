export enum AuthenticationErrorType {
  UnsupportedIdentifier = "Unsupported identifier",
  AuthorizationNotFound = "Authorization header not found",
  Unauthorized = "Unauthorized",
  EmailAlreadyExists = "Email already exists",
  UserCreationFailed = "User creation failed",
  UserNotFound = "User not found",
  TokenExpired = "Token expired",
  InvalidRefreshToken = "Invalid refresh token",
}
