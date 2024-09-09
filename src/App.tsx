import { Fragment } from "react";
import { createGlobalStyle } from "styled-components";
import Canvas from "./components/GameOfLife";

const GlobalStyles = createGlobalStyle`
    html, body, #root {
        margin: 0;
        padding: 0;
        height: 100vh;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: Inter;
    }

    body {
        min-height: 100vh;
        background: linear-gradient(#181825, #313244);
        color: #d7dce2;
    }

    canvas {
        background-color: #1d2433;
        image-rendering: pixelated;
    }
`;


function App() {
    return (
        <Fragment>
            <GlobalStyles />
            <Canvas />
        </Fragment>
    );
}

export default App;
