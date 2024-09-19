export const Type = {
  // repositories
  UserRepository: Symbol.for("UserRepository"),
  BranchRepository: Symbol.for("BranchRepository"),
  
  // services
  AuthService: Symbol.for("AuthService"),
  CsvProcessorService: Symbol.for("CsvProcessorService"),
  UploadServiceFactory: Symbol.for("UploadServiceFactory"),

  // externals
  MessengerApi: Symbol.for("MessengerApi"),
};
