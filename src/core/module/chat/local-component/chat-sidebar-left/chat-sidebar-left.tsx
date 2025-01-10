import './chat-sidebar-left.css'
import {  useEffect, useRef, useState } from "react";
import { TextField, Winicon, Text, showPopup, Popup } from "wini-web-components";
import { DataController } from '../../../../baseController';
import { ConversationCard } from '../../../../../component/card';
import { Ultis } from '../../../../../common/Utils';
import { useParams } from 'react-router-dom';
import { PopupAddGroup } from './popup-add-group';
import React from 'react';
import { useSelector } from 'react-redux';
import { ConversatioStatus, ConversationType } from '../../../../../common/enum';

const ChatSideBarLeft = ({socket, onlineUsers, conversations}) => {
    const ref = useRef<any>();
    const { conversationId } = useParams();
    const user = useSelector((state: any) => state.customer.data);
    const customers = useSelector((state: any) => state.customer.dataParticipantCustomer);
    const participant = useSelector((state: any) => state.customer.dataParticipant);
    // const conversationController = new DataController("Conversation");
    const customerController = new DataController("Customer");
    const participantController = new DataController("Participant");
    // const [conversations, setConversations] = useState<Array<any>>([]);
    // const [participants, setParticipants] = useState<Array<any>>([]);

    const handleConversation = (consversation: any) => {
        const customerIds = participant?.filter(e => e.ConversationId === consversation.Id).map(e => e.CustomerId);
        const member = customers?.filter(cus => customerIds.includes(cus.Id));
        let imgs = Array<any>([]);
        let isOnline = false;
        let isGroup = false;
        let name = "";
        if (consversation.Type === ConversationType.Group && member?.length > 1) {
            if (consversation?.Img){ 
                imgs = Array(consversation?.Img);
            } else {
                imgs = member.map(e => e?.Img);
            }
            if(consversation.Status === ConversatioStatus.Online) isOnline = true;
            isGroup = true;
            name = consversation.Name;
        } else if (consversation.Type === ConversationType.Private && member?.length === 1) {
            if (onlineUsers.includes(member[0]?.Id)) {
                isOnline = true;
            }
            imgs = member?.map(e => e?.Img);
            isGroup = false;
            name = member[0]?.Name;
        }
        // if (consversation.Type === ConversationType.Private && participantIds?.length === 1 && onlineUsers.includes(participantIds[0])) {
        //     isOnline = true;
        // } else if (cv.Type === ConversationType.Group && cv.Status === ConversatioStatus.Online && ParticipantIds.length > 1) {
        //     isOnline = true;
        //     isGroup = true;
        // }

        return {
            name: name,
            isOnline: isOnline,
            isGroup: isGroup,
            imgs: imgs
        }
    }

    const getMemberByConversationId = async () => {
       const res = await participantController.getListSimple({
            page: 1, 
            size: 20, 
            query: `@ConversationId:{${conversationId}} -@CustomerId:{${user?.Id}}`
        });
        const customerIds = res.data.map((e: any) => e?.CustomerId);
        const cusRes = await customerController.getByListId(customerIds);
        // setCustomers(cusRes.data);
    }

    // const getMemberByConversationId = async () => {
    //     customerController.getListSimple({
    //         page: 1, 
    //         size: 20, 
    //         query: `@ConversationId:{${conversationId}} -@CustomerId:{${user?.Id}}`
    //     }).then((res: any) => {
    //         debugger
    //         setParticipants(res.data);
    //     })
    // }

    const showAddGroup = (ev: any) => {
        const _box = ev.target.getBoundingClientRect()
        showPopup({
            ref: ref,
            style: { 
                top: `${_box.y + _box.height + 2}px`,
                right: `${document.body.offsetWidth - _box.right}px`,
                position: "absolute", 
                width: "fit-contents" 
            },
            content: <PopupAddGroup user={user} ref={ref} />
        })
    }
 
    useEffect(() => {
        if (!conversationId || !user) return;
        getMemberByConversationId();
      }, [conversationId, user]);

    // useEffect(() => {
    //        if(socket) {
    //         socket.on("update_user_status", ({ userId, status }) => {
    //             setOnlineUsers((prev) => {
    //                 const updatedUsers = [...prev];
    
    //                 if (status === 1 && !updatedUsers.includes(userId)) {
    //                     // Nếu user online, thêm vào danh sách
    //                     updatedUsers.push(userId);
    //                 } else if (status === 0) {
    //                     // Nếu user offline, xóa khỏi danh sách
    //                     return updatedUsers.filter((id) => id !== userId);
    //                 }
    //                 console.log("updatedUsers", updatedUsers)
    //                 return updatedUsers;
    //             });
    
    //         });
    
    //         return () => {
    //             socket.disconnect();
    //         };
    //        }
    // }, [socket])

    // useEffect(() => { 
    //     if(!user?.Id) return;
    //     participantController.getListSimple({
    //         page: 1,
    //         size: 100,
    //         query:`@CustomerId:{${user?.Id}}`
    //     }).then(async (res: any) => {
    //         conversationController.getByListId(res.data.map((e: any) => e.ConversationId)).then((res: any) => { 
    //             setConversations([...res.data]);
    //         })
    //         participantController.getListSimple({
    //             page: 1,
    //             size: 100,
    //             query:`@ConversationId:{${res.data.map(e => e.ConversationId).join(" | ")}}`
    //         }).then(async (res: any) => {
    //             customerController.getByListId(Ultis.removeDuplicates(res.data.map((e: any) => e.CustomerId))).then((res: any) => {
    //                 setCustomers([...customers ,...res.data]);
    //             })
    //             setParticipants([...participants, ...res.data]);
    //         })
    //     })
    // },[user, conversationId])
    return <div className="left-sidebar col">
            <Popup ref={ref} />
            <div className="col" style={{ gap:"1.6rem"}}>
                <div className="row" style={{ width:"100%", justifyContent:"space-between", overflow:"visible" }}>
                    <Text maxLine={1} className="heading-7">Tin Nhắn</Text>
                    <Winicon src='fill/user interface/s-edit' onClick={showAddGroup} size={'2rem'}/>
                </div>
                <TextField
                    prefix={<Winicon src='fill/development/zoom' size={'1.6rem'}/>}
                    style={{ height: '4rem', padding: '0.8rem 1.6rem', margin: '0.4rem 0' }}
                    className="search-default body-3"
                    placeholder="Tìm kiếm bài viết"
                />
            </div>
            <div className="list-conversation col">
                {conversations.length > 0 ? conversations.map((cv: any, i: number) => {
                    // const listCustomer =  participants.filter((e: any) => e?.ConversationId === cv?.Id && e.CustomerId !== user?.Id).map((e: any) => e.CustomerId);
                    // const listImg = cv?.Img ? Array(cv?.Img) : customers.filter((e: any) => listCustomer.includes(e.Id)).map(e => e.Img);
                    // const name = cv?.Type === 1 ? customers.find((e: any) => listCustomer.includes(e.Id))?.Name : cv.Name
                
                    const { name, isOnline, isGroup, imgs} = handleConversation(cv);
                    return (
                        <ConversationCard 
                            id={cv?.Id} 
                            key={`cv-${i}`} 
                            name={name}
                            newMessage={"lorem irusss..."}
                            isOnline={isOnline}
                            listImg={imgs}
                            isGroup={isGroup}
                            isRead={false}
                            lastMessageTime={"20 hours"}
                        />  
                    )
                }) : <Text>Bạn không có cuộc trò chuyện nào</Text>}
            </div>
        </div>
}

export default React.memo(ChatSideBarLeft);


