import { combineReducers } from 'redux';
import tracks from './tracks';
import auth from './auth';
import currentPlayingTrack from './currentPlayingTrack';
import audioPlayer from './audioPlayer';
import devices from './devices';
import playlists from './playlists';
import playlistTracks from './playlistTracks';

export default combineReducers({
	audioPlayer, tracks, currentPlayingTrack, auth, devices, playlists, playlistTracks
});