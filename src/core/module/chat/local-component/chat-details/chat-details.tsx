import './chat-details.css'
import { useEffect, useState } from "react";
import { AvatarCard, MessageCard } from "../../../../../component/card";
import {  useForm } from "react-hook-form";
import { TextField, Winicon, Text } from "wini-web-components";
import { TextFieldForm } from "../../../../../component/form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DataController } from "../../../../baseController";
import { Ultis, randomGID } from "../../../../../common/Utils";
import useSocket from "../../../../../socket";

const ChatDetails = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.customer.data);
    const socket = useSocket(user?.Id);
    const { conversationId } = useParams();
    const methods = useForm({ shouldFocusError: false });
    const messageController = new DataController("Message");
    const customerController = new DataController("Customer");
    const conversationController = new DataController("Conversation");
    const participantController = new DataController("Participant");

    const [conversation, setConversation] = useState<any>(null);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [customers, setCustomers] = useState<Array<any>>([]);
    const [isSending, setIsSending] = useState(false);
    const [pinMessage, setPinMessage] = useState<Array<any>>([]);
    const [isOnline, setIsOnline] = useState<boolean>(true);
    
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
            })
            const cvst = await conversationController.getById(conversationId as string);
            setConversation(cvst.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const SendMessage = (ev: any) => {
        if (isSending) return;

        setIsSending(true);

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

    socket.emit("send_message", newMessage, (response: any) => {
        if (response?.success) {
            // Tin nhắn đã gửi thành công, cập nhật frontend
            setMessages((list) => [...list, newMessage]);
        } else {
            console.error("Failed to send message:", response?.error);
        }
        
        setIsSending(false); 
    });
    methods.setValue("message","");
    // (Tuỳ chọn) Hiển thị ngay trên frontend trước khi có phản hồi từ server
    // setMessages((list) => [...list, newMessage]);
    }
    
    // useEffect(() => {
    //     getDefaultConversation();
    //     getData();
    // }, [])
    
    useEffect(() => {   
        if (socket) {
            socket.on("receive_message", (data) => {
              setMessages((prev) => [...prev, data]);
            });
          }

    },[socket])

    useEffect(() => {
        if(!conversationId) return;
        getData();
    },[conversationId])
   
    return  <div className="col main-chat">
        <div className="header-chat row" style={{ gap: "1.6rem", padding:"1.6rem" }}>
            <AvatarCard listImg={[conversation?.Img ? conversation?.Img : user?.Img]} isOnline={true} />
            <div className="col" style={{ gap: "0.8rem"}}>
                <Text className='heading-7'>{conversation?.Name}</Text>
                {/* su dung socket */}
                <Text className="subtitle-4">{isOnline ? "Đang hoạt động" : ""}</Text> 
            </div>
        </div>
        {pinMessage.length > 1 && <div className='pin-message'>Pin</div>}
        <div className="col message" style={{ gap: "1.2rem"}}>
            {messages.map((mess: any, index: any) => {
                return <MessageCard key={`msg-${index}`} message={mess} customers={customers.filter((e:any) => e.Id !== user?.Id && e.Id === mess.CustomerId)} user={user}/>
            })}
        </div>
        <div className="message-input row">
            <Winicon src='fill/multimedia/microphone' size={'2rem'}/>
            <Winicon src='fill/multimedia/img' size={'2rem'}/>
            <TextField
                placeholder='Soạn tin nhắn'
                name='message'
                register={methods.register("message") as any}
                style={{ padding: '0 1.2rem', borderRadius: '2.4rem', height: '3.2rem', width: '26.8rem', flex: 1 }}
                prefix={<Winicon src='fill/emoticons/smile' size={'2rem'}/>}
                suffix={methods.watch("message") ? 
                    <div className="col" style={{ width:"2.4rem", height:"2.4rem", justifyContent:"center", alignItems:"center" }} >
                        <button onClick={methods.handleSubmit(SendMessage)}>
                            <Winicon src='fill/user interface/send-message' size={'2rem'} color="var(--primary-main-color)" />
                        </button>
                    </div>  : undefined}
                // textFieldStyle={{ borderRadius: "2.4rem" }}
                onComplete={methods.handleSubmit(SendMessage)}
            />
        </div>
    </div>
}

export default ChatDetails;