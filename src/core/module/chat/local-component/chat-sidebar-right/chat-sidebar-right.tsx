import "./chat-sidebar-right.css"
import {Text, Winicon, showPopup, Popup} from "wini-web-components"
import { AvatarCard } from "../../../../../component/card";
import { useEffect, useRef, useState } from "react";
import { DataController } from "../../../../baseController";
import { useParams } from "react-router-dom";
import { Ultis } from "../../../../../common/Utils";
import { PopupAddMembers } from "./popup-add-member";
import React from "react";

const ChatSideBarRight = ({user, socket}) => {
    const ref = useRef<any>();
    const { conversationId } = useParams();
    const customerController = new DataController("Customer");
    const participantController = new DataController("Participant");
    const [isOnline, setIsOnline] = useState<boolean>(true)
    const [isOpen, setIsOpen] = useState<Array<boolean>>([false, false, false]);
    const [members, setMembers] = useState<Array<any>>([]);

    const showAddMember = (ev: any) => {  
        const _box = ev.target.getBoundingClientRect()
          showPopup({
            ref: ref,
            style: { 
                top: `${_box.y + _box.height + 2}px`,
                right: `${document.body.offsetWidth - _box.right}px`,
                position: "absolute", 
                width: "fit-contents" },
            content: <PopupAddMembers ref={ref} members= {members.map((e: any) => e.Id)} conversationId={conversationId} user={user}/>
        })
    }

    const getMember = async () => {
        const participantRes = await  participantController.getListSimple({
            page: 1,
            size: 20,
            query:`@ConversationId:{${conversationId}}`,
            returns: ["CustomerId"]
        })

        const customerRes = await customerController.getByListId(Ultis.removeDuplicates(participantRes.data.map((e: any) => e.CustomerId)));
        setMembers([...customerRes.data]);
    }

    useEffect(() => {
        getMember();
    }, [conversationId])

    return <div className="right-sidebar col">
        <Popup ref={ref} />
        <div className="col main">
            <div className="heading-info col">
                <AvatarCard listImg={[user?.Img]} isOnline={true}/>
                <Text>{user?.Name}</Text>
                <Text>{isOnline ? "Đang hoạt động" : ""}</Text>
            </div>
            <div className="action row" style={{ gap: "0.8rem", padding:"1.6rem 0", justifyContent: "center" }}>
                <div className="toggle-notificaton col" style={{ width:"10rem", gap: "0.8rem", alignItems: "center" }}>
                    <Winicon src="fill/user interface/bell" size={"1.6rem"} style={{ width: "3.2rem", height: "3.2rem", borderRadius: "50%", backgroundColor: "var(--neutral-lighter-background-color)", alignItems: "center", justifyContent: "center"}}/>
                    <Text className="subtitle-4">Tắt thông báo</Text>
                </div>
                <div className="search-media col" style={{ width:"10rem", gap: "0.8rem", alignItems: "center" }}>
                    <Winicon src="fill/development/zoom" size={"1.6rem"} style={{ width: "3.2rem", height:"3.2rem", borderRadius: "50%", backgroundColor: "var(--neutral-lighter-background-color)", alignItems: "center", justifyContent: "center"}}/>
                    <Text className="subtitle-4">Tìm kiếm</Text>
                </div>
            </div> 
            <div className="col" style={{ gap: "1.2rem" }}>
                {/* sau lam card  */}
                <div className="setting col" style={{ gap: "1.2rem" }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                        <Text className="heading-8" style={{ fontWeight: "600" }}>Tuỳ chỉnh nhóm chat</Text>
                        <Winicon onClick={() => setIsOpen([!isOpen[0], isOpen[1], isOpen[2]])} src={isOpen[0] ? "outline/arrows/down-arrow" : "outline/arrows/up-arrow"} size={"1.6rem"}/>
                    </div>
                    {isOpen[0] ? (
                        <>
                            <div className="row" style={{ padding: "0.9rem 0", gap: "1.2rem" }}>
                                <Winicon src="outline/education/pencil" size={"1.6rem"}/>
                                <Text className="label-3" style={{ flex:1 }}>Đổi tên nhóm chat</Text>
                            </div>
                            <div className="row" style={{ padding: "0.9rem 0", gap: "1.2rem"}}>
                                <Winicon src="outline/text/img" size={"1.6rem"}/>
                                <Text className="label-3" style={{ flex: 1 }}>Thay đổi ảnh nhóm</Text>
                            </div>
                        </>): undefined
                    }
                    
                </div>
                <div className="file col" style={{ gap:"1.2rem" }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                        <Text className="heading-8" style={{ fontWeight: "600"}}>File, tep, hinh anh, link</Text>
                        {/* <Winicon src="outline/text/img" size={"2rem"}/> */}
                        <Winicon onClick={() => setIsOpen([isOpen[0], !isOpen[1], isOpen[2]])} src={isOpen[1] ? "outline/arrows/down-arrow" : "outline/arrows/up-arrow"} size={"1.6rem"}/>
                    </div>
                    {isOpen[1] ? (
                        <>
                            <div className="row" style={{ padding: "0.9rem 0", gap:"1.2rem" }}>
                                <Winicon src="outline/text/img" size={"2rem"}/>
                                <Text className="label-3" style={{ flex:1 }}>Hình ảnh</Text>
                            </div>
                            <div className="row" style={{ padding: "0.9rem 0", gap:"1.2rem" }}>
                                <Winicon src="outline/files/file-text" size={"2rem"}/>
                                <Text className="label-3" style={{ flex:1 }}>Tệp</Text>
                            </div>
                            <div className="row" style={{ padding: "0.9rem 0", gap:"1.2rem" }}>
                                <Winicon src="outline/text/link" size={"2rem"}/>
                                <Text className="label-3" style={{ flex: 1}}>Liên kết</Text>
                            </div>
                        </>): undefined
                    }
                </div>
                <div className="participant col" style={{ gap: "1.2rem" }}>
                    <div className="row" style={{ justifyContent:"space-between" }}>
                        <Text className="heading-8" style={{ fontWeight: "600" }}>Thành viên (3)</Text>
                        <Winicon onClick={() => setIsOpen([isOpen[0], isOpen[1], !isOpen[2]])} src={isOpen[2] ? "outline/arrows/down-arrow" : "outline/arrows/up-arrow"} size={"1.6rem"}/>
                    </div>
                    {isOpen[2] ? (
                        <div className="col" style={{ gap: "1.6rem" }}>
                            <div className="row" style={{ padding: "0.9rem 0", gap: "1.2rem" }}>
                                <Winicon 
                                    src="fill/user interface/e-add" 
                                    size={"1.6rem"} 
                                    style={{ width: "3.2rem", height: "3.2rem", borderRadius:"50%", backgroundColor:"var(--neutral-lighter-background-color)", alignItems: "center", justifyContent: "center"}}
                                    onClick={showAddMember}
                                />
                                <Text className="label-3" style={{ flex: 1 }}>Thêm thành viên</Text>
                            </div>
                            <div className="col" style={{ gap: "2rem", overflowY:"auto", }}>
                                {members.length > 1 ? 
                                    members.map((member: any, index: any) => {
                                        return <div className="row" key={`mb-${index}`} style={{ justifyContent:"space-between"}}>
                                            <div className="row" style={{ gap: "1rem" }}>
                                                <AvatarCard listImg={[member?.Img]}/>
                                                <div className="col">
                                                    <Text className="label-3">{member?.Name}</Text>
                                                    <Text className="subtitle-4">Role</Text>
                                                </div>
                                            </div>
                                            <Winicon src="fill/layout/dots" size={"1.6rem"}/>
                                        </div>
                                    }) : undefined
                                }
                            </div>
                            {members.length ? <Text className="button-text-3">Xem thêm</Text> : undefined}
                        </div>
                    ) : undefined }
                </div>
            </div>
        </div>
        <div className="leave-group">
            <Text className="label-3" style={{ color: "var(--secondary6-main-color)" }}>Rời nhóm</Text>
        </div>
    </div>
}

export default React.memo(ChatSideBarRight);
