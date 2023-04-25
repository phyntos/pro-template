import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ProAntProvider } from '../pro-template';
import DevTemplate from './DevTemplate';

const element = document.getElementById('root');

ReactDOM.render(
    <ProAntProvider>
        <BrowserRouter>
            <DevTemplate />
        </BrowserRouter>
    </ProAntProvider>,
    element,
);
