export type Draw = {
    ctx: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: Point | null
    socket?: any
}

export type Point = { x: number; y: number}