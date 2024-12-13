import { ToastMessage, WLoginView, Winicon } from "wini-web-components";
import styles from './view.module.css';
import LogoWini from '../../../assets/LogoWini.svg';
import { CustomerActions } from "../../reducer/customer/reducer";
import { Ultis } from '../../../common/Utils';

export default function LoginView() {
    const onSubmit = async (ev, methods) => {
        const res = await CustomerActions.login(ev);
        if(res.code === 403) methods.setError("Password", { message: res.message })
        else if (res.code !== 200) ToastMessage.errors(res.message)
        else {
            ToastMessage.success("Login successfully!")
            Object.keys(res.data).forEach(key => {
                Ultis.setCookie(key, res.data[key])
            })
            Ultis.setCookie("timeRefresh", Date.now() / 1000 + 9 * 60)
            window.location.replace("/")
        }
    }
    return <div className={`col main-layout ${styles['login-view']}`}>
    <div className='col'>
        <WLoginView
            style={{ width: "40vw" }}
            logo={LogoWini}
            formData={{
                username: {
                    label: "Email or Username",
                    name: "UserName",
                    maxLength: 18,
                    prefix: <Winicon src={"outline/user interface/mail"} size={"1.4rem"} />,
                },
                password: {
                    label: "Password",
                    name: "PassWord",
                    prefix: <Winicon src={"outline/user interface/lock"} size={"1.4rem"} />,
                },
            }}
            onSubmit={onSubmit}
        />
    </div>
</div>
}