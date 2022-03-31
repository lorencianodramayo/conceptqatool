import React, { FC } from 'react';
import { Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import Playground from './components/Playground';

import './App.less';

const App: FC = () => {
  return(
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground/:id" element={<Playground />} />
      </Routes>
    </div>
  )
}

export default App;