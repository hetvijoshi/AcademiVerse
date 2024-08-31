import React from 'react';
import Button from '../components/button';

function Home() {
    const handleClick = () => {
        alert('Button Clicked!');
      };
     
      return (
        <div className="App">
          <h1>Home Screen</h1>
          <Button label="Home Button" onClick={handleClick} />
        </div>
      );
  }
  
  export default Home;
  