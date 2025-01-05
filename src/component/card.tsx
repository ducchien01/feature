import './card.css'
import { CSSProperties, forwardRef, memo, useRef, useState } from "react"
// import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import {  NavLink } from "react-router-dom"
import { TextField, Text, showPopup, Winicon, closePopup, Popup } from "wini-web-components"
import { fileFormat, transformUrl } from "../common/Utils"
import Config from "../common/config"

type ConversationCardProps= {
    id?: string;
    index?: number;
    className?: string;
    name?:string; // name chat
    listImg?: Array<any>;
    isGroup?: boolean; // group - private chat
    sameSender?: boolean;
    isOnline?: boolean;
    isRead?: boolean;
    newMessage?: any;
    lastMessageTime?:any;
    maxLength?: number;
    style?: CSSProperties;
};

export function ConversationCard({ id, className, name, listImg, isGroup, isOnline, isRead, newMessage, lastMessageTime, style }: ConversationCardProps) {
    const popupRef = useRef<any>();  
    const [isHovered, setIsHovered] = useState(false); // Trạng thái để kiểm tra hover

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
            />
        })
    }

    return <div className={className ?? "row"}
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
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    closePopup(popupRef);
                }}
            >
        <Popup ref={popupRef} />
        <NavLink to={`/chat/${id}`} className="row" style={{ flex: 1, width:"100%", gap:"2rem",  alignItems: "center", }}>
            <AvatarCard listImg={listImg} isGroup={isGroup} isOnline={isOnline}/>
            <div className="row" style={{ gap:"0.4rem", maxWidth:"26.6rem", alignItems:"flex-end"  }}>
                <div className="col" style={{ maxWidth:"13.6rem" }}>
                    <Text className={isRead ? "label-1" : "heading-7"} maxLine={1}>{name}</Text>
                    <Text className={isRead ? "subtitle-4" : "heading-9"} maxLine={1}>{newMessage}</Text>
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

type AvatarCardProps = {
    listImg?: Array<any>
    name?: string; // Tên người dùng
    isOnline?: boolean; // Trạng thái online
    isGroup?: boolean;
    isRead?:boolean; // Hiển thị nhóm
    groupImages?: string[]; // Các hình ảnh trong nhóm (nếu là nhóm)
    // image: string; // URL hình ảnh của avatar
    style?: CSSProperties;
}

export function AvatarCard({ listImg = [], name, isOnline = false, isGroup = false, style, isRead = false}: AvatarCardProps) {
    return <div className="avatar-container" style={{...(style ?? {})}}>
        {isGroup && listImg.length > 1 ? (
            <div className="group-avatar">
                {listImg.slice(0, 2).map((img, index) => (
                    img && <img key={index} src={Config.imgUrlId + img} alt={`group-${index}`} className="group-avatar-item" />
                ))}
            </div>) : (
            <div className="single-avatar">
                {listImg[0] && <img src={transformUrl(Config.imgUrlId + listImg[0])} alt={name} className="single-avatar-item" />} 
                {isOnline && <span className="online-indicator"></span>}
            </div>)}
            <p className="avatar-name">{name}</p>
          </div>
};

type ProfileCardProps = {
    text?: string;
    icon?: string; 
    heading?: string; 
}

export function ProfileCard({ text, icon, heading }: ProfileCardProps) {
    return <div className="profile-container">
        {icon && <div>{icon}</div>}
        <Text>{text}</Text>
        <Text>{heading}</Text>
    </div>
   
};

type MessageCardProps = {
    message?: any;
    user?: any; 
    customers?: any;
    // attachments?: any;
    // dateCreated?: any;
}

export function MessageCard({message, customers, user}: MessageCardProps) {
    const {CustomerId, Content, attachments = []} = message;
    const isUser = CustomerId === user?.Id;
    
    return <div className={"row"} style={{ width:"100%", alignItems:"flex-start", justifyContent: isUser ? "flex-end" : "flex-start" }}>
               {!isUser && <AvatarCard listImg={customers.map((e: any) => e?.Img)}/>} 
                {Content && <Text 
                    className="body-3" 
                    style={{ 
                        justifySelf: isUser ? "flex-end" : "flex-start",
                        backgroundColor: isUser ? "var(--primary-main-color)" : "var(--neutral-lighter-background-color)",
                        color: isUser ? "var(--neutral-text-stable-color)" : "var(--neutral-text-body-color)",
                        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding:"1.6rem",
                        maxWidth:"52.3rem",
                        width:"fit-content",
                        overflowWrap: "break-word", // Thêm dòng này để xuống dòng khi nội dung dài
                        wordBreak: "break-word", // Thêm dòng này để hỗ trợ ngắt từ trong nội dung
                        whiteSpace: "pre-wrap" // Đảm bảo xuống dòng đúng cách
                    }}
                >
                    {Content}
                </Text>}
                {attachments.length > 0 && 
                    attachments.map((attachment: any, index: any) => {
                        const url = attachment.url;
                        const file = fileFormat(url);
                        
                        return <div key={`c-${index}`}>
                            <a 
                                href={url}
                                download
                                target="_blank"
                                style={{color:"black"}}
                            >
                                {RenderAttachement(file, url)}
                            </a>
                        </div>
                    })
                }
        </div>
}

const RenderAttachement = (file: string, url: string) => {
    switch (file) {
        case "video":
            return <video src={url} preload="none" width={"200px"} controls/>
        case "image":
            return <img src={transformUrl(url, 200)} alt="Attachement" width={"200px"} height={"150px"} style={{ objectFit:"contain" }}/>
        case "audio":
            return <audio src={url} preload="none" controls/>
        default:
            return <div>default</div>
    }
}

const PopupConversationActions = forwardRef(function PopupConversationActions(data, ref) {
    return <div className='col more-action-popup' style={{ padding: '1.2rem 0', width: '22rem' }}>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/users/user-c-frame' size={'1.6rem'}/>
            <Text className='label-4'>Trang cá nhân</Text>
        </button>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/location/bookmark' size={'1.6rem'}/>
            <Text className='label-4'>Trang cá nhân</Text>
        </button>
        <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
            <Winicon src='outline/health/heart' size={'1.6rem'}/>
            <Text className='label-4'>Wishlist</Text>
        </button>
    </div>
})
  
