import './Toolbar.css';

const Toolbar = ({ onUndo, onRedo, canUndo, canRedo, onClear, onSave, onLoad, drawingsList, selectedDrawingIndex,  onDrawingSelect,  onNew}) => {
  return (
    <div className="toolbar">
      <h2 className="title">🎨 DrawingBot</h2>
      <div className="buttons">
        <button className="btn save" onClick={onSave}>
          💾 Save
        </button>
       <select
  value={selectedDrawingIndex ?? ""}
  onChange={(e) => onDrawingSelect(parseInt(e.target.value))}
>
  <option value="" disabled>Choose drawing </option>
  {drawingsList.map((d, i) => (
    <option key={i} value={i}>
      {d.name}
    </option>
  ))}
</select>

<button className="btn new" onClick={onNew}>
  ✨New Drawing 
</button>

        <button className="btn undo" onClick={onUndo} disabled={!canUndo}>
          ↩ Undo
        </button>
        <button className="btn redo" onClick={onRedo} disabled={!canRedo}>
          ↪ Redo
        </button>
        <button className="btn clear" onClick={onClear}>
          🗑 Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
