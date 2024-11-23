import React, { useState, useCallback } from 'react';
import './App.css';
import ReactFlow, { addEdge, Controls, MiniMap, removeElements } from 'reactflow';
import 'reactflow/dist/style.css';
import Flowchart from './Flowchart';

function App() {
  return (
    <div className="App">
      <h1>Email Marketing Flow</h1>
      <Flowchart />
    </div>
  );
}

export default App;
