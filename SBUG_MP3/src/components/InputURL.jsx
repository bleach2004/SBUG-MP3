import React, { useState, useEffect } from "react";
import AudioEditor from "./AudioEditor";

const InputURL = ({ setAudioLink }) => {
  const [input, setInput] = useState("");

  const apiURL = "https://co.wuk.sh";
  // const apiURL = "http://localhost:9000"; // Update with your API URL

  function handleFetchDebug() {
    setAudioLink("1");
  }

  const handleFetch = async () => {
    try {
      const req = {
        url: encodeURIComponent(input.split("&")[0].split("%")[0]),
        aFormat: "wav",
      };

      const response = await fetch(`${apiURL}/api/json`, {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const fetchedAudioLink = await response.json();
      setAudioLink(fetchedAudioLink);

      return fetchedAudioLink; // Return the data
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  return (
    <div className="flex grid justify-center mx-auto">
      <input
        className="relative py-2 px-2 w-96 rounded-sm"
        type="text"
        placeholder="paste song link here"
        onChange={(e) => setInput(e.target.value)}
        size="lg"
      />
      <button
        className="button ml-3 mt-2 px-2 text-white"
        // onClick={handleFetch}
        onClick={handleFetch}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default InputURL;
