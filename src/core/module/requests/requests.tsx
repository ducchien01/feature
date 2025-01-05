import { AvatarCard } from "../../../component/card";
import Layout from "../../layout/layout";

const Requests = () => {

    return <div style={{backgroundColor:"gray", width:"100%", height:"100%", padding:"3rem"}}><AvatarCard listImg={["32a3a7c77e9f49f2b13e1787b20183b5", "b9dbeed204214853ab0607fd76831ec2", "af5cac4a6d1649b093b8cea8ea813d77"]} isGroup={true} /></div>
}


export default Layout(Requests);