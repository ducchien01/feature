import './chat-details.css'
import React, { useEffect, useState } from "react";
import { AvatarCard, MessageCard } from "../../../../../component/card";
import {  useForm } from "react-hook-form";
import {Winicon, Text, TextArea } from "wini-web-components";
import { useParams } from "react-router-dom";
import { DataController } from "../../../../baseController";
import { Ultis, randomGID } from "../../../../../common/Utils";
import { BaseDA } from '../../../../baseDA';
import { emojiMap } from '../../../../../common/enum';
import { WiniIconName } from 'wini-web-components/dist/component/wini-icon/winicon';
import { useSelector } from 'react-redux';

const ChatDetails = ({user, socket, onlineUsers }) => {
    const { conversationId } = useParams();
    const methods = useForm({ shouldFocusError: false });
    const messageController = new DataController("Message");
    const customers = useSelector((state: any) => state.customer.dataParticipantCustomer);
    const participants = useSelector((state: any) => state.customer.dataParticipant);
    const conversation = useSelector((state: any) => state.conversation.data);

    // state API
    const [messages, setMessages] = useState<Array<any>>([]);
    const [customersConversation, setCustomersConversation] = useState<Array<any>>([]);
    
    //state component
    const [selectdFilePreview, setSelectdFilePreview] = useState<Array<any>>([]);
    const [isSending, setIsSending] = useState(false);
    const [pinMessage, setPinMessage] = useState<Array<any>>([]);
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [userLastActive, setUserLastActive] = useState<any>();

    const getMessage = async () => {
        try {
            await messageController.getListSimple({
                page: 1, 
                size: 20,
                query: `@ConversationId:{${conversationId}}`,
                sortby: { BY: "DateCreated", DIRECTION:"ASC"}
            }).then((res: any) => {
                setMessages(res.data);
            })
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const getCustomerConversation = () => {
        const customerConversation = participants?.filter((e: any) => e.ConversationId === conversationId).map((e: any) => e.CustomerId);
        setCustomersConversation(customers?.filter((e: any) => customerConversation?.includes(e.Id)));
    }
  
    const handleFilePreview = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map((file: any, index) => ({
          id: `${file.name}-${index}-${Date.now()}`,
          file,
          previewUrl: file.type.startsWith("image/") || file.type.startsWith("video/")
            ? URL.createObjectURL(file)
            : null,
        }));
        setSelectdFilePreview((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleRemoveFilePreview = (id: string) => {
        setSelectdFilePreview((prev) => prev.filter((file) => file.id !== id));
    };

    const SendMessage = async (ev: any) => {
        if (isSending) return;
        setIsSending(true);
        const listMessage: Array<any> = [];
        
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

        if (selectdFilePreview?.length) {
            const uploadRes = await BaseDA.uploadFiles(selectdFilePreview.map(e => e.file));
            if (uploadRes) { 
                uploadRes.map((e: any) => {
                    const newMessageMedia =  {
                        Id: randomGID(),
                        Name: "new_message_video",
                        CustomerId: user?.Id,
                        Content: "",
                        ConversationId: conversationId,
                        Sort: 1,
                        MediaUrl: e.Id,
                        Status: 1,
                        Type: 3,
                        DateCreated: (new Date()).getTime()
                    }

                    if(e.Type === "video/mp4") {
                        newMessageMedia.Type = 3;
                    } else {
                        newMessageMedia.Type = 2;
                    }
                    listMessage.push(newMessageMedia);
                })
            }
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

        Promise.all(
            listMessage.map((message) => {
                return new Promise((resolve, reject) => {
                    socket.emit("send_message", message, (response: any) => {
                        if (response?.success) {
                            resolve(message); 
                        } else {
                            reject(response?.error); 
                        }
                    });
                });
            })
        )
        .then((sentMessages) => {
            setMessages((list) => [...list, ...sentMessages]);
        })
        .catch((error) => {
            console.error("Failed to send one or more messages:", error);
        })
        .finally(() => {
            setIsSending(false); 
        });

        methods.setValue("message","");
        setSelectdFilePreview([]);
    }

    useEffect(() => {   
        if (!socket) return; 

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
   
        return () => {
            socket.off('last_active');
            socket.disconnect();
        };
    },[socket])

    useEffect(() => {
        if(!conversationId) return;
        
        getMessage();
        getCustomerConversation();

        if(!socket) return;
        if(conversation?.Type === 1) {

            const idCus = customersConversation?.find((e: any) => e.Id !== user?.Id)
            socket.emit('request_last_active', idCus);
            socket.on('last_active', (data) => {
                console.log(`User ${data.userId} last active at: ${data.lastActiveTime}`);
                setUserLastActive(data.lastActiveTime)
            });
            if(!onlineUsers.includes(idCus)) {
                setIsOnline(false);
            }
        }
    },[conversationId])
   
    return  <div className="col main-chat">
        <div className="header-chat row" style={{ gap: "1.6rem", padding:"1.6rem" }}>
            {conversation?.Type === 1 ? <>
                <AvatarCard 
                    key={conversation?.Id} 
                    listImg={[customersConversation?.find((e: any) => e.Id !== user?.Id)?.Img]} 
                    isOnline={isOnline} 
                    isGroup={false} 
                />
                <div className="col" style={{ gap: "0.8rem"}}>
                    <Text className='heading-7'>{customersConversation?.find((e: any) => e.Id !== user?.Id)?.Name}</Text>
                    {/* su dung socket */}
                    <Text className="subtitle-4">{isOnline ? "Đang hoạt động" : timeDifferenceFromTimestamp(customersConversation?.find((e: any) => e.Id !== user?.Id)?.LastActive)}</Text> 
                </div>
            </> : <>
                <AvatarCard 
                    key={conversation?.Id} 
                    listImg={[
                        ...(conversation?.Img ? (Array.isArray(conversation?.Img) ? conversation?.Img : [conversation?.Img]) : 
                            customersConversation?.filter((e: any) => e.Id !== user?.Id).map((e: any) => e?.Img))
                        ]}  
                    isGroup={true}
                    isOnline={true}     
                />
                <div className="col" style={{ gap: "0.8rem"}}>
                    <Text className='heading-7'>{conversation?.Name}</Text>
                    {/* su dung socket */}
                    <Text className="subtitle-4">{"Đang hoạt động"}</Text> 
                </div>
            </>}
        </div>
        {pinMessage.length > 1 && <div className='pin-message'>Pin</div>}
        <div className="col message" style={{ gap: "1.2rem"}}>
            {messages.map((mess: any, index: any) => {
                return <MessageCard key={`msg-${index}`} message={mess} customers={customersConversation?.filter((e:any) => e.Id !== user?.Id && e.Id === mess.CustomerId)} user={user}/>
            })}
        </div>
        <div className="message-input row"  style={{ height: "auto", gap:"2.4rem"}}>
                <div className='media row' style={{ gap: "1.6rem", alignItems:"flex-end", height:"100%", paddingBottom:"2rem" }}>
                    <div className="media-voice row" >
                        <Winicon src='fill/multimedia/microphone' size={'2rem'} />
                        <input type="file" className="row" style={{ display: "none"}}/>
                    </div>
                    <div className="media-file row" >
                        <label htmlFor="file-input" style={{ cursor: "pointer"}}>
                            <Winicon src='fill/multimedia/img' size={'2rem'} />
                        </label>
                        <input id='file-input' type="file" multiple className="row" style={{ display: "none"}} onChange={handleFilePreview}/>
                    </div>
                </div>
            <div className="col" style={{ width:"100%", flex: 1}}>
                {selectdFilePreview.length > 0 ? <div className="file-preview row" >
                    {selectdFilePreview.map((file) => (
                         <div
                         key={file.id}
                         className="file-item"
                         style={{
                           alignItems: "center",
                           borderRadius: "4px",
                           position: "relative",
                         }}
                       >
                         {file.previewUrl ? (
                           file.file.type.startsWith("image/") ? (
                                <img src={file.previewUrl} alt={file.file.name} style={{ width: "5.6rem", height: "5.6rem", borderRadius: "8px", objectFit: "cover" }} />
                            ) : (
                                <video src={file.previewUrl} style={{ width: "5.6rem", height: "5.6rem", borderRadius: "8px" }}/>
                            )
                        ) : (<div className="row" style={{ padding:" 0 1.2rem", alignItems:"center", maxWidth: "21.9rem", borderRadius: "8px", gap: "1.6rem", backgroundColor:"var(--neutral-main-background-color)" }}>
                                <Winicon src="fill/files/file" size={"2rem"}/>
                                <Text style={{ width: "100%", flex: 1, height: "5.6rem", borderRadius: "8px", textAlign: "left", wordBreak:"break-word", maxLines: 2 }}>
                                    {file.file.name}
                                </Text>
                            </div>
                         )}
                         <Winicon 
                            src={"fill/user interface/e-remove"} 
                            size={"1.4rem"} 
                            style={{ 
                                justifyContent:"center", 
                                alignItems:"center", 
                                backgroundColor:"#fff", 
                                position:"absolute", 
                                width:"2rem", 
                                height:"2rem", 
                                border:"var(--neutral-main-border)",
                                borderRadius:"50%", 
                                top: 0, 
                                right: 0 
                            }}
                            onClick={() => handleRemoveFilePreview(file.id)}
                            />
                       </div>
                    ))}
                </div> : undefined}
                <div className="row" style={{ width:"100%", flex: 1, gap:"1.2rem", padding:"0 1.6rem", borderRadius:"2.4rem", minHeight:"auto", maxHeight: "auto", backgroundColor:"#F2F5F8", }}>
                    <Winicon src='fill/emoticons/smile' size={'2rem'}/>
                        <TextArea
                            ref={txtRef => {
                                if(txtRef) {
                                    const textarea = txtRef.getTextarea()!;
                                    // const message = methods.getValues("message");
                                    textarea.style.padding = "1rem 0 1rem 0";
                                    textarea.onkeydown = (ev) => {
                                            // if (ev.key === "Enter" && message.trim()) {
                                            if (ev.key === "Enter") {
                                                ev.preventDefault();
                                                // Xử lý emoji trước khi gửi
                                                // methods.setValue("message", replaceEmojis(message)) ; 
                                                methods.handleSubmit(SendMessage)();
                                                textarea.style.height = "auto";
                                            }
                                        }
                                    }
                                }
                            }
                            autoFocus
                            className="body-3"
                            placeholder='Soạn tin nhắn'
                            name='message'
                            register={methods.register("message", {
                                onChange: (ev: any) => {
                                    const textarea = ev.target;
                                    // const parent = textarea.closest(".text-area-container");
                                    // parent.style.height = "auto";
                                    textarea.style.height = "auto";
                                    textarea.style.minHeight = "4rem";
                                    textarea.style.maxHeight = "14.2rem";
                                    textarea.style.height = `${textarea.scrollHeight}px`
                                },
                            }) as any}
                            style={{ 
                                width: "100%",
                                flex: 1,
                                padding: "1rem  1rem 0rem",
                                height: "auto", 
                                minHeight: "4rem", 
                                maxHeight: "14.2rem",
                                border: 0,
                                scrollbarWidth: "none", 
                            }}
                        />
                    {methods.watch("message") || selectdFilePreview.length > 0 ? 
                    <div className="col" style={{ width:"2.4rem", height:"2.4rem", justifyContent:"center", alignItems:"center" }}>
                        <button  onClick={methods.handleSubmit(SendMessage)}>
                            <Winicon src='fill/user interface/send-message' size={'2rem'} color="var(--primary-main-color)" />
                        </button>
                    </div>  : undefined}
                </div>
            </div>
        </div>
    </div>
}
    
const replaceEmojis = (text: string): JSX.Element[] => {
    const regex = new RegExp(
        `(${Object.keys(emojiMap)
            .map((key) => key.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"))
            .join("|")})`,
        "g"
    );
    
    const parts = text.split(regex);

    return parts.map((part, index) =>
        emojiMap[part] ? (
            <Winicon key={index} src={emojiMap[part] as WiniIconName} size={ "4rem"} />
        ) : (
            <span key={index}>{part}</span>
        )
    );
};
const timeDifferenceFromTimestamp = (timestamp: number): string => {
    const now = Date.now(); // Lấy thời gian hiện tại (timestamp)
    const diffMs = now - timestamp; // Sự khác biệt thời gian (milliseconds)

    const diffSeconds = Math.floor(diffMs / 1000); // Chuyển đổi sang giây
    const diffMinutes = Math.floor(diffSeconds / 60); // Chuyển đổi sang phút
    const diffHours = Math.floor(diffMinutes / 60); // Chuyển đổi sang giờ
    const diffDays = Math.floor(diffHours / 24); // Chuyển đổi sang ngày

    if (diffSeconds < 60) {
        return `${diffSeconds} giây trước`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else if (diffDays < 30) {
        return `${diffDays} ngày trước`;
    } else {
        return `${Math.floor(diffDays / 30)} tháng trước`; // Xấp xỉ số tháng
    }
};

export default React.memo(ChatDetails);