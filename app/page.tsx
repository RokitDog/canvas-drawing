'use client'
import { Draw } from '../typing';
import { useDraw } from './useDraw'
import { ChromePicker } from 'react-color'
import { useState } from 'react';

interface pageProps {}

const Page = ({}) => {
  const [color, setColor] = useState('#000')

const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

function drawLine({prevPoint, currentPoint, ctx}: Draw) {
  const {x: currX, y: currY} = currentPoint;
  const lineColor = color || '#000'
  const lineWidth = 5

  let startPoint = prevPoint ?? currentPoint
  ctx.beginPath();
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(currX, currY)
  ctx.stroke()

  ctx.fillStyle = lineColor
  ctx.beginPath()
  ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
  ctx.fill()
}

return <div className='w-screen h-screen bg-white flex justify-center items-center '>
  <div className='flex flex-col gap-10 pr-10'>
  <ChromePicker color={color || '#000'} onChange={(e) => setColor(e.hex)} />
  <button type='button' onClick={clear} className='p-2 rounded-md border border-black'>Clear Canvas</button>
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