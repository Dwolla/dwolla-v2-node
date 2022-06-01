export type PartialNested<T> = {
    [K in keyof T]?: T[K] extends object ? PartialNested<T[K]> : T[K];
};
