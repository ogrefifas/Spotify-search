import React, { Component } from 'react';
import { Spinner, WindowEvent } from './';
import PropTypes from 'prop-types';
import { COMMON_DATA } from '../constants';
import '../styles/currentPlaying.less';

export default class CurrentPlayingTrack extends Component {

    addTrackToAudioPlayer = () => {
        this.removeTrackFromAudioPlayer();
        setTimeout(()=> this.props.addTrackToPlayer(this.props.currentPlayingTrack.track));
    }

    removeTrackFromAudioPlayer = () => {
        this.props.removeTrackFromPlayer();
    }

    changeTrackState = () => {
        this.props.changeTrackState({}, this.props.currentPlayingTrack.track.is_playing)
    }

    componentDidMount() {
        this.loadCurrentPlayingTrack();
    }

    componentWillUnmount() {
        this.props.removeDevices();
        this.removeTrackFromAudioPlayer();
    }

    loadCurrentPlayingTrack = () => {
        this.removeTrackFromAudioPlayer();
        this.props.getDevices();
        this.props.getCurrentPlayingTrack();
    }

    nextTrack = () => {
        this.props.playTrack({}, true);
        this.removeTrackFromAudioPlayer();
    }

    prevTrack = () => {
        this.props.playTrack({});
        this.removeTrackFromAudioPlayer();
    }

    getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case COMMON_DATA.deviceTypes.mobile:
                return 'fa-mobile';
            case COMMON_DATA.deviceTypes.pc:
                return 'fa-desktop';
            default:
                return 'fa-ban';        
        }
    }

    render() {
        const { currentPlayingTrack, devices, currentPlayingInPlayer = {}, auth } = this.props;
        const { track, loadingCurrentPlayingTrack, loadingNextTrack, loadingPrevTrack, error, loadingTrackState } = currentPlayingTrack;
        const { loading: loadingDevices, list: devicesList, activeDevice } = devices;
        const album = track.album || {};
        const { images } = album;
        const artists = (track.artists || []).map((artist) => artist.name).join();
        const { product } = auth.user;
        const isPremium = product === COMMON_DATA.premiumAccount;
        const nowPlayedInLocalPlayer = track.id && track.id === currentPlayingInPlayer.id;
        const deviceIconClass = this.getDeviceIcon(activeDevice.type);
        return (
            <div className="current-playing">
                <div className="player-control">
                    {isPremium && <button disabled={loadingPrevTrack || !activeDevice.type} className="load-track load-prev-track" onClick={this.prevTrack}>
                        {loadingPrevTrack && <Spinner/> || <i className="fa fa-step-backward"></i>}
                    </button>}
                    <div className="track-info-wrapper">
                        <div className="active-device-type">
                             {loadingDevices ? <Spinner/> : <i className={` fa ${deviceIconClass}`} aria-hidden="true"></i>}
                        </div>
                        <div className="action-buttons">
                            <button title="refresh" className="refresh-button" onClick={this.loadCurrentPlayingTrack}>
                                <i className="fa fa-refresh"/>
                            </button>
                            { isPremium && <button title={track.is_playing ? 'Pause track' : 'Play track'} className="play-button" disabled={loadingTrackState || !track.id} onClick={this.changeTrackState}>
                                <i className={`fa ${track.is_playing ? 'fa-pause-circle' : 'fa-play-circle'}`} />
                            </button> }
                            <button 
                                title="listen track preview"
                                className={`preview-button ${nowPlayedInLocalPlayer ? 'now-played' : ''}`} 
                                disabled={!track.preview_url} 
                                onClick={nowPlayedInLocalPlayer ? this.removeTrackFromAudioPlayer : this.addTrackToAudioPlayer}
                            >
                                <i className="fa fa-music"/>
                            </button>
                        </div>
                        {loadingCurrentPlayingTrack ? <Spinner/> :
                            track.name ?
                            <div className="track-info">
                                <div className="album-image">
                                    <img src={!!images ? images[0].url : null}/>
                                </div>
                                <div className="song-info">
                                    <span>
                                        <i className="fa fa-book" aria-hidden="true"></i>
                                        {album.name}
                                    </span>
                                    <span>
                                        <i className="fa fa-users" aria-hidden="true"></i>
                                        {artists}
                                    </span>
                                    <span>
                                       <i className="fa fa-music" aria-hidden="true"></i>
                                       {track.name}
                                    </span>
                                </div>
                            </div> :
                            <span className="warning">
                                { error.message ? error.message : 'There are no playing tracks' }
                            </span>
                        }
                    </div>
                    {isPremium && <button disabled={loadingNextTrack || !activeDevice.type} className="load-track load-next-track" onClick={this.nextTrack}>
                        {loadingNextTrack ? <Spinner/> : <i className="fa fa-step-forward"></i>}
                    </button>}
                </div>
            </div>
        );
    }
}

CurrentPlayingTrack.propTypes = {
    getCurrentPlayingTrack: PropTypes.func,
    currentPlayingTrack: PropTypes.object,
    currentPlayingInPlayer: PropTypes.object,
    devices: PropTypes.object,
    getDevices: PropTypes.func,
    removeDevices: PropTypes.func,
    playTrack: PropTypes.func,
    addTrackToPlayer: PropTypes.func,
    removeTrackFromPlayer: PropTypes.func
}
