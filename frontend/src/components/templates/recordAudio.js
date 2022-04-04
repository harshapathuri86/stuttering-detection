import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function AudioRecorder() {
  

  

  

  return (
    <div>
      <button onClick={handleRecording}>Record</button>
      <Button onClick={handleRecording}>Record</Button>
      <Button onClick={handleStop}>Stop</Button>
      <button
        onClick={handleStop}
        // disabled={!status.recording}
      >
        Stop
      </button>
      <button onClick={handleSave} disabled={!blob}>
        Save
      </button>
      <button
        onClick={handlePause}
        // disabled={!status.recording}
      >
        Pause
      </button>
      <button
        onClick={handleResume}
        // disabled={status.recording & status.paused}
      >
        Resume
      </button>
      
    </div>
  );
}
