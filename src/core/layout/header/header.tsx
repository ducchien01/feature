import './header.css'
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ComponentStatus, Dialog, DialogAlignment, Popup, Text, TextField, closePopup, showDialog, showPopup, Winicon } from 'wini-web-components';
import { CustomerController } from '../../../da/customer/controller';
import { CustomerItem } from '../../../da/customer/da';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { showLoginPopup } from '../../../router/router';
import ConfigAPI from '../../../da/configApi'

export default function HeaderView() {
  const userInfo = useSelector((state: RootState) => state.customer.data)
  const [search, setSearch] = useState(false)
  const isLogin = CustomerController.token()
  const dialogRef = useRef<any>();
  const popupRef = useRef<any>();  
  const searchRef = useRef<any>();
  const [showSideBar, setShowSidebar] = useState(false)
  const navigate = useNavigate();

  const dialogLogout = () => {
    showDialog({
        ref: dialogRef,
        alignment: DialogAlignment.center,
        status: ComponentStatus.WARNING,
        title: 'Bạn chắc chắn muốn đăng xuất',
        onSubmit: CustomerController.logout,
    })
  }

  const showUserActions = (ev: any) => {  
    const _box = ev.target.getBoundingClientRect()
    if (userInfo) {
      showPopup({
        ref: popupRef,
        clickOverlayClosePopup: true,
        hideButtonClose: true,
        style: { top: `${_box.y + _box.height + 2}px`, right: `${document.body.offsetWidth - _box.right}px`, position: 'absolute', width: 'fit-contents' },
        content: <PopupUserActions
          ref={popupRef}
          userInfo={userInfo}
          logout={() => {
            closePopup(popupRef)
            dialogLogout()
          }}
        />
      })
    }
  }

    // Xử lý click ngoài để ẩn thanh tìm kiếm
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
          !searchRef.current.contains(event.target as Node)
      ) {
        setSearch(false);
      }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


  return <div className={`header row ${showSideBar ? 'expand' : ''}`}>
    <Dialog ref={dialogRef} />
    <Popup ref={popupRef} />
    {/* <button type='button' onClick={() => { setShowSidebar(!showSideBar) }} className='row icon-button32'>
      <div onClick={() => { setShowSidebar(false) }} className='navigation-sidebar-overlay' style={{ display: showSideBar ? 'block' : 'none' }}></div>
      <Winicon src='outline/user interface/send-message' size={'2rem'}/>
    </button> */}
    <div className="logo"></div>
    {/* <div className='row search-all'>
      {isLogin ? <TextField
              className='search-default placeholder-2'
              placeholder='Tìm kiếm trên eBig'
              prefix={<Winicon src='fill/development/zoom' size={'1.6rem'}/>}
              style={{ height: '4.8rem', width: '55.2rem' }}
          /> : <></> 
      }
    </div> */}
     {/* <TextField
                prefix={<Winicon src='fill/development/zoom' size={'1.6rem'}/>}
                style={{ height: '4rem', padding: '0.8rem 1.6rem', margin: '0.4rem 0' }}
                className="search-default body-3"
                placeholder="Tìm kiếm bài viết"
            /> */}
    <div className="action row">
      <div ref={searchRef} onMouseEnter={() => setSearch(true)}>
        {!search && ( 
            <button type='button' className='row icon-button32'><Winicon src='fill/development/zoom' size={'2rem'}/></button>
          )}
          {search && ( 
            <TextField
              style={{ height: '4.8rem', width: '55.2rem' }}
              className='search-all body-3'
              placeholder='Tìm kiếm trên eBig'
              prefix={<Winicon src='fill/development/zoom' size={'2rem'}/>}
              suffix={<button type='button' className='row icon-button32 remove-search'><Winicon src='outline/user interface/c-remove' size={'2rem'} /></button>}
            />)}                
      </div >
      {isLogin ?
            <>
                <button type='button' className='row icon-button32'><Winicon src='outline/user interface/bell' size={'2rem'}/></button>
                <button type='button' onClick={showUserActions} style={{marginLeft: '1.2rem'}}>
                    <img src={ConfigAPI.imgUrlId + userInfo?.Img} alt='' style={{ width: '4rem', height: '4rem', borderRadius: '50%' }} />
                </button>
            </>  : <div  className='row' style={{ gap:'2.4rem' }}>
                    <button type='button' onClick={showLoginPopup} style={{borderRadius: '2.4rem'}}><Text className='button-text-3'>Đăng nhập</Text></button>
                    <button type='button' onClick={() =>{}} className=' button-primary' style={{borderRadius: '2.4rem'}}><Text className='button-text-3'>Đăng ký</Text></button>
                </div>
            }
        </div>
  </div>;
}

const PopupUserActions = forwardRef(function PopupUserActions(data: { userInfo: CustomerItem, logout: () => void }, ref) {
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
      <div className='col divider' />
      <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
          <Winicon src='outline/education/books' size={'1.6rem'}/>
          <Text className='label-4'>Quản lý giảng dạy</Text>
      </button>
      <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
          <Winicon src='outline/user interface/shop' size={'1.6rem'}/>
          <Text className='label-4'>Quản lý bán hàng</Text>
      </button>
      <div className='col divider' />
      <button className='row' style={{ gap: '1.2rem', padding: '1rem 1.6rem' }}>
          <Winicon src='outline/user interface/settings-gear' size={'1.6rem'}/>
          <Text className='label-4'>Cài đặt</Text>
      </button>
      <div className='col divider' />
      <button type='button' onClick={data.logout} className='col' style={{ gap: '0.4rem', padding: '1rem 1.6rem' }}>
          <Text className='label-4' style={{ color: 'var(--error-main-color)' }}>Đăng xuất</Text>
          <Text className='subtitle-4' >{data.userInfo?.Email ?? ''}</Text>
      </button>
  </div>
})

