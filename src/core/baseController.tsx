import { BaseDA } from "./baseDA";
import ConfigApi from "../common/config";
import { Ultis } from "../common/Utils";

export class DataController {
    private module: string;

    constructor(module: string) {
        this.module = module
    }
  
    async getAll() {
        const res = await BaseDA.get(ConfigApi.url + 'data/getAll', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
        })
        return res
    }

    async aggregateList(options: { page?: number, size?: number, searchRaw?: string, filter?: string, sortby?: Array<{ prop: string, direction?: "ASC" | "DESC" }> } | undefined) {
        const res = await BaseDA.post(ConfigApi.url + 'data/aggregateList', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
            body: { ...options, sortby: options?.sortby ?? [{ prop: "Sort", direction: "DESC" }, { prop: "DateCreated", direction: "DESC" }] }
        })
        return res
    }

    async group(options: { searchRaw?: string, reducers: string }) {
        const res = await BaseDA.post(ConfigApi.url + 'data/group', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
            body: options
        })
        return res
    }

    async groupByIds(params: { reducers: Array<{ Name: string, Reducer: any, ReducerBy?: string, TbName: string, Column: string }>, ids: Array<string> }) {
        if (params.reducers.length) {
            const groupReducers: Array<{ tbName: string, query: string, searchRaw?: string }> = []
            const groupNames: Array<string> = []
            for (const e of params.reducers) {
                if (!groupNames.includes(e.TbName)) groupNames.push(e.TbName)
            }
            for (let _tbName of groupNames) {
                const _tmp = params.reducers.filter((e) => e.TbName === _tbName)
                const _reduceQuery = _tmp.map((e) => `REDUCE ${e.Reducer} ${e.ReducerBy ? `1 @${e.ReducerBy}` : 0} AS ${e.Name}`).join(" ")
                const _colName = _tmp[0].Column
                const _groupName = `_${_colName}`
                groupReducers.push({
                    tbName: _tbName,
                    searchRaw: params.ids.length ? `@${_colName}:{${params.ids.map((_id) => `${_id}*`).join(" | ")}}` : "*",
                    query: `APPLY @${_colName} AS ${_groupName}` + ` GROUPBY 1 @${_groupName} ${_reduceQuery}`
                })
            }
            const res = await BaseDA.post(ConfigApi.url + 'data/groupByIds', {
                headers: { pid: ConfigApi.ebigId },
                body: {
                    reducers: groupReducers
                }
            })
            return res
        }
        return []
    }

    async getListSimple(options: { page?: number, size?: number, query?: string, returns?: Array<string>, sortby?: { BY: string, DIRECTION?: "ASC" | "DESC" } } | undefined) {
        const res = await BaseDA.post(ConfigApi.url + 'data/getListSimple', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
            body: { searchRaw: options?.query?.length ? options?.query : "*", page: options?.page ?? 1, size: options?.size ?? 10, returns: options?.returns, sortby: options?.sortby }
        })
        return res
    }

    async getById(id: string) {
        const res = await BaseDA.post(ConfigApi.url + `data/getById?id=${id}`, {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
        })
        return res
    }

    async getByListId(ids: Array<string>) {
        const res = await BaseDA.post(ConfigApi.url + 'data/getByIds', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
            body: { ids: ids }
        })
        return res
    }

    async add(data: Array<{ [p: string]: any }>) {
        const res = await BaseDA.post(ConfigApi.url + 'data/action?action=add', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module
            },
            body: { data: data }
        })
        return res
    }

    async edit(data: Array<{ [p: string]: any }>) {
        const res = await BaseDA.post(ConfigApi.url + 'data/action?action=edit', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module
            },
            body: { data: data }
        })
        return res
    }

    async delete(ids: Array<string>) {
        const res = await BaseDA.post(ConfigApi.url + 'data/action?action=delete', {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module
            },
            body: { ids: ids }
        })
        return res
    }

    async groupBy(params: { reducers: Array<{ Name: string, Reducer: any, ReducerBy?: string, GroupBy: string, Query?: string }>, searchRaw?: string }) {
        const res = await BaseDA.post(ConfigApi.url + `data/groupBy`, {
            headers: {
                pid: ConfigApi.ebigId,
                module: this.module,
            },
            body: params
        })
        return res
    }
    
    token = () => Ultis.getCookie('accessToken')

    logout = () => {
        Ultis.clearCookie()
        window.location.href = '/' + window.location.pathname.split('/')[1]
    }
}