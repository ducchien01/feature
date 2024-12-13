import './sidebar.css'
import React, { useEffect, useState } from "react";
import { ViewPath } from "../../../router/router";
import { Winicon } from "wini-web-components";
import { RootState } from "../../../store";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideBarView() {
  const userInfor = useSelector((state: RootState) => state.customer.data)
  const location = useLocation()
  const _modules = [
    {
        id: 'Social',
        path: ViewPath.Default,
        icon: <Winicon src='outline/user interface/home' size={'2rem'}/>,
        selectedIcon: <Winicon src='fill/user interface/home' size={'2rem'}/>,
    },
    {
        id: 'Center',
        path: ViewPath.Community,
        icon: <Winicon src='outline/users/user-group' size={'2rem'}/>,
        selectedIcon: <Winicon src='fill/users/user-group' size={'2rem'}/>,
    },
    {
        id: "Edu",
        path: ViewPath.Edu,
        icon:  <Winicon src='outline/education/books' size={'2rem'}/>,
        selectedIcon:  <Winicon src='fill/education/books' size={'2rem'}/>,
    },
    {
        id: "Ecom",
        path: ViewPath.Ecom,
        icon: <Winicon src='outline/user interface/shop' size={'2rem'}/>,
        selectedIcon:  <Winicon src='fill/user interface/shop' size={'2rem'}/>,
    },
    {
        id: "Discovery",
        path: ViewPath.Discovery,
        icon: <Winicon src='outline/user interface/spaceship' size={'2rem'}/>,
        selectedIcon: <Winicon src='fill/user interface/spaceship' size={'2rem'}/>,
    },
    {
        id: "Chat",
        path: ViewPath.Chat,
        icon: <Winicon src='outline/user interface/send' size={'2rem'}/>,
        selectedIcon: <Winicon src='fill/user interface/send' size={'2rem'}/>,
    },
  ]
  const [selectedModule, setModule] = useState(_modules[0])

  useEffect(() => {
    setModule(_modules.find((e, i) => i ? location.pathname.startsWith(e.path) : e.path === location.pathname) ?? _modules[0])
  }, [location.pathname])

  return <div className={`col main-layout-sidebar`} >
      {_modules.filter(e => userInfor != undefined || e.id !== 'Center').map((item, index) => {
          const isSelected = selectedModule.id === item.id
          return <NavLink key={`sidebar-item-${index}`} to={item.path} className={`sidebar-item ${isSelected ? 'selected' : ''}`}>
              {isSelected ? item.selectedIcon : item.icon}
          </NavLink>
      })}
  </div>
}
