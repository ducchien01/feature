import './chat.css'
import Layout from "../../layout/layout";
import { useEffect, useRef, useState } from 'react';
import ChatSideBarLeft from './local-component/chat-sidebar-left/chat-sidebar-left';
import ChatSideBarRight from './local-component/chat-sidebar-right/chat-sidebar-right';
import ChatDetails from './local-component/chat-details/chat-details';
import { DataController } from '../../baseController';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useSocket from '../../../socket';
import { CustomerActions } from '../../reducer/customer/reducer';
import { ConversationActions } from '../../reducer/conversation/reducer';

const Chat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { conversationId } = useParams();
    const user = useSelector((state: any) => state.customer.data);
    const socket = useSocket(user?.Id);
    const conversationController = new DataController("Conversation");
    const participantController = new DataController("Participant");
    const [onlineUsers, setOnlineUsers] = useState<Array<any>>([]);
    const [conversations, setConversations] = useState<Array<any>>([]);
    
    const getData = async () => {
        const res = await participantController.getListSimple({
            page: 1,
            size: 100,
            query: `@CustomerId:{${user?.Id}} @Status:[1 1]`,
        })
        
        const conversationIds = res.data.map((e) => e.ConversationId);
        const cvRes = await conversationController.getListSimple({
            page: 1,
            size: 15,
            query:`@Id:{${conversationIds.join(" | ")}}`,
            sortby: {
                BY: "LastMessageTime",
                DIRECTION:"DESC"
            }
        })
        setConversations(cvRes.data);
        if (cvRes.data.length > 0) {
            navigate(`/chat/${cvRes.data[0]?.Id}`);
        }
        ConversationActions.getConversation(dispatch, cvRes.data[0]?.Id);
        CustomerActions.getParticipantByConversation(dispatch, { conversationIds: conversationIds, userId:user?.Id })
        ConversationActions.getConversationMember(dispatch, cvRes.data[0]?.Id, user?.Id);
    };
    
    useEffect(() => {
        if (!socket) return;
    
        const handleOnlineUsers = (users) => {
            if (Array.isArray(users)) {
                setOnlineUsers(users);
            } else {
                console.error("Invalid data received for online users");
            }
        };
    
        socket.on('online-users', handleOnlineUsers);
    
        return () => {
            socket.off('online-users', handleOnlineUsers);
            socket.disconnect(); 
        };
    }, [socket]);

    useEffect(() => { 
        if(!user) return;
        getData();
    }, [user])

    useEffect(() => {
        if(!conversationId) return;
        ConversationActions.getConversationMember(dispatch, conversationId, user?.Id);
    }, [conversationId])
    return <div className="chat-container row">
        <ChatSideBarLeft 
            socket={socket} 
            onlineUsers={onlineUsers} 
            conversations={conversations}
            setConversations={setConversations}
        />
        <ChatDetails 
            user={user} 
            socket={socket} 
            onlineUsers={onlineUsers}
            setConversations={setConversations}
        />
        {/* <ChatSideBarRight 
            user={user} 
            socket={socket} 
        /> */}
    </div>
}

export default Layout(Chat);