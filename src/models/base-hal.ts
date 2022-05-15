import { Expose, Type } from "class-transformer";
import { Link } from "./link";

export abstract class HalResource {
    @Expose()
    @Type(() => Link)
    readonly _links!: Map<string, Link>;

    hasLink(key: string): boolean {
        return this._links.has(key);
    }

    getHref(name: string): string | undefined {
        return this._links.get(name)?.href;
    }
}
