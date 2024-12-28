import { CSSProperties, memo } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import {  NavLink } from "react-router-dom"
import { TextField, Text } from "wini-web-components"
import './card.css'
import { fileFormat, transformUrl } from "../common/Utils"
import Config from "../common/config"

type ConversationCardProps= {
    id?: string;
    index?: number;
    name?:string;
    listImg?: Array<any>;
    className?: string;
    groupChat?: boolean;
    sameSender?: boolean;
    isOnline?: boolean;
    newMessageAlert?: any;
    maxLength?: number;
    style?: CSSProperties;
};

export const ConversationCard = memo(function ChatCard({ id, className, name, listImg, groupChat, sameSender, isOnline, newMessageAlert, maxLength, style }: ConversationCardProps) {
    return <div className={className ?? 'col'} style={{ gap: '0.8rem', overflow: 'visible', width: '100%', ...(style ?? {}) }}>
        <NavLink to={`/chat/${id}`} >
           <div 
            style={{
                display:"flex",
                gap:"1rem",
                alignItems:"center",
                padding:'1rem',
                backgroundColor: sameSender ? "black" : "unset",
                color: sameSender ? "white" : "unset",
                position:"relative",
                
            }}
           >
           
            <AvatarCard listImg={listImg} isGroup={true} isOnline={true}/>

            <div>
                <Text>{name}</Text>
                {newMessageAlert && (
                    <Text>{newMessageAlert.count} New Message</Text>
                )}
            </div>
            {isOnline && (
                <div 
                    style={{
                        width:"10px",
                        height:"10px",
                        borderRadius:"50%",
                        backgroundColor:"green",
                        position:"absolute",
                        top:"50%",
                        right:"1rem",
                        transform:"translateY(50%)"
                    }}
                ></div>
            )}
           </div>
        </NavLink>
    </div>
});

type AvatarCardProps = {
    listImg?: Array<any>
    name?: string; // Tên người dùng
    isOnline?: boolean; // Trạng thái online
    isGroup?: boolean; // Hiển thị nhóm
    groupImages?: string[]; // Các hình ảnh trong nhóm (nếu là nhóm)
    // image: string; // URL hình ảnh của avatar
    style?: CSSProperties
}

export const AvatarCard = memo(function AvatarCard({ listImg = [], name, isOnline = false, isGroup = false, style }: AvatarCardProps) {
    // return <div className="row">
    //    {avatar?.map((e: any, index: number) => {
            // return <div>
            //     <img 
            //         key={`img-${index}`}
            //         src={e} 
            //         alt={`Avatar ${index}`}
            //         style={{
            //             width:"2rem",
            //             height:"2rem",
            //             border:"2px solid white",
            //         }} 

            //     />
            // </div>
            return <div className="avatar-container" style={{...(style ?? {})}}>
            {isGroup && listImg.length > 1 ? (
              <div className="group-avatar">
                {listImg.slice(0, 3).map((img, index) => (
                  img && <img key={index} src={Config.imgUrlId + img} alt={`group-${index}`} className="group-image" />
                ))}
              </div>
            ) : (
              <div className="single-avatar">
                {listImg[0] && <img src={transformUrl(Config.imgUrlId + listImg[0])} alt={name} className="avatar-image" />} 
                {isOnline && <span className="online-indicator"></span>}
              </div>
            )}
            <p className="avatar-name">{name}</p>
          </div>
    //    })}
    // </div>
});


type ProfileCardProps = {
    text?: string;
    icon?: string; 
    heading?: string; 
}

export const ProfileCard = memo(function ProfileCard({ text, icon, heading }: ProfileCardProps) {
    return <div className="profile-container">
        {icon && <div>{icon}</div>}
        <Text>{text}</Text>
        <Text>{heading}</Text>
    </div>
   
});

type MessageCardProps = {
    message?: any;
    user?: any; 
    customers?: any;
    // attachments?: any;
    // dateCreated?: any;
}

export const MessageCard = memo(function MessageCard({message, customers, user}: MessageCardProps) {
    const {CustomerId, Content, attachments = []} = message;
    const isUser = CustomerId === user?.Id;
    
    return <div className="row" 
                style={{ 
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    backgroundColor:"white",
                    color: "black",
                    borderRadius:"5px",
                    padding:"1.6rem",
                    maxWidth:"52.3rem",
                    width:"fit-content"
                }}
            >
               {!isUser && <AvatarCard listImg={customers.map((e: any) => e?.Img)}/>} 
                {Content && <Text>{Content}</Text>}
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
})

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
