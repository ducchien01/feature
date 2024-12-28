import './layout.css'
import React, { useEffect } from "react";
import HeaderView from "./header/header";
import SideBarView from "./sidebar/sidebar";
import { DataController } from '../baseController';
import { CustomerActions } from '../reducer/customer/reducer';
import { useDispatch } from 'react-redux';

const Layout = (WrappedComponent: React.ComponentType<any>) => {
    // const handleDeleteChat = (e, _id, groupChat) => {
    //     e.preventDefault();
    //     console.log("Delete Chat", _id, groupChat)
    // }
   
    return (props: any) => {
        const dispatch = useDispatch();
        const customerController = new DataController("Customer");

        useEffect(() => {
            if (customerController.token()) {
                CustomerActions.getInfor(dispatch);
            }
        }, []);

        return (
            <div className="main-layout col">
                <HeaderView />
                <div className="row main-layout-body" style={{ width: "100%" }}>
                    <SideBarView />
                    <WrappedComponent {...props}/>
                </div>
            </div>
        )
    }
}

export default Layout;