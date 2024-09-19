// @see https://stackoverflow.com/a/72050646
export function isValueInStringEnum<E extends string>(
  strEnum: Record<string, E>
) {
  const enumValues = Object.values(strEnum) as string[];
  return (value: string): value is E => enumValues.includes(value);
}

export function extractEnumValues<E extends string>(
  strEnum: Record<string, E>
) {
  return Object.values(strEnum) as E[];
}
