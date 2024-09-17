import { bindControllers } from "./bind-controllers.js";
import { bindRepositories } from "./bind-repositories.js";
import { bindServices } from "./bind-services.js";

export function bindDependencies() {
  bindControllers();
  bindServices();
  bindRepositories();
}
