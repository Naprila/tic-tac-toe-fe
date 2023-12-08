import React from "react";

// importing the VideoJS Functional component
import VideoJS from "./components/VideoJS";
import videojs from "video.js";

const App = () => {
  const playerReference = React.useRef(null);

  // setting the video-js option for the player
  const videoJsOptions = {
    autoplay: true,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    controls: true,
    responsive: true,
    fluid: true,
    userActions: {
      hotkeys: true,
    },
    width: 720,
    height: 300,
    sources: [
      {
        // src: "https://www.tutorialspoint.com/videos/sample480.mp4",
        // type: "video/mp4",
        src: "https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd",
        type: "application/dash+xml",
        keySystems: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
          robustness: "SW_SECURE_CRYPTO",
        },
        audioRobustness: "SW_SECURE_CRYPTO",
        videoRobustness: "SW_SECURE_CRYPTO",
      },
    ],
  };

  const playerReady = (player) => {
    playerReference.current = player;

    // handling video player
    player.on("waiting", () => {
      videojs.log("Video Player is waiting");
    });
    player.on("dispose", () => {
      videojs.log("Video player will dispose");
    });
  };
  return (
    <div className=" w-9/12 m-auto">
      <VideoJS options={videoJsOptions} onReady={playerReady} />
    </div>
  );
};

export default App;
