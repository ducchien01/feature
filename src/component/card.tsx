import './card.css'
import { forwardRef, useRef, useState } from "react"
import {  NavLink, } from "react-router-dom"
import { Text, showPopup, Winicon, closePopup, Popup } from "wini-web-components"
import { transformUrl } from "../common/Utils"
import Config from "../common/config"
import { WiniIconName } from 'wini-web-components/dist/component/wini-icon/winicon'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import { useSelector } from 'react-redux'
import { emojiMap } from '../common/enum'
import { DataController } from '../core/baseController'

export function ConversationCard({ id, className, name, listImg, isGroup, isOnline, isRead, newMessage, lastMessageTime, style, handlerOnClick }: any) {
    const popupRef = useRef<any>(); 
    const user = useSelector((state: any) => state.customer.data);
    const [isHovered, setIsHovered] = useState(false); 

    const handleMessage = (objson: any) => {
        if (typeof objson !== 'string') {
            console.error('Dữ liệu đầu vào không phải là chuỗi JSON:', objson);
            return;
        }
        try {
            const obj = JSON.parse(objson); 
            if (obj?.CustomerId === user?.Id) {
                if (obj.Type === 1) {
                    return `Bạn: ${obj.Content}`;
                } else if (obj?.Type === 2) {
                    return `Bạn đã gửi một ảnh`;
                } else if (obj?.Type === 3) {
                    return `Bạn đã gửi một video`;
                }
            } else {
                if (obj?.Type === 1) {
                    return obj?.Content;
                } else if (obj?.Type === 2) {
                    return `[Hình ảnh]`;
                } else if (obj?.Type === 3) {
                    return `[Video]`;
                }
            }
        } catch (error) {
            console.error('Lỗi khi parse JSON:', error, 'Dữ liệu:', objson);
        }
        return;
    };

    const showConversationActions = (ev: any) => {  
        const _box = ev.target.getBoundingClientRect()
          showPopup({
            ref: popupRef,
            clickOverlayClosePopup: true,
            hideButtonClose: true,
            style: { 
                top: `${_box.y + _box.height + 2}px`,
                right: `${document.body.offsetWidth - _box.right}px`,
                position: 'absolute', 
                width: 'fit-contents' },
            content: <PopupConversationActions
              ref={popupRef}
              conversationId={id}
              userId ={user?.Id}
            />
        })
    }

    return <div className={className ?? `row`}
                style={{
                width: "100%",
                gap: "1.6rem",
                justifyContent: "space-between",
                maxWidth: "31.8rem",
                overflow: "visible",
                padding: "1.6rem 1.2rem",
                backgroundColor: isHovered
                    ? "var(--neutral-hover-background-color)"
                    : "unset",
                borderRadius: "0.8rem",
                ...(style ?? {}),
                }}
                onMouseEnter={() => {
                    setIsHovered(true)
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    closePopup(popupRef);
                }}
            >
        <Popup ref={popupRef} />
        <NavLink 
            to={`/chat/${id}`} 
            className="row" style={{ flex: 1, width:"100%", gap:"2rem",  alignItems: "center" }} 
            onClick={handlerOnClick}
        >
            <AvatarCard listImg={listImg} isGroup={isGroup} isOnline={isOnline}/>
            <div className="row" style={{ gap:"0.4rem", maxWidth:"26.6rem", alignItems:"flex-end"  }}>
                <div className="col" style={{ maxWidth:"13.6rem" }}>
                    <Text className={isRead ? "label-1" : "heading-7"} maxLine={1}>{name}</Text>
                    <Text className={isRead ? "subtitle-4" : "heading-9"} maxLine={1}>{newMessage}</Text>
                    {/* <Text className={isRead ? "subtitle-4" : "heading-9"} maxLine={1}>{handleMessage(newMessage) ?? ""}</Text> */}
                    {/* <Text className={isRead ? "subtitle-4" : "heading-9"} maxLine={1}>{newMessageAlert?.Content}</Text> */}
                </div>
                <Text className={"subtitle-4"} >. {lastMessageTime}</Text>
            </div>
        </NavLink>
        <div
            className="isread-container"
            onClick={showConversationActions}
            style={{
                position: 'relative',
                cursor: 'pointer',
            }}
        >
        {isHovered  ? (
            <Winicon className="hover-action" src="fill/layout/dots-vertical" size={"2rem"} />
        ) : (
            isRead && <div className="isread-conversation"></div>
        )}
        </div>
    </div>
};

