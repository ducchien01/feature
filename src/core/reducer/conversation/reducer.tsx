import { Dispatch, PayloadAction, UnknownAction, createSlice } from '@reduxjs/toolkit'
import { BaseDA } from '../../baseDA'
import ConfigApi from '../../../common/config'

interface ConversationSimpleResponse {
    data?: any,
    dataConversationMember?:any
    onLoading?: boolean,
    type?: string
}

const initState: ConversationSimpleResponse = {
    data: undefined,
    onLoading: false
}

export const conversationSlice = createSlice({
    name: 'Conversation',
    initialState: initState,
    reducers: {
        handleActions: (state, action: PayloadAction<any>) => {
            switch (action.payload.type) {
                case 'GETCONVERSATION':
                    state.data = action.payload.data
                    break;
                case 'GETCONVERSATIONMEMBER':
                    state.dataConversationMember = action.payload.data
                    break;
                default:
                    break;
            }
            state.onLoading = false
        },
        onFetching: (state) => {
            state.onLoading = true
        },
    },
})
const { handleActions, onFetching } = conversationSlice.actions

export default conversationSlice.reducer

export class ConversationActions {
    static getConversationMember = async (dispatch: Dispatch<UnknownAction>, conversationId: string, userId: string) => {
        dispatch(onFetching())
        const res = await BaseDA.post(ConfigApi.url + 'data/getListSimple', {
            headers: {
                pid: ConfigApi.ebigId,
                module: 'Participant',
            },
            body: { 
                page: 1,
                size: 100,
                searchRaw: `@ConversationId:{${conversationId}} -@CustomerId:{${userId}}` 
            }
        })
       
        const resCus = await BaseDA.post(ConfigApi.url + 'data/getByIds', {
            headers: {
                pid: ConfigApi.ebigId,
                module: 'Customer',
            },
            body: { ids: res.data.map(e => e?.CustomerId) }
        })
        if (res.code === 200) {
            dispatch(handleActions({
                type: 'GETCONVERSATIONMEMBER',
                data:  resCus.data.filter((e, index, arr) => arr.findIndex(obj => obj.Id === e.Id) === index)
            }
        ))}
        return res
    }

    static getConversation = async (dispatch: Dispatch<UnknownAction>, conversationId: string ) => {
        dispatch(onFetching())
        const res = await BaseDA.post(ConfigApi.url + `data/getById?id=${conversationId}`, {
            headers: {
                pid: ConfigApi.ebigId,
                module: 'Conversation',
            },
        })
        if (res.code === 200) {
            dispatch(handleActions({
                type: 'GETCONVERSATION',
                data: res.data,
            }))
        }
        return res
    }
}