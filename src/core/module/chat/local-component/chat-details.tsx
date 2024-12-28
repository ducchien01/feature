import './index.css'
import { useEffect, useState } from "react";
import { MessageCard } from "../../../../component/card";
import {  useForm } from "react-hook-form";
import { TextField, Winicon, Text } from "wini-web-components";
import { TextFieldForm } from "../../../../component/form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DataController } from "../../../baseController";
import { Ultis, randomGID } from "../../../../common/Utils";
import { socket } from "../../../../socket";

const ChatDetails = () => {
    const { conversationId } = useParams();
    const user = useSelector((state: any) => state.customer.data);
    const methods = useForm({ shouldFocusError: false });
    const messageController = new DataController("Message");
    const customerController = new DataController("Customer");

    const [messages, setMessages] = useState<Array<any>>([]);
    const [customers, setCustomers] = useState<Array<any>>([]);
    const [pinMessage, setPinMessage] = useState<Array<any>>([]);

    const SendMessage = (ev: any) => {
        const newMessage =  {
            Id: randomGID(),
            Name: "new_message",
            CustomerId: user?.Id,
            Content: ev?.message,
            ConversationId: conversationId,
            Sort: 1,
            Status: 1,
            Type: 1,
            DateCreated: (new Date()).getTime(),
        }
        const dataSocket = {
            sender: user?.Id,
            receiver: customers.filter((e: any) => {messages.filter((el: any) => {el.ConversationId === conversationId && el.CustomerId !== user?.Id})}),
            message :newMessage
        }
        socket.emit("send_message", dataSocket)
        console.log("list", [...messages, newMessage])

        setMessages([...messages, newMessage])
        // setMessages((list) => [...list, newMessage])
       
        return;
    }
    
    const getData = async () => {
        try {
            await messageController.getListSimple({
                page: 1, 
                size: 20,
                query: `@ConversationId:{${conversationId}}`,
                returns: ["Id", "Content", "CustomerId", "Type", "DateCreated", "ConversationId"],
                sortby: { BY: "DateCreated", DIRECTION:"ASC"}
            }).then(async (res: any) => {
                const uniqueCustomerIds = Ultis.removeDuplicates(
                    res.data.filter((e: any) => e.CustomerId !== user?.Id).map((el: any) => el.CustomerId)
                );

                const customerRes = await customerController.getByListId(uniqueCustomerIds);
                    setCustomers([...customers, ...customerRes.data])
            
                setMessages([...res.data])
                console.log("getData")
            })
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data)
            // setMessageList((list) => [...list, data]);
            setMessages([...messages, data?.message])
            // setMessages((list) => [...list, data?.message])

        });

        //   socket.on("receive_message", (data) => {
        //     console.log(data.message)
        //     console.log("messages", messages)
        // })
    },[socket])
    useEffect(() => {
        if(!conversationId) return;
        getData();
        console.log("re-render")
        console.log("messages-ren", messages)
    },[conversationId])
   
    return  <div className="col main-chat" style={{ gap:"1rem", flex: 1 }}>
        <div className="header-chat row">
            <Text>Header Chat</Text>
        </div>
        {pinMessage.length > 1 && <div className='pin-message'>Pin</div>}
        <div className="message col">
            {messages.map((mess: any, index: any) => {
                return <MessageCard key={`msg-${index}`} message={mess} customers={customers.filter((e:any) => e.Id !== user?.Id && e.Id === mess.CustomerId)} user={user}/>
            })}
        </div>
        <div className="message-input row">
            <TextFieldForm
                errors={methods.formState.errors}
                placeholder='Search'
                name='message'
                register={methods.register}
                style={{ padding: '0 1.2rem', borderRadius: '0.8rem', height: '3.2rem', width: '26.8rem', flex: 1 }}
            />
            <button onClick={methods.handleSubmit(SendMessage)}>Send</button>
        </div>
       
    </div>
}

export default ChatDetails;