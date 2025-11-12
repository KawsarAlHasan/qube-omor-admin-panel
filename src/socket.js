import { io } from "socket.io-client";
const BASE_URL = "http://10.10.7.108:8099"

const socket = io(BASE_URL, {
  autoConnect: false,
});

export default socket;
 