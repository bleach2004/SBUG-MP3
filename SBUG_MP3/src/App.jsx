import React, { useState } from "react";

import InputURL from "./components/InputURL.jsx";
import AudioEditor from "./components/AudioEditor.jsx";


const App = () => {
  const [audioLink, setAudioLink] = useState(null);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="grid my-auto gap-5 w-3/4">
        <div>
          <img className="w-52 mb-4 mx-auto" src="src/assets/miku.jpg" />
        </div>
        <div>
          <h1 className="text-white text-4xl text-center">sbug mp3</h1>
        </div>
        <div>
          <InputURL setAudioLink={setAudioLink} />
        </div>
        <div>{audioLink && <AudioEditor audioLink={audioLink} />}</div>
      </div>
    </div>
  );
};

export default App;


