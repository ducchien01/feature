import { ToastMessage } from "wini-web-components";
import ConfigApi from "../common/config";

export class BaseDA {
    static post = async (url: string, options?: { headers?: { [k: string]: any }, body?: any }) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: options?.headers ? { "Content-Type": "application/json", ...options.headers } : { "Content-Type": "application/json" },
                body: JSON.stringify(options?.body),
            })
            if (response.status === 200 || response.status === 201) {
                const jsonData = await response.json()
                return jsonData
            } else if (response.status === 204) {
                return {
                    message: 'ok',
                    data: options?.body
                }
            } else if (response.status === 401) {
                ToastMessage.errors('Không có quyền truy cập')
                // setTimeout(AccountController.logout, 1000)
            } else {
                const txt = await response.json()
                ToastMessage.errors(txt.mesages)
            }
        } catch (error) {
            ToastMessage.errors(error?.toString() as string)
            // console.error("Failed to POST data:", error);
            throw error;
        }
    }

    static put = async (url: string, options?: { headers?: { [k: string]: any }, body?: any }) => {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: options?.headers ? { "Content-Type": "application/json", ...options.headers } : { "Content-Type": "application/json" },
                body: JSON.stringify(options?.body),
            })
            if (response.status === 200 || response.status === 201) {
                const jsonData = await response.json()
                return jsonData
            } else if (response.status === 204) {
                return {
                    message: 'ok',
                    data: options?.body
                }
            } else if (response.status === 401) {
                ToastMessage.errors('Không có quyền truy cập')
                // setTimeout(AccountController.logout, 1000)
            } else {
                const txt = await response.json()
                ToastMessage.errors(txt.mesages)
            }
        } catch (error) {
            ToastMessage.errors(error?.toString() as string)
            // console.error("Failed to POST data:", error);
            throw error;
        }
    }

    static postFile = async (url: string, options?: { headers?: { [k: string]: any }, body?: FormData }) => {
        try {
            if (options?.headers) {
                delete options?.headers["Content-Type"]
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: options?.headers,
                body: options?.body,
            })
            if (response.status === 200 || response.status === 201) {
                const jsonData = await response.json()
                return jsonData
            } else if (response.status === 204) {
                return {
                    message: 'ok',
                    data: options?.body
                }
            } else if (response.status === 401) {
                ToastMessage.errors('Không có quyền truy cập')
                // setTimeout(AccountController.logout, 1000)
            } else {
                const txt = await response.text()
                console.error("Failed to POST data:", txt);
            }
        } catch (error) {
            console.error("Failed to POST data:", error);
            throw error;
        }
    }

    static get = async (url: string, options?: { headers?: { [k: string]: any } }) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: options?.headers,
            })
            if (response.status === 200 || response.status === 201) {
                const jsonData = await response.json()
                return jsonData
            } else if (response.status === 204) {
                return {
                    message: 'ok',
                    // data: options?.body
                }
            } else if (response.status === 401) {
                ToastMessage.errors('Không có quyền truy cập')
                // setTimeout(AccountController.logout, 1000)
            } else {
                const txt = await response.text()
                console.error("Failed to POST data:", txt);
            }
        } catch (error) {
            console.error("Failed to GET data:", error);
            throw error;
        }
    }
//#region An

//#endregion
    static delete = async (url: string, options?: { headers?: { [k: string]: any } }) => {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: options?.headers,
            })
            if (response.status === 200 || response.status === 201) {
                const jsonData = await response.json()
                return jsonData
            } else if (response.status === 204) {
                return {
                    message: 'ok',
                    // data: options?.body
                }
            } else if (response.status === 401) {
                ToastMessage.errors('Không có quyền truy cập')
                // setTimeout(AccountController.logout, 1000)
            } else {
                const txt = await response.text()
                console.error("Failed to POST data:", txt);
            }
        } catch (error) {
            console.error("Failed to GET data:", error);
            throw error;
        }
    }

    static uploadFiles = async (listFile: Array<File>) => {
        listFile = [...listFile];
        // const headersObj: any = await getHeaders()
        const headersObj: any = {}
        const formData = new FormData();
        listFile.forEach(e => {
            formData.append("files", e);
        })
        const response = await BaseDA.postFile(ConfigApi.fileUrl + 'SystemFileAuth/Upload', {
            headers: headersObj,
            body: formData,
        })
        if (response.code === 200) {
            return response.data
        } else {
            ToastMessage.errors(response.message)
        }
        return null;
    }
}