import './chat.css'
import Layout from "../../layout/layout";
import { useEffect, useRef, useState } from 'react';
import ChatSideBarLeft from './local-component/chat-sidebar-left/chat-sidebar-left';
import ChatSideBarRight from './local-component/chat-sidebar-right/chat-sidebar-right';
import ChatDetails from './local-component/chat-details/chat-details';
import { DataController } from '../../baseController';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useSocket from '../../../socket';
import { CustomerActions } from '../../reducer/customer/reducer';

const Chat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            query: `@CustomerId:{${user?.Id}}`,
        })
        
        const conversationIds = res.data.map((e) => e.ConversationId);
             
        const cvRes = await conversationController.getByListId(conversationIds);
        setConversations(cvRes.data);
        navigate(`/chat/${cvRes.data[0]?.Id}`);
            
        CustomerActions.getParticipantByConversation(dispatch, { conversationIds: conversationIds, userId:user?.Id })
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
            socket.disconnect(); // Ensure no other components use the same instance
        };
    }, [socket]);

    useEffect(() => { 
        if(!user) return;
        getData();
    }, [user])

    // useEffect(() => {
    //     if (!conversations.length || firstNavigation.current) return;
    //     firstNavigation.current = true;
    //     if (conversations[0]?.Id) {
    //         navigate(`/chat/${conversations[0].Id}`);
    //     }
    // }, [conversations]);

    return <div className="chat-container row">
        <ChatSideBarLeft 
            socket={socket} 
            onlineUsers={onlineUsers} 
            conversations={conversations}
        />
        <ChatDetails 
            user={user} 
            socket={socket} 
            onlineUsers={onlineUsers}
        />
        {/* <ChatSideBarRight 
            user={user} 
            socket={socket} 
        /> */}
    </div>
}

export default Layout(Chat);