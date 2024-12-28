import {Text} from "wini-web-components"
import { AvatarCard, ProfileCard } from "../../../../component/card";

const ChatSideBarRight = () => {
    return <div className="col right-sidebar right">
        <div className="avatar-info">
            <AvatarCard listImg={["https://picsum.photos/id/237/200/300"]}/>
            <Text>Ten nhom</Text>
            <Text>Hoat dong</Text>
        </div>
        <div className="action row">
            <button>Thong bao</button>
            <button>Tim kiem</button>
        </div>  
        <div className="file row">
            <p>File, tep, hinh anh, link</p>
        </div>
        <div className="participant row">
            <p>Thanh vien</p>
        </div>
        <div>xem them</div>
    </div>
}

export default ChatSideBarRight;