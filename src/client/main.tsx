import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <main style={{ color: '#E6EAF2', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Challenge 001</h1>
      <p>Client hydration placeholder.</p>
    </main>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
