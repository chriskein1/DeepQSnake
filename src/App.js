// import logo from './logo.svg';
import './App.css';
import './snake/style.css';
import SnakeGame from './snake/SnakeGame.mjs';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
import { React, useState } from 'react';

function App() {
  return (
    <div>
      <SnakeGame />
    </div>
  );
}

export default App;
