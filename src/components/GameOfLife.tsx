import { useRef, useEffect, MouseEvent, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import _ from "lodash";

const backgroundColor = "#181825";
const foregroundColor = "#f8861b";
const beingBornColor = "#f85a1b";

let gridWidth = 50;
let gridHeight = 50;
let ratioX = 1;
let ratioY = 1;
let fps = 20;

const Canvas = styled.canvas`
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
    opacity: 0.9;

    image-rendering: optimizeSpeed;
`;

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
    padding: 1rem;
    border-radius: 1rem 0 0 0;
`;

const About = styled.a`
    color: #5ccfe6;
    margin-top: 1rem;
`;

const neighborOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

let isFirstTimeRunning = true;
let grid: number[][] = [];

const GameOfLife = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let renderInterval: any = null;
    let context: CanvasRenderingContext2D | null = null;
    let canvas: HTMLCanvasElement | null = null;
    
    let clicked: boolean = true;
    let maxRadius = 0;
    let centerY = 0;
    let centerX = 0;

    const clearCanvas = () => {
        context!.fillStyle = backgroundColor;
        paintPoint(0, 0, gridWidth, gridHeight);
    };

    const initialize = () => {
        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;
        gridHeight = window.innerHeight / 8 - ((window.innerHeight / 8) % 2);
        gridWidth = window.innerWidth / 8 - ((window.innerWidth / 8) % 2);
        ratioX = window.innerWidth / gridWidth;
        ratioY = window.innerHeight / gridHeight;
        context!.shadowBlur = 15;
        centerX = Math.floor(gridWidth / 2);
        centerY = Math.floor(gridHeight / 2);
        maxRadius = Math.sqrt(centerX ** 2 + centerY ** 2);
        stop();
        if (isFirstTimeRunning) {
            createGrid();
            createCells();
            clearCanvas();
            isFirstTimeRunning = false; //a
        }
        start();
    };

    useEffect(() => {
        stop(); //
        canvas = canvasRef.current;
        if (!canvas) return;
        context = canvas.getContext("2d")!;
        if (!context) return;

        initialize();
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("resize", initialize);
        window.addEventListener("click", () => {
            // animateFromCenter();
        });

        return () => {
            clearInterval(renderInterval);
        };
    }, [canvasRef]);

    const paintPoint = (
        x: number,
        y: number,
        w: number,
        h: number,
        customColor?: string
    ) => {
        context!.shadowColor = customColor || foregroundColor;

        context!.fillRect(x * ratioX, y * ratioY, w * ratioX, h * ratioY);
    };

    const getCellNeighbors = (t_x: number, t_y: number): number => {
        let total = 0;

        for (const [dx, dy] of neighborOffsets) {
            let x = t_x + dx;
            let y = t_y + dy;

            if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                total += grid[x][y];
            }
        }

        return total;
    };

    const paintGrid = () => {
        clearCanvas();
        context!.fillStyle = foregroundColor;
        for (let x = 0; x != gridWidth; x++) {
            for (let y = 0; y != gridHeight; y++) {
                if (grid[x][y] === 0) continue;
                paintPoint(x, y, 1, 1);
            }
        }
    };

    const createGrid = () => {
        grid = [];
        for (let x = 0; x != gridWidth; x++) {
            grid.push([]);
        }
    };

    const createCells = () => {
        for (let x = 0; x != gridWidth; x++) {
            for (let y = 0; y != gridHeight; y++) {
                grid[x].push(Math.round(Math.random() * 0));
            }
        }
    };

    const gameLoop = () => {
        const newGrid = Array.from({ length: gridWidth }, () =>
            Array(gridHeight).fill(0)
        );

        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                const cell = grid[x][y];
                const neighbors = getCellNeighbors(x, y);

                if (cell === 1) {
                    newGrid[x][y] = neighbors >= 2 && neighbors <= 3 ? 1 : 0;
                } else {
                    newGrid[x][y] = neighbors === 3 ? 1 : 0;
                }
            }
        }

        grid = newGrid;
        paintGrid();
    };

    const start = () => {
        stop();
        paintGrid();
        renderInterval = setInterval(gameLoop, 1000 / fps);
    };

    const stop = () => {
        clearInterval(renderInterval);
    };

    let prevX: number | null = null;
    let prevY: number | null = null;

    const setCellAlive = (x: number, y: number) => {
        grid[x][y] = 1;
        context!.fillStyle = beingBornColor;
        context!.shadowColor = beingBornColor;
        paintPoint(x, y, 1.5, 1.5, beingBornColor);
    };

    const findIndexInGrid = (x: number, y: number): number[] => {
        const t_x = Math.floor(x * (gridWidth / canvas!.width));
        const t_y = Math.floor(y * (gridHeight / canvas!.height));
        return [t_x, t_y];
    };

    // Bresenham's line algorithm
    const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            setCellAlive(x0, y0);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    };

    const handleMouseMove = (e: any) => {
        if (grid.length < 1 || !clicked) return;
        const [x, y] = findIndexInGrid(e.clientX, e.clientY);

        if (prevX !== null && prevY !== null) {
            drawLine(prevX, prevY, x, y); // Draw line between previous and current points
        }

        // Update previous coordinates
        prevX = x;
        prevY = y;
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (grid.length < 1 || !clicked) return;

        // Get the touch coordinates
        const touch = e.touches[0]; // Access the first touch point
        const [x, y] = findIndexInGrid(touch.clientX, touch.clientY);

        if (prevX !== null && prevY !== null) {
            drawLine(prevX, prevY, x, y); // Draw line between previous and current points
        }

        // Update previous coordinates
        prevX = x;
        prevY = y;
    };

    const setAllCellsAliveInRadius = (radius: number) => {
        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                const distance = Math.sqrt(
                    (x - centerX) ** 2 + (y - centerY) ** 2
                );
                if (distance <= radius) {
                    setCellAlive(x, y);
                }
            }
        }
    };

    const animateFromCenter = () => {
        let currentRadius = 0;

        const step = () => {
            setAllCellsAliveInRadius(currentRadius);
            currentRadius += 1; // Increase the radius in each frame

            if (currentRadius <= maxRadius) {
                requestAnimationFrame(step); // Continue the animation
            }
        };

        step(); // Start the animation
    };

    return (
        <>
            <Canvas width={gridWidth} height={gridHeight} ref={canvasRef} />
            <Controls>
                <About
                    target="_blank"
                    href="https://pt.wikipedia.org/wiki/Jogo_da_vida"
                >
                    O que é Game Of Life
                </About>
                <About
                    target="_blank"
                    href="https://github.com/castorfelipe/game-of-life"
                >
                    Código no Github
                </About>
            </Controls>
        </>
    );
};

export default GameOfLife;
