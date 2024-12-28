import { io } from 'socket.io-client';
import ConfigApi from './common/config';

export const socket = io(ConfigApi.socketUrl);