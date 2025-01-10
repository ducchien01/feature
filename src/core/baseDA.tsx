import { ToastMessage } from "wini-web-components";
import ConfigApi from "../common/config";
import { Ultis } from "../common/Utils";

const getHeaders = async () => {
    let timeRefresh: any = Ultis.getCookie("timeRefresh")
    if (typeof timeRefresh === "string") timeRefresh = parseInt(timeRefresh)
    const now = Date.now() / 1000
    if (timeRefresh && timeRefresh > 0 && timeRefresh <= now) {
        const res = await fetch(ConfigApi.url + 'data/refreshToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'refreshToken': Ultis.getCookie("refreshToken") }),
        })
        if (res.status === 200 || res.status === 201) {
            const jsonData = await res.json()
            if (jsonData.code === 200) {
                Ultis.setCookie("accessToken", jsonData.accessToken)
                Ultis.setCookie("timeRefresh", Date.now() / 1000 + 9 * 60)
                return {
                    'refreshToken': Ultis.getCookie("refreshToken"),
                    'Authorization': `Bearer ${Ultis.getCookie("accessToken")}`,
                    'Content-Type': 'application/json'
                }
            }
        }
    } else if (Ultis.getCookie("accessToken")) {
        return {
            'Authorization': `Bearer ${Ultis.getCookie("accessToken")}`,
            'Content-Type': 'application/json'
        }
    }
    return { 'Content-Type': 'application/json' }
}

export class BaseDA {
    static post = async (url: string, options?: { headers?: { [k: string]: any }, body?: any }) => {
        try {
            let _headers: { [k: string]: any } = (await getHeaders()) ?? {}
            if (options?.headers) _headers = { ..._headers, ...options.headers }
            const response = await fetch(url, {
                method: 'POST',
                headers: _headers,
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
            let _headers: { [k: string]: any } = (await getHeaders()) ?? {}
            if (options?.headers) _headers = { ..._headers, ...options.headers }
            const response = await fetch(url, {
                method: 'PUT',
                headers: _headers,
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
            let _headers: { [k: string]: any } = (await getHeaders()) ?? {}
            if (options?.headers) _headers = { ..._headers, ...options.headers }
            const response = await fetch(url, {
                method: 'GET',
                headers: _headers,
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
            let _headers: { [k: string]: any } = (await getHeaders()) ?? {}
            if (options?.headers) _headers = { ..._headers, ...options.headers }
            const response = await fetch(url, {
                method: 'DELETE',
                headers: _headers,
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
        const headersObj: any = { pid: ConfigApi.ebigId }
        const formData = new FormData();
        listFile.forEach(e => {
            formData.append("files", e);
        })
        const response = await BaseDA.postFile(ConfigApi.uploadUrl + 'file/uploadfiles', {
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

    static getFilesInfor = async (ids: Array<string>) => {
        // const headersObj: any = await getHeaders()
        const headersObj: any = {}
        const response = await BaseDA.post(ConfigApi.fileUrl + 'SystemFile/getIds', {
            headers: headersObj,
            body: ids,
        })
        return response
    }
}