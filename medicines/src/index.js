
import App from "./components/App";
import React from "react";

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const container = document.getElementById('app');
const username = document.getElementById('username') ? document.getElementById('username').innerText : "";


//https://babeljs.io/
//https://webpack.js.org/
//https://ithelp.ithome.com.tw/articles/10214942
//https://react-bootstrap.github.io/components/pagination/
//https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started

function Main(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/profile/:name1" element={<App name={props.name} />} />
                <Route index element={<App name={props.name} />} />

            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(container);
root.render(<Main name={username} />);
