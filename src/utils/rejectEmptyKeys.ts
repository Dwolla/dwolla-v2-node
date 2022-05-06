export default function (obj: any): any {
    return Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(obj).filter(([_, v]) => {
            return v != null;
        })
    );
}
