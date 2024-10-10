export type MessengerSubscriptionCallback =
  | ((message: string) => void)
  | ((message: string) => Promise<void>);
