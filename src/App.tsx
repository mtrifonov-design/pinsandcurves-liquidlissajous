import { useEffect, useReducer, useRef, useState } from 'react'
import Controls from './components/Controls';
import Viewer from './components/Viewer';
import '@mtrifonov-design/pinsandcurves-design/dist/PinsAndCurvesStylesheet.css';

function App() {
  return (
    <>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '700px 1fr',
        gridTemplateRows: '1fr',

        backgroundColor: 'var(--gray1)',
        overflow: 'hidden',
      }}>
        <div><Controls /></div>
        <div><Viewer /></div>
      </div>
    </>
  )
}

export default App
