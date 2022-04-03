import { io } from 'socket.io-client'

const socket = io('http://localhost:8889')

socket.on('connect', () => {
  console.log('socket 已连接')
})

socket.on('refresh', () => {
  socket.emit("getMocks")
})

socket.on('disconnect', () => {
  console.log('socket 已断开')
})

export default socket