import { io } from "socket.io-client";

const socket = io("https://qube.dsrt321.online", {
  autoConnect: false,
});

// const socket = io("http://localhost:8099", {
//   autoConnect: false,
// });

export default socket;
