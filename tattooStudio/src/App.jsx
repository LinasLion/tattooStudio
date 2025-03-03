//import { useState } from 'react'
//import './App.css'
import React from 'react';
import './assets/mainCss/main.css'
import {Header} from './assets/components/Header.jsx'
import {Content} from './assets/components/Content.jsx'

function App() {


  return (
    <>
      <div className="wrapper">
          <Header />
          <Content />
      </div>
    </>
  )
}

export default App
