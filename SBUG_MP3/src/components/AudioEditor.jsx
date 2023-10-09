import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

import cutter from "/mp3-cutter/src/cutter.js";
import { Helmet } from "react-helmet";




const AudioEditor = ({ audioLink }) => {
  const waveSurferRef = useRef(null);
  const wsRegionsRef = useRef(null);

  const [buttonsReady, setButtonsReady] = useState(false);
  const [playPauseText, setplayPauseText] = useState("play");

  const [isLooping, setIsLooping] = useState(false);
  const isLoopingRef = useRef(isLooping); // Initialize the ref with the initial value

  const loopHandler = () => {
    setIsLooping((prevIsLooping) => !prevIsLooping);
    isLoopingRef.current = !isLoopingRef.current; // Update the ref when isLooping changes
  };

  const [currentRegionTimes, setCurrentRegionTimes] = useState({
    start: 0,
    end: 300,
  });

  const playPause = () => {
    if (waveSurferRef.current) {
      if (playPauseText == "play") setplayPauseText("pause");
      else setplayPauseText("play");

      waveSurferRef.current.playPause();
    }
  };

  const destroyWaveSurfer = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
      waveSurferRef.current = null;
      setButtonsReady(false);
    }
  };

  useEffect(() => {
    if (!buttonsReady) {
      setButtonsReady(false);
    }
  }, [buttonsReady]);

  useEffect(() => {
    const processAudio = async () => {
      destroyWaveSurfer();

      try {
        // Create an instance of WaveSurfer
        const ws = WaveSurfer.create({
          container: "#waveform",
          waveColor: "rgb(255, 255, 255)",
          progressColor: "rgb(255, 255, 255)",
          barGap: 5,
          url: audioLink.url,
        });

        // Initialize the Regions plugin
        const wsRegions = ws.registerPlugin(RegionsPlugin.create());


        wsRegions.enableDragSelection({
          color: "rgba(255, 255, 255, 0.5)",
        });

        wsRegions.on("region-updated", (region) => {
          setCurrentRegionTimes({
            start: region.start,
            end: region.end,
          });
        });

        let loop = true;
        

        wsRegions.on("region-created", (region) => {
          setCurrentRegionTimes({
            start: region.start,
            end: region.end,
          });
          const currentRegion = region.id;

          wsRegions
            .getRegions()
            .filter((region) => region.id !== currentRegion)
            .forEach((region) => region.remove());
        });

        let activeRegion = null;
        wsRegions.on("region-in", (region) => {
          activeRegion = region;
        });
        wsRegions.on("region-out", (region) => {
          if (activeRegion === region) {
            if (isLoopingRef.current == true) {
              region.play();
            } else {
              activeRegion = null;
            }
          }
        });
        wsRegions.on("region-clicked", (region, e) => {
          e.stopPropagation();
          activeRegion = region;
          region.play();
          setplayPauseText("pause");
          region.setOptions({ color: "(255, 255, 255, 0.5)" });
        });

        ws.on("interaction", () => {
          activeRegion = null;
          setplayPauseText("pause");
          ws.play();
          
        });

        ws.on("ready", () => {
          setButtonsReady(true);
          const duration = ws.getDuration();
          setCurrentRegionTimes({
            start: 0,
            end: duration,
          });
        });

        wsRegionsRef.current = wsRegions;
        waveSurferRef.current = ws;
      } catch (error) {
        console.error("Error processing audio:", error);
      }
    };

    if (audioLink) {
      processAudio();
    }

    return () => {
      setButtonsReady(false);
    };
  }, [audioLink]);

  function formatTime(time) {
    var calculatedTime = new Date(null);
    calculatedTime.setSeconds(time);

    return calculatedTime.toISOString().substr(11, 8);
  }

  async function downloadFile(id, type) {
    const audio = document.querySelector("audio");
    const file = await fetch(audioLink.url).then((response) => response.blob());
    let cutterLib = new mp3cutter();

    await cutterLib.cut(
      file,
      currentRegionTimes.start,
      currentRegionTimes.end,
      function (blob) {
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = blobUrl;
        downloadLink.download = "output.mp3";
        downloadLink.click();
      }
    );
  }

  return (
    <div>
      <Helmet>
        <script src="/mp3-cutter/src/cutter.js" type="text/javascript" />
      </Helmet>

      <div id="waveform"></div>

      <div>
        {buttonsReady && (
          <div>
            <div className="mb-5">
              <div className="my-3 grid grid-cols-3 grid-rows-1 gap-4">
                <button
                  className=" mt-1 text-left"
                  onClick={playPause}
                >
                  {playPauseText}
                </button>
                <button
                  className="underline col-start-3 text-right"
                  onClick={() => downloadFile("audioinput", "AUDIO")}
                >
                  DOWNLOAD
                </button>
              </div>

              <p className="text-white">
                start: {formatTime(currentRegionTimes.start)}
              </p>
              <p className="text-white">
                end: {formatTime(currentRegionTimes.end)}
              </p>
              <label className="mt-1 text-white">
                <input
                  className="mt-3 mr-1"
                  type="checkbox"
                  onChange={loopHandler}
                />
                loop?
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioEditor;
