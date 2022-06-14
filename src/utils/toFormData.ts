import FormData from "form-data";

export default function toFormData(obj: any): FormData {
    const formData: FormData = new FormData();

    Object.keys(obj).forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            formData.append(key, obj[key]);
        }
    });
    return formData;
}
