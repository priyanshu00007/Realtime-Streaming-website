/**
 * StreamFlow Video Player - Logic
 */

class StreamFlowPlayer {
    constructor() {
        // --- DOM Elements ---
        this.urlSection = document.getElementById('urlSection');
        this.playerSection = document.getElementById('playerSection');
        this.playerContainer = document.getElementById('playerContainer');
        this.video = document.getElementById('videoPlayer');
        this.urlInput = document.getElementById('videoUrl');
        this.loadBtn = document.getElementById('loadBtn');
        this.backBtn = document.getElementById('backBtn');
        this.useProxyCheckbox = document.getElementById('useProxy');
        
        // Overlays
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.errorOverlay = document.getElementById('errorOverlay');
        this.errorText = document.getElementById('errorText');
        this.bufferIndicator = document.getElementById('bufferIndicator');
        this.bigPlayBtn = document.getElementById('bigPlayBtn');
        this.retryBtn = document.getElementById('retryBtn');
        
        // Controls
        this.controls = document.getElementById('controls');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.skipBackBtn = document.getElementById('skipBackBtn');
        this.skipForwardBtn = document.getElementById('skipForwardBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.pipBtn = document.getElementById('pipBtn');
        
        // Menus
        this.speedBtn = document.getElementById('speedBtn');
        this.speedMenu = document.getElementById('speedMenu');
        this.speedValue = document.getElementById('speedValue');
        
        this.qualityBtn = document.getElementById('qualityBtn');
        this.qualityMenu = document.getElementById('qualityMenu');
        this.qualityList = document.getElementById('qualityList');

        this.captionBtn = document.getElementById('captionBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Progress
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBuffer = document.getElementById('progressBuffer');
        this.progressPlayed = document.getElementById('progressPlayed');
        this.progressThumb = document.getElementById('progressThumb');
        this.progressTooltip = document.getElementById('progressTooltip');
        
        // Time
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.timeInputWrapper = document.getElementById('timeInputWrapper');
        this.timeInput = document.getElementById('timeInput');
        this.timeGoBtn = document.getElementById('timeGoBtn');
        
        // Stats
        this.bufferPercent = document.getElementById('bufferPercent');
        this.networkSpeed = document.getElementById('networkSpeed');
        
        // State
        this.isPlaying = false;
        this.isMuted = false;
        this.isFullscreen = false;
        this.currentUrl = '';
        this.captionsEnabled = false;
        this.hls = null;
        this.dashPlayer = null;
        
        // Initialization
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderHistory();
        this.setupCasting();
        this.urlInput.focus();
        
        // Check URL params
        const params = new URLSearchParams(window.location.search);
        const videoUrl = params.get('url');
        if (videoUrl) {
            this.urlInput.value = decodeURIComponent(videoUrl);
            this.loadVideo();
        }
    }
    
    bindEvents() {
        // Navigation
        this.loadBtn.addEventListener('click', () => this.loadVideo());
        this.urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.loadVideo(); });
        this.backBtn.addEventListener('click', () => this.showUrlSection());
        this.retryBtn.addEventListener('click', () => this.loadVideo());
        
        // Playback
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.bigPlayBtn.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('dblclick', () => this.toggleFullscreen());
        
        this.skipBackBtn.addEventListener('click', () => this.skip(-10));
        this.skipForwardBtn.addEventListener('click', () => this.skip(10));
        
        // Volume
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Progress Scrubbing
        let isDragging = false;
        const startDrag = (e) => { isDragging = true; this.seek(e); };
        const endDrag = () => { isDragging = false; };
        const doDrag = (e) => { if (isDragging) this.seek(e); };

        this.progressContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', endDrag);
        this.progressContainer.addEventListener('click', (e) => this.seek(e));
        this.progressContainer.addEventListener('mousemove', (e) => this.updateTooltip(e));

        // Video Events
        this.video.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this.formatTime(this.video.duration);
            this.hideLoading();
            this.updateSpeedStatus();
        });
        
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('progress', () => this.updateBuffer());
        this.video.addEventListener('waiting', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());
        this.video.addEventListener('playing', () => {
            this.playerContainer.classList.add('playing');
            this.playerContainer.classList.remove('paused');
            this.isPlaying = true;
        });
        this.video.addEventListener('pause', () => {
            this.playerContainer.classList.remove('playing');
            this.playerContainer.classList.add('paused');
            this.isPlaying = false;
        });
        this.video.addEventListener('error', (e) => this.handleError(e));
        
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.playerContainer.classList.toggle('fullscreen', this.isFullscreen);
        });

        // Speed Menu
        this.speedBtn.addEventListener('click', () => this.speedMenu.classList.toggle('active'));
        document.querySelectorAll('.speed-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setPlaybackSpeed(parseFloat(e.target.dataset.speed));
                // Update UI active state
                document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Custom Speed
        const customSpeedInput = document.getElementById('customSpeedInput');
        const customSpeedBtn = document.getElementById('customSpeedBtn');
        customSpeedBtn.addEventListener('click', () => {
             const s = parseFloat(customSpeedInput.value);
             if(s > 0) this.setPlaybackSpeed(s);
        });
        
        // Quality Menu toggle
        this.qualityBtn.addEventListener('click', () => this.qualityMenu.classList.toggle('active'));

        // Captions & Download
        this.captionBtn.addEventListener('click', () => this.toggleCaptions());
        this.downloadBtn.addEventListener('click', () => this.downloadVideo());
        
        // Keyboard
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Close menus on click outside
        document.addEventListener('click', (e) => {
            if(!e.target.closest('.dropdown')) {
                this.speedMenu.classList.remove('active');
                this.qualityMenu.classList.remove('active');
            }
        });
    }
    
    // --- Logic Methods ---

    loadVideo() {
        let url = this.urlInput.value.trim();
        if (!url) { this.urlInput.focus(); return; }
        
        this.addToHistory(url);
        
        if (this.useProxyCheckbox.checked) {
            url = `http://localhost:4000/proxy?url=${encodeURIComponent(url)}`;
        }
        
        this.currentUrl = url;
        this.errorOverlay.classList.remove('active');
        this.urlSection.classList.add('hidden');
        this.playerSection.classList.add('active');
        this.showLoading();
        
        // Cleanup
        if (this.hls) { this.hls.destroy(); this.hls = null; }
        if (this.dashPlayer) { this.dashPlayer.reset(); this.dashPlayer = null; }
        
        // Format selection
        if (url.includes('.m3u8')) {
            this.loadHLS(url);
            this.downloadBtn.style.display = 'none';
        } else if (url.includes('.mpd')) {
            this.loadDASH(url);
            this.downloadBtn.style.display = 'none';
        } else {
            this.loadDirect(url);
            this.downloadBtn.style.display = 'flex';
        }
    }
    
    loadDirect(url) {
        this.video.src = url;
        this.video.load();
    }
    
    loadHLS(url) {
        if (Hls.isSupported()) {
            this.hls = new Hls();
            this.hls.loadSource(url);
            this.hls.attachMedia(this.video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                this.hideLoading();
                this.setupQualityUI('hls', data.levels);
            });
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) this.handleError();
            });
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = url;
        }
    }
    
    loadDASH(url) {
        if (typeof dashjs !== 'undefined') {
            this.dashPlayer = dashjs.MediaPlayer().create();
            this.dashPlayer.initialize(this.video, url, false);
            this.dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
                const levels = this.dashPlayer.getBitrateInfoListFor('video');
                this.setupQualityUI('dash', levels);
            });
        }
    }

    setupQualityUI(type, levels) {
        this.qualityList.innerHTML = '';
        const autoBtn = document.createElement('button');
        autoBtn.className = 'menu-item active';
        autoBtn.textContent = 'Auto';
        autoBtn.onclick = () => this.setQuality(type, -1, autoBtn);
        this.qualityList.appendChild(autoBtn);

        levels.forEach((level, index) => {
            const btn = document.createElement('button');
            btn.className = 'menu-item';
            const h = level.height || (level.bitrate / 1000).toFixed(0) + 'k';
            btn.textContent = `${h}p`;
            btn.onclick = () => this.setQuality(type, index, btn);
            this.qualityList.prepend(btn);
        });
        this.qualityList.prepend(autoBtn);
    }

    setQuality(type, index, btn) {
        // Update UI
        this.qualityList.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (type === 'hls' && this.hls) this.hls.currentLevel = index;
        if (type === 'dash' && this.dashPlayer) {
            const settings = { streaming: { abr: { autoSwitchBitrate: { video: (index === -1) } } } };
            this.dashPlayer.updateSettings(settings);
            if(index !== -1) this.dashPlayer.setQualityFor('video', index);
        }
    }

    togglePlay() {
        this.video.paused ? this.video.play() : this.video.pause();
    }

    skip(sec) {
        this.video.currentTime += sec;
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.muteBtn.parentElement.classList.toggle('muted', this.video.muted);
        this.volumeSlider.value = this.video.muted ? 0 : this.video.volume;
    }

    setVolume(val) {
        this.video.volume = val;
        this.video.muted = (val == 0);
    }
    
    setPlaybackSpeed(rate) {
        this.video.playbackRate = rate;
        this.speedValue.textContent = rate + 'x';
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) this.playerContainer.requestFullscreen();
        else document.exitFullscreen();
    }
    
    updateProgress() {
        if (!this.video.duration) return;
        const pct = (this.video.currentTime / this.video.duration) * 100;
        this.progressPlayed.style.width = `${pct}%`;
        this.progressThumb.style.left = `${pct}%`;
        this.currentTimeEl.textContent = this.formatTime(this.video.currentTime);
    }

    updateBuffer() {
        if (!this.video.duration) return;
        if (this.video.buffered.length > 0) {
            const end = this.video.buffered.end(this.video.buffered.length - 1);
            const pct = (end / this.video.duration) * 100;
            this.progressBuffer.style.width = `${pct}%`;
            
            // Calculate buffer health stats
            const bufferedSeconds = end - this.video.currentTime;
            this.bufferPercent.textContent = bufferedSeconds.toFixed(0) + 's';
        }
    }
    
    seek(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }
    
    updateTooltip(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const time = pos * this.video.duration;
        this.progressTooltip.textContent = this.formatTime(time);
        this.progressTooltip.style.left = `${pos * 100}%`;
    }

    formatTime(s) {
        if(isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0'+sec : sec}`;
    }

    showUrlSection() {
        this.playerSection.classList.remove('active');
        this.urlSection.classList.remove('hidden');
        this.video.pause();
        this.video.src = "";
    }

    // --- Helpers ---
    showLoading() { this.loadingOverlay.classList.add('active'); }
    hideLoading() { this.loadingOverlay.classList.remove('active'); }
    
    handleError(e) {
        this.hideLoading();
        this.errorOverlay.classList.add('active');
    }
    
    addToHistory(url) {
        let history = JSON.parse(localStorage.getItem('sf_history') || '[]');
        if(!history.includes(url)) {
            history.unshift(url);
            if(history.length > 5) history.pop();
            localStorage.setItem('sf_history', JSON.stringify(history));
        }
    }

    renderHistory() {
        const list = document.getElementById('historyList');
        const section = document.getElementById('historySection');
        const history = JSON.parse(localStorage.getItem('sf_history') || '[]');
        
        if(history.length === 0) return;
        
        section.style.display = 'block';
        list.innerHTML = history.map(url => `
            <div class="history-item" onclick="document.getElementById('videoUrl').value = '${url}';">
                <div class="history-text">${url}</div>
            </div>
        `).join('');
    }
    
    setupCasting() {
        const castBtn = document.getElementById('castBtn');
        if (this.video.remote) {
            this.video.remote.watchAvailability((a) => {
                 if(a) castBtn.style.display = 'flex';
            }).catch(() => castBtn.style.display = 'flex');
            
            castBtn.addEventListener('click', () => {
                this.video.remote.prompt();
            });
        }
    }
    
    toggleCaptions() {
        this.captionsEnabled = !this.captionsEnabled;
        for (let i = 0; i < this.video.textTracks.length; i++) {
            this.video.textTracks[i].mode = this.captionsEnabled ? 'showing' : 'hidden';
        }
    }
    
    downloadVideo() {
        const a = document.createElement('a');
        a.href = this.video.src;
        a.download = 'video.mp4';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    handleKeyboard(e) {
        if(e.target.tagName === 'INPUT') return;
        const key = e.key.toLowerCase();
        if(key === ' ' || key === 'k') { e.preventDefault(); this.togglePlay(); }
        if(key === 'f') { e.preventDefault(); this.toggleFullscreen(); }
        if(key === 'm') { e.preventDefault(); this.toggleMute(); }
        if(key === 'arrowright') { e.preventDefault(); this.skip(10); }
        if(key === 'arrowleft') { e.preventDefault(); this.skip(-10); }
    }
    
    updateSpeedStatus() {
       // Placeholder for network speed calc logic from previous versions
       // Kept simple here to focus on UI
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.player = new StreamFlowPlayer();
});