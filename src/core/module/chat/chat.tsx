import './chat.css'
import Layout from "../../layout/layout";
import { useEffect } from 'react';
import ChatSideBarLeft from './local-component/chat-sidebar-left/chat-sidebar-left';
import ChatSideBarRight from './local-component/chat-sidebar-right/chat-sidebar-right';
import ChatDetails from './local-component/chat-details/chat-details';
import { DataController } from '../../baseController';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.customer.data);
    const conversationController = new DataController("Conversation");
    const participantController = new DataController("Participant");

    const getDefaultConversation = async () => {
        try {
            const participantRes = await participantController.getListSimple({
                page: 1,
                size: 200,
                query:`@CustomerId:{${user?.Id}}`
            })

            if (!participantRes.data || participantRes.data.length === 0) {
                console.log("No participants found.");
                return;
            }

            const conversationIdsQuery = participantRes.data.map((e: any) => `*${e.ConversationId}*`).join(" | ");

            // Lấy thông tin cuộc trò chuyện gần nhất
            const conversationRes = await conversationController.getListSimple({
                page: 1,
                size: 1,
                query: `@Id:{${conversationIdsQuery}}`,
                sortby: {
                    DIRECTION: "DESC",
                    BY: "DateUpdated"
                },
                returns: ["Id"]
            });
            console.log("conversationRes", conversationRes)
            const conversationId = conversationRes.data?.[0]?.Id;

            if (conversationId) {
                navigate(`/chat/${conversationId}`); // Điều hướng đến trang chi tiết chat
            } else {
                console.log("No conversations found.");
            }
            
        } catch (error) {
            
        }
    }
    
    useEffect(() => {
        if(!user) return;
        getDefaultConversation();
    }, [user])

    return <div className="chat-container row">
        <ChatSideBarLeft />
        <ChatDetails />
        <ChatSideBarRight />
    </div>
}

export default Layout(Chat);