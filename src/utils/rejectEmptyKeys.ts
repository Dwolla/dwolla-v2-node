export default function rejectEmptyKeys(obj: any): any {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));
}
