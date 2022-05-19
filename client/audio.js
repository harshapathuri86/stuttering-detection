// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Login from "./components/pages/Login";
// import Register from "./components/pages/Register";
// import { Home as AdminHome } from "./components/pages/Admin/Home";
// import { Home as DoctorHome } from "./components/pages/Doctor/Home";
// import { Home as PatientHome } from "./components/pages/Patient/Home";
// import ForgotPassword from "./components/pages/ForgotPassword";
// import ResetPassword from "./components/pages/ResetPassword";
// import Profile from "./components/pages/Profile";
// import NewTest from "./components/pages/Doctor/NewTest";
// import Navbar from "./components/templates/Navbar";

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/admin" element={<AdminHome />} />
//           <Route path="/doctor" element={<DoctorHome />} />
//           <Route path="/patient" element={<PatientHome />} />
//           <Route path="/forgotpassword" element={<ForgotPassword />} />
//           <Route path="/resetpassword/" element={<ResetPassword />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/newtest" element={<NewTest />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;

import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

function App() {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // const mediaStream = await navigator.mediaDevices.getDisplayMedia({
    //   video: {
    //     width: 1920,
    //     height: 1080,
    //     frameRate: 30,
    //   },
    //   audio: false,
    // });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, { type: "audio" });
    recorderRef.current.startRecording();
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
    });
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleSave}>save</button>
        {blob && (
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: "700px", margin: "1em" }}
          />
        )}
      </header>
    </div>
  );
}

export default App;

