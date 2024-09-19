import "reflect-metadata";
import { Container, type interfaces } from "inversify";

export const container = new Container();

export function bindIdentifier<T>(
  identifier: interfaces.ServiceIdentifier<T>,
  instance: interfaces.Newable<T>
) {
  return container.bind(identifier).to(instance).inSingletonScope();
}

export function bindIdentifierNamed<T>(
  identifier: interfaces.ServiceIdentifier<T>,
  instance: interfaces.Newable<T>,
  name: string
) {
  return container
    .bind(identifier)
    .to(instance)
    .inSingletonScope()
    .whenTargetNamed(name);
}

export function bindSelf<T>(instance: interfaces.Newable<T>) {
  return container.bind(instance).toSelf().inSingletonScope();
}

export function getInstance<T>(identifier: interfaces.ServiceIdentifier<T>): T {
  return container.get(identifier);
}
