import { Dispatch, PayloadAction, UnknownAction, createSlice } from '@reduxjs/toolkit'
import { BaseDA } from '../../baseDA'
import ConfigApi from '../../../common/config'
import { Ultis } from '../../../common/Utils'

interface CustomerSimpleResponse {
    data?: any,
    dataParticipant?: any
    dataParticipantCustomer?: any
    onLoading?: boolean,
    type?: string
}

const initState: CustomerSimpleResponse = {
    data: undefined,
    onLoading: false
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState: initState,
    reducers: {
        handleActions: (state, action: PayloadAction<any>) => {
            switch (action.payload.type) {
                case 'GETINFOR':
                    state.data = action.payload.data
                    break;
                case 'GETPARTICIPANT':
                    state.dataParticipant = action.payload.data
                    break;
                case 'GETPARTICIPANTCUSTOMER':
                    state.dataParticipantCustomer = action.payload.data
                    break;
                case 'UPDATE':
                    state.data = action.payload.data
                    break;
                case 'LOGOUT':
                    state.data = undefined
                    state.onLoading = false
                    state.type = undefined
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
const { handleActions, onFetching } = customerSlice.actions

export default customerSlice.reducer

export class CustomerActions {
    static getInfor = async (dispatch: Dispatch<UnknownAction>) => {
        dispatch(onFetching())
        const res = await BaseDA.get(ConfigApi.url + 'data/getInfo', {
            headers: {  
                pid: ConfigApi.ebigId,
                module: 'Customer'
            },
        })
        if (res.code === 200) {
            dispatch(handleActions({
                type: 'GETINFOR',
                data: res.data,
            }))
        }
    }

    static getParticipantByConversation = async (dispatch: Dispatch<UnknownAction>, props: { conversationIds: Array<string>, userId: string }) => {
        dispatch(onFetching())
        const res = await BaseDA.post(ConfigApi.url + 'data/getListSimple', {
            headers: {
                pid: ConfigApi.ebigId,
                module: 'Participant',
            },
            body: { 
                page: 1,
                size: 100,
                searchRaw: `@ConversationId:{${props.conversationIds.join(" | ")}} -@CustomerId:{${props.userId}}` 
            }
        })
        if (res.code === 200) {
            dispatch(handleActions({
                type: 'GETPARTICIPANT',
                data: res.data,
            }))
        }
        const resCus = await BaseDA.post(ConfigApi.url + 'data/getByIds', {
            headers: {
                pid: ConfigApi.ebigId,
                module: 'Customer',
            },
            body: { ids: res.data.map(e => e?.CustomerId) }
        })
      
        if (resCus.code === 200) {
            dispatch(handleActions({
                type: 'GETPARTICIPANTCUSTOMER',
                data: resCus.data.filter((e, index, arr) => arr.findIndex(obj => obj.Id === e.Id) === index)}))
        }
        return res
    }

    static login = async (props: { UserName: string, PassWord: string }) => {
        const res = await BaseDA.post(ConfigApi.url + 'intergration/ebig/login', {
            headers: { 
                pid: ConfigApi.ebigId,
                module: 'Customer',
            },
            body: props
        })
        return res
    }

    static logout = () => {
        Ultis.clearCookie()
        window.location.replace("/login");
    }
}