import './App.css';
import KonvaEditor from './KonvaEditor';
import KonvaEditorProvider from './KonvaEditorProvider';

function App() {
  return (
    <div className="App">
      <KonvaEditorProvider>
        <KonvaEditor />
      </KonvaEditorProvider>
    </div>
  );
}

export default App;
