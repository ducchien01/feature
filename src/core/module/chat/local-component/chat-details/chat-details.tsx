import './chat-details.css'
import React, { useEffect, useRef, useState } from "react";
import { AvatarCard, MessageCard } from "../../../../../component/card";
import {  useForm } from "react-hook-form";
import {Winicon, Text, TextArea, showPopup, Popup } from "wini-web-components";
import { useParams } from "react-router-dom";
import { DataController } from "../../../../baseController";
import { randomGID } from "../../../../../common/Utils";
import { BaseDA } from '../../../../baseDA';
import { ConversatioStatus, ConversationType, emojiMap } from '../../../../../common/enum';
import { WiniIconName } from 'wini-web-components/dist/component/wini-icon/winicon';
import { useSelector } from 'react-redux';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';

const ChatDetails = ({user, socket, onlineUsers, setConversations }) => {
    const { conversationId } = useParams();
    const ref = useRef<any>()
    const textAreaRef = useRef<any>(null);
    const methods = useForm({ shouldFocusError: false });
    const messageController = new DataController("Message");
    const conversationController = new DataController("Conversation");
    const members = useSelector((state: any) => state.conversation.dataConversationMember);
    const customers = useSelector((state: any) => state.customer.dataParticipantCustomer);
    const participant = useSelector((state: any) => state.customer.dataParticipant);
   
    // const [members, setMember] = useState<Array<any>>([]);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [conversation, setConversation] = useState<any>();
    //state component
    const [selectdFilePreview, setSelectdFilePreview] = useState<Array<any>>([]);
    const [isSending, setIsSending] = useState(false);
    const [pinMessage, setPinMessage] = useState<Array<any>>([]);
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [userLastActive, setUserLastActive] = useState<any>();
    // const [isTyping, setIsTyping] = useState(false);
    // const [typingInfo, setTypingInfo] = useState(null);
    const [typingUsers, setTypingUsers] = useState<Array<any>>([]);
    const SendMessage = async (ev: any) => {
        if (isSending) return;
        setIsSending(true);
        if (!ev?.message?.trim() && !selectdFilePreview?.length) {
            return; 
        }
        // setIsSending(true);
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
            DateCreated: (new Date()).getTime()
        }
        listMessage.push(newMessage);
        try {
            if (selectdFilePreview?.length) {
                const uploadedFiles = await uploadFiles(selectdFilePreview);
                if (uploadedFiles) { 
                    uploadedFiles.forEach((file: any) => {
                        const newMessageMedia =  {
                            Id: randomGID(),
                            Name: "media",
                            CustomerId: user?.Id,
                            Content: "",
                            ConversationId: conversationId,
                            Sort: 1,
                            MediaUrl: file.Id,
                            Status: 1,
                            Type: file.Type === "video/mp4" ? 3 : 2,
                            DateCreated: (new Date()).getTime()
                        };
                        listMessage.push(newMessageMedia);
                    })
                }
            } 
            
            const sentMediaMessages = await Promise.all(
                listMessage.map((message) => sendSocketMessage(message))
            );
            setMessages((prev) => [...prev, ...sentMediaMessages]);
            
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
            methods.setValue("message","");
            setSelectdFilePreview([]);
        }
    }
        
    const sendSocketMessage = (message) => {
        return new Promise((resolve, reject) => {
            socket.emit("send_message", message , (response: any) => {
                if (response?.success) {
                    resolve(message); 
                } else {
                    reject(response?.error); 
                }
            });
        });
    };

    const handleAvatar = () => {
        debugger
        let imgs = Array<any>([]);
        let isOnline = false;
        let isGroup = false;
        let name = "";
        let lastActive: any;
        if (conversation?.Type === ConversationType.Group && members?.length > 1) {
            if (conversation?.Img){ 
                imgs = Array(conversation?.Img);
            } else {
                imgs = members.map(e => e?.Img);
            }
            if(conversation?.Status === ConversatioStatus.Online) isOnline = true;
            isGroup = true;
            name = conversation?.Name;
        } else if (conversation?.Type === ConversationType.Private && members?.length === 1) {
            if (onlineUsers.includes(members[0]?.Id)) {
                isOnline = true;
            }
            imgs = members?.map(e => e?.Img);
            isGroup = false;
            name = members[0]?.Name;
            lastActive= members[0]?.LastActive
        }
       
        return {
            name: name,
            isOnline: isOnline,
            isGroup: isGroup,
            imgs: imgs, 
            lastActive: lastActive
        }
    }
    const handleEmojiClick = (emojiData) => {
        // Lấy vị trí con trỏ
        const textarea = textAreaRef.current.getTextarea()!;
     
        if (textarea) {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const currentValue = textarea.value;
            
            const newMessage = currentValue.substring(0, startPos) + emojiData.emoji + currentValue.substring(endPos);

            methods.setValue("message", newMessage);
            textarea.focus();

            const newCaretPos = startPos + emojiData.emoji.length;
            textarea.setSelectionRange(newCaretPos, newCaretPos);
        }
      
    };

    const showEmojiPicker = (ev: any) => {
        const _box = ev.target.getBoundingClientRect()
        showPopup({                  
            ref: ref,
            style: { 
                top: `${_box.top - 50}px`,
                left: `${_box.left - 350}px`,
                position: "absolute", 
                width: "fit-contents" 
            },
            clickOverlayClosePopup:true,
            hideButtonClose:false,
            body: <EmojiPicker
            onEmojiClick={handleEmojiClick} 
            emojiStyle={EmojiStyle.APPLE} // Emoji set (Google, Apple, Twitter)
            lazyLoadEmojis={true}
            skinTonesDisabled={false} // Enable skin tone selection
            autoFocusSearch={false}
            onSkinToneChange ={ (e) => console.log("onSkinToneChange",e)}
            onReactionClick={(e) => console.log("onReactionClick",e)} 
        />
        })
    }

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

    const getConversation = async () => {
        try {
          const res =  await conversationController.getById(conversationId as string);
          setConversation(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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
  
    const uploadFiles = async (files) => {
        try {
            const uploadRes = await BaseDA.uploadFiles(files.map((file) => file.file));
            if (!uploadRes) throw new Error("Upload failed");
            return uploadRes;
        } catch (error) {
            console.error("Error uploading files:", error);
            throw error; 
        }
    };

    useEffect(() => {   
        if (!socket) return; 

        socket.on("receive_message", (data) => {
            console.log(data)
            if(data.ConversationId !== conversationId) {
                setMessages((prev) => [...prev, data]);
            }

            const updatedConversation = {
                ...conversation.find(e=>e.Id === conversationId),
                LastMessage: data.Content ,
                LastMessageTime: data.DateCreated,
            };

            setConversations((prevConversations: any[]) => {
                // Đưa conversation lên đầu danh sách
                const filteredConversations = prevConversations.filter((conv) => conv.Id !== conversationId);
                return [updatedConversation, ...filteredConversations];
            });
        });
        // socket.on("last_active", (data) => {
        //     console.log(data)
        // })
        const handleUserTyping = ({ senderId }) => {
            setTypingUsers((prev) => [...new Set([...prev, senderId])]);
        };
    
        const handleUserStopTyping = ({ senderId }) => {
            setTypingUsers((prev) => prev.filter((id) => id !== senderId));
        };
    
        socket.on("userTyping", handleUserTyping);
        socket.on("userStopTyping", handleUserStopTyping);

        return () => {
            socket.off('last_active');
            socket.off("userTyping", handleUserTyping);
            socket.off("userStopTyping", handleUserStopTyping);
            socket.disconnect();
        };
    },[socket])

    useEffect(() => {
        if(!conversationId) return;
        getConversation();
        getMessage();
    },[conversationId])

    useEffect(() => {
        const textarea = textAreaRef.current.getTextarea()!;
        
        if(textarea) {
            // const textarea = textAreaRef.current.getTextarea()!;
            // const message = methods.getValues("message");
              // Gửi sự kiện "đang nhập"
            // const handleTyping = () => {
            //     socket.emit("typing", { targetUserIds, senderId: userId });
            // };

            // // Gửi sự kiện "dừng nhập"
            // const handleStopTyping = () => {
            //     socket.emit("stopTyping", { targetUserIds, senderId: userId });
            // };
            const memberIds = members?.map(e => e.Id) ?? [];
            const handleKeyDown = (ev) => {
                debugger
                if (ev.key.toLowerCase() === "enter") {
                  ev.preventDefault(); // Chặn hành vi xuống dòng mặc định
                  methods.handleSubmit(SendMessage)(); // Gửi tin nhắn
                  textarea.style.height = "auto"; // Reset chiều cao sau khi gửi
                  socket.emit("stop-typing", {targetUserIds: memberIds , senderId: user?.Id });
                }
               
            };
            const handleKeyUp = (ev) => {
                debugger
                socket.emit("typing", { targetUserIds: memberIds, senderId: user?.Id });
            };
            textarea.style.padding = "1rem 0 1rem 0";
            textarea.addEventListener("keydown", handleKeyDown);
            textarea.addEventListener("keyup", handleKeyUp);
            return () => {
                textarea.removeEventListener("keydown", handleKeyDown);
                textarea.removeEventListener("keyup", handleKeyUp);
            };
        }
    },[SendMessage])
   
    // useEffect(() => {
    //     if (!socket) return;
    //     // Lắng nghe sự kiện "đang nhập"
    //     socket.on("userTyping", ({ senderId }) => {
    //       setTypingUsers((prev) => [...new Set([...prev, senderId])]);
    //     });
    
    //     // Lắng nghe sự kiện "dừng nhập"
    //     socket.on("userStopTyping", ({ senderId }) => {
    //       setTypingUsers((prev) => prev.filter((id) => id !== senderId));
    //     });
    
    //     // Cleanup khi unmount
    //     return () => {
    //       socket.off("userTyping");
    //       socket.off("userStopTyping");
    //     };
    // }, [user?.Id]);

    useEffect(() => {
        if (!socket) return;
        // Lắng nghe sự kiện "đang nhập"
        socket.on("userTyping", (data) => {
          setTypingUsers((prev) => [...new Set([...prev, data.senderId])]);
        });
    
        // Lắng nghe sự kiện "dừng nhập"
        socket.on("userStopTyping", (data) => {
          setTypingUsers((prev) => prev.filter((id) => id !== data.senderId));
        });
    
        // Cleanup khi component unmount
        return () => {
          socket.off("userTyping");
          socket.off("userStopTyping");
        };
      }, []);
    

    return  <div className="col main-chat">
        <Popup ref={ref} />
        <div className="header-chat row" style={{ gap: "1.6rem", padding:"1.6rem" }}>
                <AvatarCard 
                    key={conversationId} 
                    listImg={handleAvatar().imgs} 
                    isOnline={handleAvatar().isOnline} 
                    isGroup={handleAvatar().isGroup} 
                />
                <div className="col" style={{ gap: "0.8rem"}}>
                    <Text className='heading-7'>{handleAvatar().name}</Text>
                    {/* su dung socket */}
                    <Text className="subtitle-4">{handleAvatar().isOnline ? "Đang hoạt động" : timeDifferenceFromTimestamp(handleAvatar().lastActive)}</Text> 
                    {/* <Text className="subtitle-4">{handleAvatar(conversationId).isOnline ? "Đang hoạt động" : timeDifferenceFromTimestamp(customersConversation?.find((e: any) => e.Id !== user?.Id)?.LastActive)}</Text>  */}
                </div>
        </div>
        {pinMessage.length > 1 && <div className='pin-message'>Pin</div>}
        <div className="col message" style={{ gap: "1.2rem"}}>
            {messages?.map((mess: any, index: any) => {
                return <MessageCard key={`msg-${index}`} message={mess} customers={members ? members : []} user={user} />
            })}
            <div>
                {typingUsers.length > 0 && (
                <p>{`${typingUsers.join(", ")} đang nhập...`}</p>
            )}
      </div>
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
                <div className="row " style={{ width:"100%", flex: 1, gap:"1.2rem", padding:"0 1.6rem", borderRadius:"2.4rem", minHeight:"auto", maxHeight: "auto", backgroundColor:"#F2F5F8", }}>
                    <Winicon src='fill/emoticons/smile' size={'2rem'} onClick={ev => showEmojiPicker(ev)}/>
                        <TextArea
                            ref={textAreaRef}
                            autoFocus
                            id="textarea-message"
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
                        <button id='send' onClick={methods.handleSubmit(SendMessage)}>
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
        return `Hoạt động ${diffSeconds} giây trước`;
    } else if (diffMinutes < 60) {
        return `Hoạt động ${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `Hoạt động ${diffHours} giờ trước`;
    } else if (diffDays < 30) {
        return `Hoạt động ${diffDays} ngày trước`;
    } else {
        return `Hoạt động ${Math.floor(diffDays / 30)} tháng trước`; // Xấp xỉ số tháng
    }
};

export default ChatDetails;