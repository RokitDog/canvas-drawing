import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      socket.on('client-ready', () => {
        socket.broadcast.emit('get-canvas-state')
      })
    
      socket.on('canvas-state', (state) => {
        console.log('received canvas state')
        socket.broadcast.emit('canvas-state-from-server', state)
      })
    
      socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
        socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })
      })
    
      socket.on('clear', () => io.emit('clear'))
    })
  }
  res.end()
}

export default SocketHandler