export function AvatarCard({ listImg = [], name, isOnline = false, isGroup = false, style, isRead = false}: any) {
    return <div className="avatar-container" style={{...(style ?? {})}}>
        {isGroup && listImg.length > 1 ? (
            <div className="group-avatar">
                {listImg.slice(0, 2).map((img, index) => (
                    img && <img key={index} src={Config.imgUrlId + img} alt={`group-${index}`} className="group-avatar-item" />
                ))}
                 {isOnline && <span className="online-indicator"></span>}
            </div>) : (
            <div className="single-avatar">
                {listImg[0] && <img src={transformUrl(Config.imgUrlId + listImg[0])} alt={name} className="single-avatar-item" />} 
                {isOnline && <span className="online-indicator"></span>}
            </div>)}
            <p className="avatar-name">{name}</p>
          </div>
};

export function MessageCard({message, customers, user, isOnline}: any) {
    const { Id, CustomerId, Content, MediaUrl, Type = [], Status} = message;
    const isUser = CustomerId === user?.Id;
    const ref = useRef<any>();
    const messageController = new DataController("Message");
    const handlerRemove  = async () => {
        // const par = await messageController.getListSimple({ page: 1, size: 10, query:`@Id:{${Id}`});
        await messageController.edit([ { Id: Id, Status: 2 } ]);
    }
    const handlerDelete = async () => {
        // const par = await messageController.getListSimple({ page: 1, size: 10, query:`@Id:{${Id}`});
        await messageController.delete([Id]);
    }
    
    const showEmojiPicker = (ev: any) => {
        const _box = ev.target.getBoundingClientRect()
        showPopup({                  
            ref: ref,
            style: { 
                top: `${_box.top}px`,
                left: `${_box.right}px`,
                position: "absolute", 
                width: "fit-contents" 
            },
            clickOverlayClosePopup: true,
            hideButtonClose: false,
            body: <EmojiPicker
            // onEmojiClick={handleEmojiClick} // Custom click handler
            emojiStyle={EmojiStyle.NATIVE} // Emoji set (Google, Apple, Twitter)
            lazyLoadEmojis={true}
            skinTonesDisabled={false} // Enable skin tone selection
            autoFocusSearch={false}
            onSkinToneChange ={ (e) => console.log("onSkinToneChange",e)}
            reactionsDefaultOpen={true}
            onReactionClick={(e) => console.log("onReactionClick",e)} 
        />
        })
    }

    const showActionDelete = (ev: any) => {
        const _box = ev.target.getBoundingClientRect()
        showPopup({                  
            ref: ref,
            style: { 
                top: `${_box.top}px`,
                left: `${_box.right}px`,
                position: "absolute", 
                width: "fit-contents" 
            },
            clickOverlayClosePopup:true,
            hideButtonClose:false,
            body: <div className='col more-action-popup' style={{ padding: '1.2rem 0', width: '22rem' }}onClick={handlerRemove}>
                <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
                    <Winicon src='outline/users/user-c-frame' size={'1.6rem'}/>
                    <Text className='label-4'>Gỡ tin nhắn</Text>
                </button>
                <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }} onClick={handlerDelete}>
                    <Winicon src='outline/location/bookmark' size={'1.6rem'}/>
                    <Text className='label-4'>Xoá tin nhắn</Text>
                </button>
            </div>
        })
    }

    return <div className={"row mess-card"} style={{ width:"100%", alignItems:"flex-end", justifyContent: isUser ? "flex-end" : "flex-start", gap:"1.2rem" }}>
        <Popup ref={ref}/>
                {!isUser && <AvatarCard listImg={customers.filter(e=>e.Id === CustomerId).map((e: any) => e?.Img)} isOnline={isOnline}/>} 
                {isUser && message && <div key={`reaction-${Id}`} className="reaction-container">
                    <Winicon src='fill/health/heart' size={'2rem'} onClick={ev => showEmojiPicker(ev)}/>
                </div>}
                {isUser && message && <div key={`reply-${Id}`} className="reply-container">
                    <Winicon src='fill/arrows/reply' size={'2rem'} onClick={ev => showEmojiPicker(ev)}/>
                </div>}
                {isUser && message && <div key={`action-${Id}`} className="action-container">
                    <Winicon src='fill/layout/dots-vertical' size={'2rem'} onClick={showActionDelete}/>
                </div>}
                {Type === 1 && Content && <Text 
                        className="body-3" 
                        style={{ 
                            justifySelf: isUser ? "flex-end" : "flex-start",
                            backgroundColor: isUser ? "var(--primary-main-color)" : "var(--neutral-lighter-background-color)",
                            color: isUser ? "var(--neutral-text-stable-color)" : "var(--neutral-text-body-color)",
                            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            padding:"1.6rem",
                            maxWidth:"52.3rem",
                            width:"fit-content",
                            overflowWrap: "break-word", 
                            wordBreak: "break-word", 
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        {Status === 1 ? replaceEmojis(Content): Status === 2 ? "Tin nhắn đã gỡ" : undefined}
                    </Text>}
                {Type === 2 && MediaUrl  && <div key={`img-${Id}`}>
                    {RenderAttachement("image", MediaUrl)}
                </div>}
                {Type === 3 && MediaUrl  && <div key={`vd-${Id}`}>
                    {RenderAttachement("video", MediaUrl)}
                </div>}
                {!isUser && message && <div key={`action-${Id}`} className="action-container">
                    <Winicon src='fill/layout/dots-vertical' size={'2rem'} onClick={showActionDelete}/>
                </div>}
                {!isUser && message && <div key={`reaction-${Id}`} className="reaction-container">
                    <Winicon src='fill/health/heart' size={'2rem'} onClick={ev => showEmojiPicker(ev)}/>
                </div>}
                {!isUser && message && <div key={`reply-${Id}`} className="reply-container">
                    <Winicon src='fill/arrows/reply' size={'2rem'} onClick={ev => showEmojiPicker(ev)}/>
                </div>}
        </div>
}

const RenderAttachement = (file: string, url: string) => {
    switch (file) {
        case "video":
            return <div 
            style={{ 
                borderRadius: "8px",
                maxWidth: "52.3rem",
                width: "100%",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                position: "relative",
            }}
        >
            <video 
                src={Config.imgUrlId + url} 
                width="100%" 
                height="auto" 
                style={{ display: "block" }}
                controls 
                playsInline 
                autoPlay 
                loop 
                muted 
            />
        </div>
            
        case "image":
            return <div 
            style={{ 
                borderRadius: "8px",
                maxWidth: "14.8rem",
                maxHeight: "14.8rem",
                width: "100%",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
                position: "relative",
            }}
        >
            <img src={Config.imgUrlId + transformUrl(url, 200)} alt="Attachement" width={"100%"} height={"100%"} style={{ objectFit:"contain" }}/>
        </div>
        case "audio":
            return <audio src={Config.imgUrlId + url} preload="none" controls/>
        default:
            return <div>default</div>
    }
}

const PopupConversationActions = forwardRef(function PopupConversationActions(data: {conversationId: any, userId:any}, ref) {
    const participantController = new DataController("Participant");
    const handlerDelete = async () => {
        const par = await participantController.getListSimple({ page: 1, size: 10, query:`@ConversationId:{${data.conversationId}} @CustomerId:{${data.userId}}`});
        await participantController.edit([ {Id: par.data[0]?.Id, Status: 0} ]);
    }
    return <div className='col more-action-popup' style={{ padding: '1.2rem 0', width: '22rem' }}>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/users/user-c-frame' size={'1.6rem'}/>
            <Text className='label-4'>Đánh dấu đã đọc</Text>
        </button>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/location/bookmark' size={'1.6rem'}/>
            <Text className='label-4'>Bật thông báo</Text>
        </button>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }} onClick={handlerDelete}>
            <Winicon src='outline/health/heart' size={'1.6rem'}/>
            <Text className='label-4'>Xoá đoạn chat</Text>
        </button>
        {/* <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/health/heart' size={'1.6rem'}/>
            <Text className='label-4'>Xoá nhóm</Text>
        </button>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/health/heart' size={'1.6rem'}/>
            <Text className='label-4'>Rời nhóm</Text>
        </button> */}
    </div>
})
  

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
