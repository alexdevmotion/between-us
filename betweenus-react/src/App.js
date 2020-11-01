import './App.css';
import Main from './Main';

function App() {
  return (
    <>
      <div className="container my-5">
        <div className="columns is-centered">
          <img id="logo" src="logo.svg"/>
        </div>
      </div>
      <div className="container is-widescreen mb-5">
        <Main></Main>
      </div>
    </>
  );
}

export default App;
