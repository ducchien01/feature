import './chat-sidebar-left.css'
import {  useEffect, useRef, useState } from "react";
import { TextField, Winicon, Text, showPopup, Popup } from "wini-web-components";
import { DataController } from '../../../../baseController';
import { ConversationCard } from '../../../../../component/card';
import { useParams } from 'react-router-dom';
import { PopupAddGroup } from './popup-add-group';
import { useDispatch, useSelector } from 'react-redux';
import { ConversatioStatus, ConversationType } from '../../../../../common/enum';
import { ConversationActions } from '../../../../reducer/conversation/reducer';

const ChatSideBarLeft = ({socket, onlineUsers, conversations, setConversations}) => {
    const ref = useRef<any>();
    const dispatch = useDispatch();
    const { conversationId } = useParams();
    const user = useSelector((state: any) => state.customer.data);
    const conversation = useSelector((state: any) => state.conversation.data);
    const customers = useSelector((state: any) => state.customer.dataParticipantCustomer);
    const participant = useSelector((state: any) => state.customer.dataParticipant);
    const customerController = new DataController("Customer");
    const participantController = new DataController("Participant");
    const [lastMessage, setLastMessage] = useState<any>();

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
        if (!socket) return; 
      
        // Nhận tin nhắn mới
        socket.on("receive_message", (data) => {
          setConversations((prevConversations) => {
            const updated = prevConversations.map((conv) =>
              conv.Id === data.ConversationId
                ? {
                    ...conv,
                    LastMessage: data.Content,
                    LastMessageTime: data.DateCreated,
                  }
                : conv
            );
      
            // Nếu cuộc trò chuyện không tồn tại, thêm mới
            if (!updated.find((conv) => conv.Id === data.ConversationId)) {
              updated.push({
                Id: data.ConversationId,
                LastMessage: data.Content,
                LastMessageTime: data.DateCreated,
              });
            }
      
            // Sắp xếp danh sách cuộc trò chuyện theo thời gian giảm dần
            updated.sort((a, b) => b.LastMessageTime - a.LastMessageTime);
            return updated;
          });
        });
      
        // Cleanup khi component unmount
        return () => socket.off("receive_message");
    }, [socket]);
      
    useEffect(() => {
        if (!conversationId || !user) return;
        getMemberByConversationId();
    }, [conversationId, user]);

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
                {conversations?.length > 0 ? conversations
                .map((cv: any, i: number) => {
                    const { name, isOnline, isGroup, imgs} = handleConversation(cv);
                    return (
                        <ConversationCard 
                            id={cv?.Id} 
                            key={`cv-${i}`} 
                            name={name}
                            socket={socket}
                            newMessage={cv?.LastMessage}
                            isOnline={isOnline}
                            listImg={imgs}
                            isGroup={isGroup}
                            isRead={false}
                            handlerOnClick={() => ConversationActions.getConversationMember(dispatch, conversationId as string, user?.Id)}
                            lastMessageTime={"20 hours"}
                        />  
                    )
                }) : <Text>Bạn không có cuộc trò chuyện nào</Text>}
            </div>
        </div>
}

export default ChatSideBarLeft;


