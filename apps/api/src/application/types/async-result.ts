import type { Result } from "@thames/monads";
import type { NonUndefined } from "@/application/types/non-undefined.js";

export type AsyncResult<T extends NonUndefined, E extends NonUndefined> = Promise<Result<T, E>>;
