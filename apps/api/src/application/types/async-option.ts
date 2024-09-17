import type { Option } from "@thames/monads";
import type { NonUndefined } from "@/application/types/non-undefined.js";

export type AsyncOption<T extends NonUndefined> = Promise<Option<T>>;
