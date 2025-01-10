import { TextField, Winicon, closePopup, Text, Button } from "wini-web-components";
import { AvatarCard } from "../../../../../component/card";
import { CheckboxForm } from "../../../../../component/form";
import { forwardRef, useEffect, useState } from "react";
import { Ultis, randomGID } from "../../../../../common/Utils";
import { DataController } from "../../../../baseController";
import { useFieldArray, useForm } from "react-hook-form";

export const PopupAddMembers = forwardRef(function PopupAddMembers(data: { members: Array<any>, user: any, conversationId: any }, ref: any) {
    const methods = useForm<any>({ shouldFocusError: false, defaultValues: { search :"", memberSelected : [] }});
    const membersSelected = useFieldArray({
        control: methods.control,
        name: "memberSelected",
        keyName: undefined
    });
    const [searchResult, setSearchResult] = useState<Array<any>>([]);
    const [suggestMember, setSuggestMember] = useState<Array<any>>([]);
    const customerController = new DataController("Customer");
    const particiantController = new DataController("Participant");
    const friendController = new DataController("Friend");

    const handleRemoveMember = (memberId: string) => {
        const indexToRemove = membersSelected.fields.findIndex((item) => item.Id === memberId);
        if (indexToRemove !== -1) {
          membersSelected.remove(indexToRemove);
          methods.setValue(memberId, false); 
        }
    };

    const getSuggest = async () => {
        const friendRes = await friendController.getListSimple({
            page: 1,
            size: 20,
            query:`(@CustomerId:{${data.user?.Id}}) | (@FriendId:{${data.user?.Id}}) @Status:[1 1]`
        })

        const listUser = friendRes.data.map((e: any) => {
            if(e.CustomerId ===  data.user?.Id) return e.FriendId;
            if(e.FriendId ===  data.user?.Id) return e.CustomerId;
        });

        const customerRes = await customerController.getByListId(Ultis.removeDuplicates(listUser));
        const sugMember = customerRes.data.filter((e: any) => !data.members.includes(e.Id));
        setSuggestMember([...suggestMember, ...sugMember])
    }

    const searchMember = async (value: string) => { 
        const resultSearch = suggestMember.map((e: any) => e.Id)
        const searchText = value.split(" ").map(word => `%${word}%`).join(" "); 
        const res = await customerController.getListSimple({
            page: 1, 
            size: 20,
            query:`@Name:(${searchText})`
        })
        // lọc người dùng từ sugget(là bạn bè hoặc người chưa vào nhóm) chỉ hiển thị những người dngf trong suggest
        const filterMember = res?.data.filter((e: any) => resultSearch.includes(e.Id))
        setSearchResult(filterMember)
    } 

    const addMember = async (memberList: Array<any>) => {
        const listParticipant: Array<any> = [];
        await memberList.map((mem: any) => {
            const newParticipant = {
                Id: randomGID(),
                Name: `Member-${mem.Name}-${data.conversationId}`,
                ConversationId: data.conversationId,
                CustomerId: mem.Id,
                DateCreated: (new Date()).getTime(),
            }
            listParticipant.push(newParticipant)
        });
        await particiantController.add(listParticipant);
    }

    useEffect(() => {
        getSuggest()
    }, [])

    return <div className="col more-action-popup" style={{ padding: "1.2rem 2.4rem", gap:"2.4rem", width: "40%", height:"80%" }}>
        <div className="row" style={{ gap: "0.8rem", padding: "0.8rem", paddingLeft: "2.4rem" }}>
            <Text className="heading-7" style={{ flex: 1 }}>Thêm người</Text>
            <button type="button" className="row icon-button32" onClick={() => { closePopup(ref) }}>
                <Winicon src={"fill/user interface/e-remove"} size={"2.4rem"} />
            </button>
        </div>
        <div className="col" style={{ flex: 1, gap: "1rem" }}>
            <TextField
                className="search-default body-3"
                name="searchMember"
                placeholder="Tìm kiếm bạn bè"
                style={{ height: "4rem", padding: "0.8rem 1.6rem", margin: "0.4rem 0" }}
                register={methods.register("searchMember" , {
                    onChange: (e: any) => {
                        searchMember(e.target.value)
                    }
                }) as any}
                prefix={<Winicon src="fill/development/zoom" size={"1.6rem"}/>}
                
            />
            <div className="row" style={{ width: "100%", height: "10rem", padding: "2.4rem", gap: "1rem", overflowX:"scroll"}}>
                {membersSelected.fields.length > 0  ? 
                    membersSelected.fields.map((member: any, index: any) => {
                        return <div key={member.Id} className="col" style={{ width: "8rem", alignItems:"center", justifyContent:"center"}} >
                            <div className="row" style={{ position:"relative" }}>
                                <AvatarCard key={`mbsl-${member.Id}`} listImg={[member?.Img]}/>
                                <Winicon 
                                    src={"fill/user interface/e-remove"} 
                                    size={"1.4rem"} 
                                    style={{ justifyContent:"center", alignItems:"center", backgroundColor:"#fff", position:"absolute", width:"2rem", height:"2rem", borderRadius:"50%", top: 0, right: 0 }}
                                    onClick={() => handleRemoveMember(member.Id) }  
                                />
                            </div>
                            <Text style={{ textAlign:"center"}}>{member?.Name}</Text>
                        </div>
                    }) 
                    : <Text>Chưa chọn người dùng nào</Text>}
            </div>
            <div className="col" style={{ height: "100%", gap: "1rem", overflowY:"scroll", paddingRight: "2rem"  }}>
                {methods.watch("searchMember") ? 
                    searchResult.map((member: any, index: any) => {
                        return <div key={`mb-${member.Id}-${index}`} className="row" style={{ width:"100%", justifyContent:"space-between" }}>
                            <div className="row" style={{ gap: "1rem"}}> 
                                <AvatarCard key={`mbsl-${member.Id}`} listImg={[member?.Img]}/>   
                                <Text>{member?.Name}</Text>
                            </div>
                            <CheckboxForm 
                                control={methods.control} 
                                name={member.Id} 
                                size={16} 
                                onChange={(checked) => {
                                    if(checked) {
                                        membersSelected.append(member);
                                    } else {
                                        membersSelected.remove(
                                            membersSelected.fields.findIndex((item) => item.Id === member.Id)
                                          );
                                    }
                                }}
                            />
                        </div>
                    }) : <div className="col" style={{ gap: "2rem", overflowY: "scroll" }}>
                        <Text>Gợi ý</Text>
                        {suggestMember.map((member: any, index: any) => {
                            return <div key={`mb-${member.Id}-${index}`} className="row" style={{ justifyContent:"space-between" }}>
                                <div className="row" style={{ gap: "1rem"}}> 
                                    <AvatarCard key={`mbsl-${member.Id}`} listImg={[member?.Img]}/>
                                    <Text>{member?.Name}</Text>
                                </div>
                                <CheckboxForm 
                                    control={methods.control} 
                                    name={member.Id} 
                                    size={16} 
                                    onChange={(checked) => {
                                        if(checked) {
                                            membersSelected.append(member);
                                        } else {
                                            membersSelected.remove(
                                                membersSelected.fields.findIndex((item) => item.Id === member.Id)
                                            );
                                        }
                                    }}
                                />
                            </div>
                        })}
                    </div>
                }
            </div>
        </div>
        <div className="row">
            <Button
                disabled={membersSelected.fields.length > 0 ? false : true}
                label="Thêm"
                style={{ width: "100%", borderRadius: "0.4rem", backgroundColor: membersSelected.fields.length > 0 ? "var(--primary-main-color)" : "var(--neutral-disable-background-color)"}}
                onClick={() => { addMember(methods.getValues("memberSelected")) }}
            />
        </div>
    </div>
})
  