import './sidebar.css'
import { useEffect, useState } from "react";
import { Winicon } from "wini-web-components";
import { RootState } from "../../../store";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ViewPath } from '../../../common/enum';

export default function SideBarView() {
  const user = useSelector((state: RootState) => state.customer.data)
  const location = useLocation()
  const _modules = [
    {
      id: "Chat",
      path: ViewPath.Chat,
      icon: <Winicon src='outline/user interface/send' size={'2rem'}/>,
      selectedIcon: <Winicon src='fill/user interface/send' size={'2rem'}/>,
    },
    {
      id: "Requests",
      path: ViewPath.Requests,
      icon: <Winicon src='outline/user interface/send' size={'2rem'}/>,
      selectedIcon: <Winicon src='fill/accessibility/hide' size={'2rem'}/>,
    },
    {
      id: "Archived",
      path: ViewPath.Archived,
      icon: <Winicon src='outline/files/archive-drawer' size={'2rem'}/>,
      selectedIcon: <Winicon src='fill/files/archive-drawer' size={'2rem'}/>,
    },
  ]
  const [selectedModule, setModule] = useState(_modules[0])

  useEffect(() => {
    setModule(_modules.find((e, i) => i ? location.pathname.startsWith(e.path) : e.path === location.pathname) ?? _modules[0])
  }, [location.pathname])

  return <div className={`sidebar col`} >
      {_modules.filter(e => user != undefined || e.id !== 'Center').map((item, index) => {
          const isSelected = selectedModule.id === item.id
          return <NavLink key={`sidebar-item-${index}`} to={item.path} className={`sidebar-item ${isSelected ? 'selected' : ''}`}>
              {isSelected ? item.selectedIcon : item.icon}
          </NavLink>
      })}
  </div>
 
}
