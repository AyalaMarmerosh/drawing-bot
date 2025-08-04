import { useState, useEffect  } from 'react';
import Canvas from '../Canvas/Canvas';
import Chat from '../Chat/Chat';
import Toolbar from '../Toolbar/Toolbar';
import { decodePrompt, saveDrawing, loadUserDrawings, updateDrawing  } from '../../services/apiService';


function MainApp({ user }) {
  const [commands, setCommands] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [messages, setMessages] = useState([]);
  const [drawingsList, setDrawingsList] = useState([]);
  const [selectedDrawingIndex, setSelectedDrawingIndex] = useState(null);


  useEffect(() => {
  const fetchDrawings = async () => {
    try {
      const drawings = await loadUserDrawings();
      setDrawingsList(drawings);
    } catch (error) {
      console.error('Error loading drawings:', error);
    }
  };
  fetchDrawings();
}, [user]);

// Automatically load a drawing when the selection changes
  useEffect(() => {
    if (selectedDrawingIndex === null) return;
    const drawing = drawingsList[selectedDrawingIndex];
    if (!drawing) return;

    try {
    const loadedCommands = JSON.parse(drawing.jsonData);
    const loadedMessages = JSON.parse(drawing.prompt || '[]'); // אם אין prompt תחזיר []      
      if (!Array.isArray(loadedCommands)) {
        console.warn("⚠ jsonData Not an array. Check the data structure.");
      }
    setCommands(loadedCommands);
    setMessages(loadedMessages);
    setUndoStack([]);
      setRedoStack([]);
    } catch (error) {
      console.error('Error loading drawing:', error);
      alert('Error loading drawing');
    }
  }, [selectedDrawingIndex, drawingsList]);


  const handlePromptSubmit = async (promptText) => {
    if (!promptText.trim()) return;
    try {
      const result = await decodePrompt(promptText);
       if (!result || result.length === 0) {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: promptText },
        { type: 'bot', text: '⚠️ No drawing commands were generated. Please try a different prompt.' }
      ]);
      return;
    }
      setUndoStack(prev => [...prev, commands]);
      setRedoStack([]);
      setCommands(prev => [...prev, ...result]);
      setMessages(prev => [
        ...prev,
        { type: 'user', text: promptText },
        { type: 'bot', text: '🎨 The drawing was added successfully' }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: promptText },
        { type: 'bot', text: '⚠️ Error decoding the instruction' }
      ]);
    }
  };

  const handleClear = () => {
    setCommands([]);
    setUndoStack([]);
    setRedoStack([]);
    setMessages([]);
  };

  const handleSave = async () => {
  try {
        if (selectedDrawingIndex !== null) {
      const drawingToUpdate = drawingsList[selectedDrawingIndex];
      await updateDrawing(drawingToUpdate.id, drawingToUpdate.name, commands, messages);
    } else {
      const name = prompt('Enter a name for the drawing:');
      if (!name) return;
      await saveDrawing( name, commands, messages );
    }
    alert('The drawing was saved successfully☺');
    const drawings = await loadUserDrawings();
    setDrawingsList(drawings);
  } catch (error) {
    console.error('Error saving:', error);
    alert('Error saving drawing');
  }
};
const handleNewDrawing = () => {
  setCommands([]);
  setUndoStack([]);
  setRedoStack([]);
  setMessages([]);
  setSelectedDrawingIndex(null);
};

const handleLoad = async () => {
  if (selectedDrawingIndex === null) {
    alert('Select a drawing from the list');
    return;
  }

  const drawing = drawingsList[selectedDrawingIndex];
  if (!drawing) return;

   try {
    const loadedCommands = JSON.parse(drawing.jsonData);
    const loadedMessages = JSON.parse(drawing.prompt || '[]'); // אם אין prompt, תחזיר מערך ריק

    setCommands(loadedCommands);
    setMessages(loadedMessages);
    setUndoStack([]);
    setRedoStack([]);
  } catch (error) {
    console.error('Error loading drawing:', error);
    alert('Error loading drawing');
  }
};

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, commands]);
    setCommands(last);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, commands]);
    setCommands(last);
  };

  return (
    <div className="app-container">
      <h2>hello {user.userName} 👋</h2>
      <Toolbar onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onClear={handleClear}
        onSave={handleSave}
        onLoad={handleLoad}
          drawingsList={drawingsList}
  selectedDrawingIndex={selectedDrawingIndex}
  onDrawingSelect={setSelectedDrawingIndex}
     onNew={handleNewDrawing}            
/>
      <div className="main-layout">
        <Chat messages={messages} onSubmit={handlePromptSubmit} />
        <Canvas commands={commands} />
      </div>
    </div>
  );
}

export default MainApp;
