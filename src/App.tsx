import { Fragment } from "react"
import Home from "./pages/Home"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
    html, body, #root {
        margin: 0;
        padding: 0;
        height: 100vh;
    }

    * {
        box-sizing: border-box;
    }

    body {
        min-height: 100vh;
        background: linear-gradient(#171c28, #2f3b54);
        color: #d7dce2;
    }

    canvas {
        background-color: #1d2433;
        image-rendering: pixelated;
    }
`

function App() {
    return (
        <Fragment>
            <GlobalStyles />
            <Home />
        </Fragment>
    )
}

export default App
