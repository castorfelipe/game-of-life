import styled from "styled-components";

const Button = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(47, 59, 84);
    text-decoration: none;
    padding: 0.8rem 1.5rem;
    color: #d7dce2;
    transition: 0.2s ease-in-out 0s;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    font-family: 'Montserrat', sans-serif;
    text-align: center;
    :hover {
        background-color: #ffcc66;
        color: #171c28;
        transform: translateY(-5px);
    }
    
`

export default Button
