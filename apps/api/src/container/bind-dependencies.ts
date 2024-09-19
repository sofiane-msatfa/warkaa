import { bindControllers } from "./bind-controllers.js";
import { bindExternals } from "./bind-externals.js";
import { bindServices } from "./bind-services.js";

export function bindDependencies() {
  bindControllers();
  bindServices();
  bindExternals();
}
