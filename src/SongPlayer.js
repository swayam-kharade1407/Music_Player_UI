import React, { useState, useEffect, useRef } from 'react';
import { FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward } from 'react-icons/fa';

function SongPlayer({ selectedSong, songs, onSongPhotoUpdate, setSelectedSong }) {
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (isPlaying && selectedSong) {
      audioElement.src = selectedSong.url;
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }, [isPlaying, selectedSong]);

  useEffect(() => {
    if (selectedSong && selectedSong.photo && onSongPhotoUpdate) {
      onSongPhotoUpdate(selectedSong.photo);
    }

    setCurrentTime(0); // Reset the seek bar when the song changes
  }, [selectedSong, onSongPhotoUpdate]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const handlePrevious = () => {
    const previousIndex = songs.findIndex((song) => song._id === selectedSong._id) - 1;
    const newIndex = previousIndex < 0 ? songs.length - 1 : previousIndex;
    // setCurrentIndex(newIndex);
    setCurrentTime(0);
    setSelectedSong(songs[newIndex]); // Update the selected song
  };
  
  const handleNext = () => {
    const nextIndex = (songs.findIndex((song) => song._id === selectedSong._id) + 1) % songs.length;
    // setCurrentIndex(nextIndex);
    setCurrentTime(0);
    setSelectedSong(songs[nextIndex]); // Update the selected song
  };
  

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleSeek = (event) => {
    const seekTime = parseFloat(event.target.value);
    setCurrentTime(seekTime);
    audioRef.current.currentTime = seekTime;
  };


  return (
    <div className="song-player">
      <h2>{selectedSong?.title}</h2>
      <img src={selectedSong?.photo} alt={selectedSong?.title}/>

      <audio ref={audioRef} src={selectedSong?.url} />

      <div className="seek-bar">
        <input
          type="range"
          min={0}
          max={selectedSong?.duration}
          value={currentTime}
          step={0.01} // Using a smaller step for smoother seek bar movement
          onChange={handleSeek}
        />
      </div>

      <div className="controls">
  <button className="circular-button" onClick={handlePrevious}>
    <FaStepBackward size={24}/>
  </button>
  <button className="circular-button" onClick={handlePlayPause}>
    {isPlaying ? <FaPauseCircle size={24}/> : <FaPlayCircle size={24}/>}
  </button>
  <button className="circular-button" onClick={handleNext}>
    <FaStepForward size={24}/>
  </button>
</div>



    </div>
  );
}

export default SongPlayer;
