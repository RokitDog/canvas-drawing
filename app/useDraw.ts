import { useEffect, useRef, useState } from "react"
import { Draw, Point } from "../typing";



export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}: Draw) => void) => {

    const [mouseDown, setMouseDown] = useState(false)
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prevPoint = useRef<null | Point>(null)

    const clear = () => {
        const canvas = canvasRef.current
        if(!canvas) return


        const ctx = canvas.getContext('2d')
        if(!ctx) return

        ctx.clearRect(0,0, canvas.width, canvas.height)
    }

    const onMouseDown = () => setMouseDown(true)
    
    useEffect(() => {
        const Ref = canvasRef;
        const prevPointRef = prevPoint;
        const handler = (e: MouseEvent)  => {
            if(!mouseDown) return

            const currentPoint = computePointInCanvas(e)

            const ctx = Ref.current?.getContext('2d')
            if(!ctx || !currentPoint) return

            onDraw({ctx, currentPoint, prevPoint: prevPoint.current})
            prevPoint.current = currentPoint
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = Ref.current
            if(!canvas) return

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top

            return {x, y}
        }

        const mouseUpHandler = () => {
            setMouseDown(false)
            prevPoint.current = null
        }

        // Add event listeners
        Ref.current?.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', mouseUpHandler)


        // Cleanup
        return () => {
            Ref.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [onDraw, mouseDown])

    return { canvasRef, onMouseDown, clear }
}