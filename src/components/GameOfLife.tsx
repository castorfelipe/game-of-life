import { useRef, useEffect, MouseEvent, useState } from "react"
import styled from "styled-components"
import Button from "../components/Button"

let running: boolean = false

const backgroundColor = "#1d2433"
const foregroundColor = "#ffcc66"
let gridWidth = 50
let gridHeight = 50
let ratioX = 1
let ratioY = 1
let fps = 15

const Canvas = styled.canvas`
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
    opacity: 0.9;
`

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 999;
    position: absolute;
    min-width: 150px;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(15px);
    padding: 3rem;
    border-radius: 1rem 0 0 0;
`

const About = styled.a`
    color: #5ccfe6;
    margin-top: 1rem;
`

const GameOfLife = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    let renderInterval: any = null
    let context: any = null
    let canvas: HTMLCanvasElement | null = null
    let grid: any = []
    let clicked: boolean = true
    const clearCanvas = () => {
        context.fillStyle = backgroundColor
        paintPoint(0, 0, gridWidth, gridHeight)
    }

    const initialize = () => {
        canvas!.width = window.innerWidth
        canvas!.height = window.innerHeight
        gridHeight = window.innerHeight / 8 - ((window.innerHeight / 8) % 2)
        gridWidth = window.innerWidth / 8 - ((window.innerWidth / 8) % 2)
        ratioX = window.innerWidth / gridWidth
        ratioY = window.innerHeight / gridHeight
        context.shadowBlur = 10
        stop()
        createGrid()
        createCells()
        clearCanvas()
        start()
        running = true
    }

    useEffect(() => {
        if (running) return
        canvas = canvasRef.current
        if (!canvas) return
        context = canvas.getContext("2d")
        if (!context) return

        initialize()
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("resize", initialize)
        window.addEventListener("click", () => {
            console.log("clique")
        })
    }, [canvasRef])

    const paintPoint = (x: number, y: number, w: number, h: number) => {
        context.shadowColor = foregroundColor
        context.fillRect(x * ratioX, y * ratioY, w * ratioX, h * ratioY)
    }

    const getCellNeighbords = (t_x: number, t_y: number, grid_target: any): number => {
        let total = 0
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                if (x === 0 && y === 0) continue
                total += grid_target[t_x + x] ? grid_target[t_x + x][t_y + y] || 0 : 0
            }
        }
        return total
    }

    const paintGrid = () => {
        clearCanvas()
        context.fillStyle = foregroundColor
        for (let x = 0; x != gridWidth; x++) {
            for (let y = 0; y != gridHeight; y++) {
                if (grid[x][y] === 0) continue
                paintPoint(x, y, 1, 1)
            }
        }
    }

    const createGrid = () => {
        grid = []
        for (let x = 0; x != gridWidth; x++) {
            grid.push([])
        }
    }

    const createCells = () => {
        for (let x = 0; x != gridWidth; x++) {
            for (let y = 0; y != gridHeight; y++) {
                grid[x].push(Math.round(Math.random() * 0))
            }
        }
    }

    const gameLoop = () => {
        let newGrid: any = []
        newGrid = JSON.parse(JSON.stringify(grid))

        for (let x = 0; x != gridWidth; x++) {
            for (let y = 0; y != gridHeight; y++) {
                const cell = grid[x][y]
                const neighbords = getCellNeighbords(x, y, grid)
                if (cell === 1) {
                    if (neighbords < 2 || neighbords > 3) {
                        newGrid[x][y] = 0
                    }
                } else if (neighbords === 3) newGrid[x][y] = 1
            }
        }
        grid = newGrid
        paintGrid()
    }

    const start = () => {
        stop()
        paintGrid()
        renderInterval = setInterval(gameLoop, 1000 / fps)
    }

    const stop = () => {
        clearInterval(renderInterval)
    }

    const setCellAlive = (x: number, y: number) => {
        grid[x][y] = 1
        context.fillStyle = "#bae67e"
        context.shadowColor = "#bae67e"
        paintPoint(x, y, 1, 1)
    }

    const findIndexInGrid = (x: number, y: number): number[] => {
        const t_x = Math.floor(x * (gridWidth / canvas!.width))
        const t_y = Math.floor(y * (gridHeight / canvas!.height))
        return [t_x, t_y]
    }

    const handleMouseMove = (e: any) => {
        if (grid.length < 1 || !clicked) return
        const [x, y] = findIndexInGrid(e.clientX, e.clientY)
        setCellAlive(x, y)
    }

    return (
        <>
            <Canvas width={gridWidth} height={gridHeight} ref={canvasRef} />
            <Controls>
                <About target="_blank" href="https://pt.wikipedia.org/wiki/Jogo_da_vida">
                    O que é Game Of Life
                </About>
                <Button onClick={start}>Start</Button>
                <Button onClick={stop}>Stop</Button>
                <Button onClick={gameLoop}>Next frame</Button>
            </Controls>
        </>
    )
}

export default GameOfLife
