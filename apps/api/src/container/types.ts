export const Type = {
  // repositories
  UserRepository: Symbol.for("UserRepository"),
  BranchRepository: Symbol.for("BranchRepository"),
  EnterpriseRepository: Symbol.for("EnterpriseRepository"),
  EstablishmentRepository: Symbol.for("EstablishmentRepository"),
  
  // services
  AuthService: Symbol.for("AuthService"),
  CsvProcessorService: Symbol.for("CsvProcessorService"),
  UploadServiceFactory: Symbol.for("UploadServiceFactory"),
  ProcessorSubscriptionService: Symbol.for("ProcessorSubscriptionService"),

  // externals
  MessengerApi: Symbol.for("MessengerApi"),
};
