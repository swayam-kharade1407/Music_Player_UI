import './App.css';
import React, { useState, useEffect} from 'react';
import { useQuery, gql } from '@apollo/client';
import SongPlayer from './SongPlayer';


const GET_PLAYLISTS = gql`
  query {
    getPlaylists {
      id
      title
    }
  }
`;

const GET_SONGS = gql`
  query GetSongs($playlistId: Int!, $search: String) {
    getSongs(playlistId: $playlistId, search: $search) {
      _id
      title
      photo
      url
      duration
      artist
    }
  }
`;

function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { loading: loadingPlaylists, error: playlistsError, data: playlistsData } = useQuery(GET_PLAYLISTS);
  const { loading: loadingSongs, error: songsError, data: songsData } = useQuery(GET_SONGS, {
    variables: { playlistId: selectedPlaylistId, search: searchText },
    skip: !selectedPlaylistId, // skip query until playlist is selected
  });
  const [selectedSong, setSelectedSong] = useState(null);
  // const songs = useMemo(() => songsData?.getSongs || [], [songsData]);

  const [selectedSongPhoto, setSelectedSongPhoto] = useState(null); // New state for selected song photo
  // const [currentSelectedSong, setCurrentSelectedSong] = useState(null);
  const [firstPlaylistId, setFirstPlaylistId] = useState(null);
  const handleSongClick = (song) => {
    console.log('handleSongClick:', song);
    setSelectedSong(song);
  };
  // Check if playlists data is available and set the first playlist's ID
  useEffect(() => {
    if (playlistsData?.getPlaylists.length > 0) {
      setFirstPlaylistId(playlistsData.getPlaylists[0].id);
    }
  }, [playlistsData]);

  // Select the first playlist when the component is rendered
  useEffect(() => {
    if (firstPlaylistId) {
      setSelectedPlaylistId(firstPlaylistId);
    }
  }, [firstPlaylistId]);

  useEffect(() => {
    // Call the parent component's callback to update the song photo
    if (selectedSong && selectedSong.photo) {
      setSelectedSongPhoto(selectedSong.photo);
    }
  }, [selectedSong]);
  useEffect(() => {
    if (songsData) {
      console.log('songs:', songsData.getSongs);
      console.log('selectedSong:', selectedSong);
    }
  }, [songsData, selectedSong]);
  


  function handlePlaylistSelect(id) {
    setSelectedPlaylistId(id);
  }

  function handleSearchChange(event) {
    setSearchText(event.target.value);
  }

  function LoadingPlaylists() {
    return (
      <div>
        <p>Loading playlists...</p>
      </div>
    );
  }
  function handleSongPhotoUpdate(photoUrl) {
    setSelectedSongPhoto(photoUrl);
  }
function MiddlePane({ songs = [], selectedPlaylistId, selectedSong, setSelectedSong, handleSongClick }) {
  const selectedPlaylist = playlistsData && playlistsData.getPlaylists.find((playlist) => playlist.id === selectedPlaylistId);


  if (!selectedPlaylist) {
    return <div>Loading...</div>;
  }
  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  };
  

  return (
    <div className="middle-pane">
      <h2>{selectedPlaylist.title}</h2>
      <div className="search-bar">
        <input id="search" type="text" value={searchText} onChange={handleSearchChange} placeholder="Search Song, Artist" />
      </div>
      
      <ul>
        {songs.map((song) => (
          <div className="middle-container" key={song._id}>
            <div className="song-photo">
              <img className="small-image" src={song.photo} alt={song.title} />
            </div>
            <div className="song-details">
              <li onClick={() => handleSongClick(song)}>
                <ul className="song-title">{song.title}</ul>
                <ul>
                  <div className="song-info">
                    <p className="artist">{song.artist}</p>
                    <p className="duration">{formatTime(song.duration)}</p>
                  </div>
                </ul>
              </li>
            </div>
          </div>
        ))}
      </ul>
      {selectedSong !== null && (<SongPlayer selectedSong={selectedSong} songs={songs} onSongPhotoUpdate={handleSongPhotoUpdate} setSelectedSong={setSelectedSong} />)}
    </div>
  );
}


  return (
    <div className="app-container override-background" style={{ backgroundImage: `url(${selectedSongPhoto})`, backgroundColor: 'rgba(0, 0, 0, 0.5)'  }}>
    
    
      {loadingPlaylists ? (
        <LoadingPlaylists />
      ) : playlistsError ? (
        <p>Error loading playlists: {playlistsError.message}</p>
      ) : (
        <div className="loading-container">
          <h1>Spotify</h1>
          <ul className='selected'>
            {playlistsData?.getPlaylists.map((playlist) => (
              <li key={playlist.id} onClick={() => handlePlaylistSelect(playlist.id)}>
                {playlist.title}
              </li>
              
            ))}
          </ul>
        </div>
      )}
      {selectedPlaylistId && (
        <div>

          {loadingSongs ? (
            <MiddlePane selectedPlaylistId={selectedPlaylistId} />
          ) : songsError ? (
            <p>Error loading songs: {songsError.message}</p>
          ) : (
            <div className="content-wrapper">
              <MiddlePane
                songs={songsData?.getSongs || []}
                selectedPlaylistId={selectedPlaylistId}
                selectedSong={selectedSong}
                setSelectedSong={setSelectedSong}
                playlists={playlistsData?.getPlaylists || []}
                handleSongClick={handleSongClick}
              />

            
         
          </div>
          )}
        </div>
      )}
      
    </div>
  );
}


export default App;
