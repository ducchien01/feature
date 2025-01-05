import ConfigApi from './common/config';

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (userId) => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Kết nối tới server
    const newSocket = io(ConfigApi.socketUrl);
    setSocket(newSocket);

    // Gửi userId khi kết nối
    newSocket.emit("user_connected", userId);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useSocket;
