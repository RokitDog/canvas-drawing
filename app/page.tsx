'use client'
import { Draw, Point } from '../typing';
import { useDraw } from './useDraw'
import { ChromePicker } from 'react-color'
import { useState } from 'react';
import { useEffect } from 'react'
import {io, Socket} from 'socket.io-client'
import { drawLine } from './drawLine';
let socketv1: Socket =  io('/api/socket')

const Page = ({}) => {
  const [color, setColor] = useState('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [socketReady, setSockedReady] = useState<Socket>(socketv1)


useEffect(() => {socketInitializer()}, [])

  const socketInitializer = async () => {
    await fetch('/api/socket')
    let socket =  io()

    setSockedReady(socket)
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');

    if(!socketReady) return

    socketReady.emit('client-ready');

    socketReady.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return
      console.log('sending canvas state')
      socketReady.emit('canvas-state', canvasRef.current.toDataURL())
    })

    socketReady.on('canvas-state-from-server', (state: string) => {
      console.log('I received the state')
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })

    socketReady.on('draw-line', ({ prevPoint, currentPoint, color }) => {
      if (!ctx) return console.log('no ctx here')
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socketReady.on('clear', clear)

    return () => {
      socketReady.off('get-canvas-state')
      socketReady.off('canvas-state-from-server')
      socketReady.off('draw-line')
      socketReady.off('clear')
    }

    
  }, [canvasRef, socketReady, clear])


  function createLine ({prevPoint, currentPoint, ctx}: Draw) {
    socketReady.emit('draw-line', ({prevPoint, currentPoint, color}))
    drawLine({prevPoint, currentPoint, ctx, color})
  }


return <div className='w-screen h-screen bg-white flex justify-center items-center '>
  <div className='flex flex-col gap-10 pr-10'>
  <ChromePicker color={color || '#000'} onChange={(e) => setColor(e.hex)} />
  <button type='button' onClick={() => socketReady.emit('clear')} className='p-2 rounded-md border border-black'>Clear Canvas</button>
  </div>
  <canvas 
    width={750}
    height={750}
    className='border border-black rounded-md bg-white'
    ref={canvasRef}
    onMouseDown={onMouseDown}
/>
</div>
}

export default Page