import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-eme";
import "videojs-markers";
import "videojs-markers/dist/videojs.markers.css";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  const { options, onReady } = props;

  const chaptersData = [
    { time: 9.5, text: "Chapter 1", overlayText: "1" },
    { time: 23.6, text: "Chapter 2", overlayText: "3" },
    { time: 160, text: "Chapter 3", overlayText: "2" },
    { time: 200, text: "The End", overlayText: "4" },
  ];

  const handleClick = (timestamp) => {
    const player = playerRef.current;
    player.currentTime(timestamp);
    player.play();
  };

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-16-9");
      videoElement.classList.add("vjs-layout-medium");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);

        player.eme();
        player.autoplay(options.autoplay);

        player.markers({
          markerStyle: {
            width: "7px",
            "border-radius": "30%",
            "background-color": "#1e242c8a",
          },
          markerTip: {
            display: true,
            text: function (marker) {
              return marker.text;
            },
          },
          breakOverlay: {
            display: true,
            displayTime: 2,
            text: function (marker) {
              return "Part: " + marker.text;
            },
          },
          onMarkerReached: function (marker) {
            console.log(marker);
          },
          markers: chaptersData,
        });

        player.src(options.sources);
      }));
    } else {
      //   const player = playerRef.current;
      //   player.eme();
      //   player.autoplay(options.autoplay);
      //   setTimeout(() => {
      //     console.log("1 sec passed");
      //   }, 1000);
      //   player.src(options.sources);
    }
  }, [options, videoRef]);

  React.useEffect(() => {
    const player = playerRef.current;

    document.addEventListener("keydown", (event) => {
      // skips 10s forward/backward
      if (event.key === "ArrowLeft") {
        const whereYouAt = player.currentTime();
        player.currentTime(whereYouAt - 10);
        player.play();
      } else if (event.key === "ArrowRight") {
        const whereYouAt = player.currentTime();
        player.currentTime(whereYouAt + 10);
        player.play();
      }
    });

    // Dispose the Video.js player when the functional component unmounts
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className=" flex m-5  bg-gray-600 rounded-sm">
      <div ref={videoRef} className=" flex-1 vjs-4-3  border-x-2   " />
      {/* <video ref={videoRef} className="video-js vjs-big-playcentered" /> */}
      <div
        className="flex flex-col overflow-y-scroll h-52 gap-10 scroll-container mx-5 m-auto max-sm:hidden max-md:h-32 "
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.preventDefault();
          }
        }}
      >
        {chaptersData.map((chapter) => {
          return (
            <button
              key={chapter.time}
              className=" text-white bg-gray-400 p-2 rounded-md text-sm"
              onClick={() => handleClick(chapter.time)}
            >
              {chapter.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VideoJS;
