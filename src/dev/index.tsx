import ReactDOM from 'react-dom';
import React from 'react';
import DevTemplate from './DevTemplate';
import { BrowserRouter } from 'react-router-dom';
import { ProAntProvider } from '../pro-template';

const element = document.getElementById('root');

ReactDOM.render(
    <ProAntProvider>
        <BrowserRouter>
            <DevTemplate />
        </BrowserRouter>
    </ProAntProvider>,
    element,
);
