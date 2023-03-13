import './App.css';
import Content from './components/Content';
import KonvaEditor from './KonvaEditor';
import KonvaEditorProvider from './KonvaEditorProvider';

function App() {
  return (
    <div className="App">
      {/* <KonvaEditorProvider>
        <KonvaEditor />
      </KonvaEditorProvider> */}
      <Content/>
    </div>
  );
}

export default App;
