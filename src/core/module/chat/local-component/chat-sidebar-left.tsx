import './index.css'
import React, { useEffect, useState } from "react";
// import { ChatCard } from "../../../component/card";
import { NavLink } from "react-router-dom";
import { TextField, Winicon, Text } from "wini-web-components";
import { DataController } from '../../../baseController';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { ConversationCard } from '../../../../component/card';
import { Ultis } from '../../../../common/Utils';

type Props = {
    chats?: Array<any>;
    chatId?:string;
    onlineUsers?: Array<string>;
    newMessagesAlert?: Array<{ chatId: string, count: number }>;
    handleDeleteChat?: (e: MouseEvent, id?: string, groupChat?: boolean) => void;
    userInfor?:any;
}

// const SideBarLeft = ({ chats, chatId, onlineUsers, newMessagesAlert, handleDeleteChat, userInfor }: Props) => {
const ChatSideBarLeft = () => {
    const user = useSelector((state: RootState) => state.customer.data)
    const conversationController = new DataController("Conversation");
    const customerController = new DataController("Customer");
    const participantController = new DataController("Participant");

    const [conversations, setConversations] = useState<Array<any>>([]);
    const [customers, setCustomers] = useState<Array<any>>([]);
    const [participants, setParticipants] = useState<Array<any>>([]);

    useEffect(()=>{ 
        if(!user?.Id) return;
        
        participantController.getListSimple({
            page: 1,
            size: 100,
            query:`@CustomerId:{${user?.Id}}`
        }).then(async (res: any) => {
            conversationController.getByListId(res.data.map((e: any) => e.ConversationId)).then((res: any) => { 
                setConversations([...conversations, ...res.data])
            })

            participantController.getListSimple({
                page: 1,
                size: 100,
                query:`@ConversationId:{${res.data.map(e => e.ConversationId).join(" | ")}}`
            }).then(async (res: any) => {
                customerController.getByListId(Ultis.removeDuplicates(res.data.map((e: any) => e.CustomerId))).then((res: any) => {
                    setCustomers([...customers ,...res.data])
                })

                setParticipants([...participants, ...res.data])
            })
        })
        
    },[user])

    return (
        <div className="left-sidebar col" style={{ gap: '2.4rem' }}>
            <Text maxLine={1} style={{ width: '100%' }} className="heading-7">Tin Nhắn</Text>
            <TextField
                prefix={<Winicon src='fill/development/zoom' size={'1.6rem'}/>}
                style={{ height: '4rem', padding: '0.8rem 1.6rem', margin: '0.4rem 0' }}
                className="search-default body-3"
                placeholder="Tìm kiếm bài viết"
            />
        
            {conversations && (conversations.length > 0) ? conversations.map((cv: any, i: any) => {
                const idCus = participants.filter((e: any) =>   e?.ConversationId === cv.Id && e.CustomerId !== user?.Id).map((e: any) => e.CustomerId);
                return (
                    <ConversationCard 
                                id={cv.Id} 
                                key={`cv-${i}`} 
                                name={cv.Type === 1 ? customers.find((e: any) => idCus.includes(e.Id))?.Name : cv.Name}
                                // newMessageAlert={newMessageAlert}
                                // isOnline={isOnline}
                                listImg={customers.filter((e: any) => idCus.includes(e.Id)).map(e => e.Img)}
                                // groupChat={groupChat}
                                // sameSender={chatId === _id}
                                // handleDeleteChatOpen={handleDeleteChat as any}
                            />  
                )
            }) : <Text>Bạn không có cuộc trò chuyện nào</Text>}
        </div>
    )
}

export default ChatSideBarLeft;