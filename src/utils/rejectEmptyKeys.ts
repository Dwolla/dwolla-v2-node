export default function (obj: any): any {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));
}
