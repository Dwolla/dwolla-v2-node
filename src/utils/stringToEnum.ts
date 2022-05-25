export default function <TEnum>(enumObj: TEnum, value: unknown): TEnum | undefined {
    if (Object.values(enumObj).some((objValue: unknown) => objValue === value)) {
        return value as TEnum;
    }
    return undefined;
}
