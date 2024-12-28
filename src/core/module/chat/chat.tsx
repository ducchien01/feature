import './index.css'
import Layout from "../../layout/layout";
import { useEffect } from 'react';
import ChatSideBarLeft from './local-component/chat-sidebar-left';
import ChatSideBarRight from './local-component/chat-sidebar-right';
import ChatDetails from './local-component/chat-details';

const Chat = () => {
    return <div className="chat-container row" style={{ width: "100%" }}>
        <ChatSideBarLeft />
        <ChatDetails />
        <ChatSideBarRight />
    </div>
}

export default Layout(Chat);