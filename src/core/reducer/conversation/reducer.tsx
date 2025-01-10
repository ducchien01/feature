import { Dispatch, PayloadAction, UnknownAction, createSlice } from '@reduxjs/toolkit'
import { BaseDA } from '../../baseDA'
import ConfigApi from '../../../common/config'

interface ConversationSimpleResponse {
    data?: any,
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
    // static getInfor = async (dispatch: Dispatch<UnknownAction>) => {
    //     dispatch(onFetching())
    //     const res = await BaseDA.get(ConfigApi.url + 'data/getInfo', {
    //         headers: {  
    //             pid: ConfigApi.ebigId,
    //             module: 'Customer'
    //         },
    //     })
    //     if (res.code === 200) {
    //         dispatch(handleActions({
    //             type: 'GETConversation',
    //             data: res.data,
    //         }))
    //     }
    // }

    static getConversation = async (dispatch: Dispatch<UnknownAction>, props: { conversationId: string }) => {
        // const res = await BaseDA.post(ConfigApi.url + 'intergration/ebig/login', {
        //     headers: { 
        //         pid: ConfigApi.ebigId,
        //         module: 'Customer',
        //     },
        //     body: props
        // })
        dispatch(onFetching())
        // const res = await BaseDA.post(ConfigApi.url + 'data/getListSimple', {
        //     headers: {
        //         pid: ConfigApi.ebigId,
        //         module: 'Conversation',
        //     },
        //     body: { 
        //         page: 1,
        //         size: 100,
        //         searchRaw: `@ConversationId:{${props.conversationIds.join(" | ")}} -@CustomerId:{${props.userId}}` 
        //     }
        // })
        const res = await BaseDA.post(ConfigApi.url + `data/getById?id=${props.conversationId}`, {
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