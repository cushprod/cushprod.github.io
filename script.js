// DOM elementlerini önbelleğe alma
const domElements = {
    profilePicture: document.getElementById('profile-picture'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.querySelector('#theme-toggle i'),
    platformModal: document.getElementById('platform-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalClose: document.querySelector('.modal-close'),
    appleMusicModal: document.getElementById('apple-music-modal'),
    appleMusicModalClose: document.querySelector('#apple-music-modal .modal-close'),
    welcomeScreen: document.getElementById('welcome-screen'),
    mainContent: document.getElementById('main-content'),
    newDropSection: document.querySelector('.link-group .group-title')?.parentElement,
    beatListSection: document.getElementById('beat-list'),
    scrollToTop: document.getElementById('scroll-to-top'),
    scrollPos: 0
};

// Ses kontrolü için global değişkenler
const audioPlayers = {
    currentAudio: new Audio(),
    currentAudio2: new Audio(),
    isPlaying: false,
    isPlaying2: false,
    currentBeatName: '',
    currentBeatData: null
};

// Uygulama durumu
const appState = {
    preloadedProfilePictures: [],
    currentProfileIndex: 1,
    totalProfilePictures: 5
};

// Yardımcı fonksiyonlar
const utils = {
    // Hata mesajı gösterme
    showError: (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    },

    // Öğe yükleme kontrolü
    elementExists: (element) => {
        return element !== null && element !== undefined;
    },

    // LocalStorage'dan tema yükleme
    loadTheme: () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            if (domElements.themeIcon) {
                domElements.themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
            updateSocialIcons('light');
        }
    }
};

// Beat verileri ile ilgili fonksiyonlar
const beatManager = {
    // JSON'dan beat verilerini çekme ve sayfayı doldurma
    loadBeatsData: async () => {
        try {
            const response = await fetch('./beats.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (!data.beats || !Array.isArray(data.beats)) {
                throw new Error('Invalid JSON structure: beats array not found');
            }

            // Beat'leri isNew durumuna göre filtrele
            const newBeats = data.beats.filter(beat => beat.isNew === true);
            const otherBeats = data.beats.filter(beat => beat.isNew !== true);

            // Bölümleri doldur
            beatManager.populateNewDropSection(newBeats);
            beatManager.populateBeatListSection(otherBeats);

        } catch (error) {
            console.error('Error loading beats data:', error);
            utils.showError('Beat data load error.');
        }
    },

    // NEW DROP bölümünü doldurma
    populateNewDropSection: (beats) => {
        if (!utils.elementExists(domElements.newDropSection)) return;

        const groupTitle = domElements.newDropSection.querySelector('.group-title');
        domElements.newDropSection.innerHTML = '';
        if (groupTitle) domElements.newDropSection.appendChild(groupTitle);

        beats.forEach(beat => {
            const beatElement = beatManager.createBeatElement(beat);
            domElements.newDropSection.appendChild(beatElement);
        });
    },

    // BEAT LIST bölümünü doldurma
    populateBeatListSection: (beats) => {
        if (!utils.elementExists(domElements.beatListSection)) return;

        domElements.beatListSection.innerHTML = '';
        beats.forEach(beat => {
            const beatElement = beatManager.createBeatElement(beat);
            domElements.beatListSection.appendChild(beatElement);
        });
    },

    // Tek bir beat elementi oluşturma
    createBeatElement: (beat) => {
        const linkItem = document.createElement('a');
        linkItem.className = 'link-item';
        linkItem.setAttribute('data-beat', beat.title);
        linkItem.setAttribute('data-youtube', beat.platforms.youtube || '');
        linkItem.setAttribute('data-beatstars', beat.platforms.beatstars || '');
        linkItem.setAttribute('data-airbit', beat.platforms.airbit || '');
        linkItem.setAttribute('data-traktrain', beat.platforms.traktrain || '');
        linkItem.setAttribute('data-audio', beat.audio || '');

        // İkon bölümü
        const linkIcon = document.createElement('div');
        linkIcon.className = 'link-icon';
        const iconImg = document.createElement('img');
        iconImg.src = beat.image;
        iconImg.alt = beat.title;
        iconImg.loading = 'lazy';
        linkIcon.appendChild(iconImg);

        // Metin bölümü
        const linkText = document.createElement('div');
        linkText.className = 'link-text';
        linkText.textContent = beat.description;

        // Ok bölümü
        const linkArrow = document.createElement('div');
        linkArrow.className = 'link-arrow';
        const arrowIcon = document.createElement('i');
        arrowIcon.className = 'fas fa-chevron-right';
        linkArrow.appendChild(arrowIcon);

        // Tüm elemanları birleştir
        linkItem.appendChild(linkIcon);
        linkItem.appendChild(linkText);
        linkItem.appendChild(linkArrow);

        return linkItem;
    }
};

// Profil resmi yönetimi
const profileManager = {
    // Rastgele profil fotoğrafı ayarlama
    setRandomProfilePicture: () => {
        if (!appState.preloadedProfilePictures.length) {
            // Tüm fotoğrafları önceden yükle
            for (let i = 1; i <= appState.totalProfilePictures; i++) {
                const img = new Image();
                const imgSrc = i === 1 ? 'img/profile-picture.webp' : `img/profile-picture${i}.webp`;
                img.src = imgSrc;
                appState.preloadedProfilePictures.push(img);
            }
        }

        // Rastgele bir indeks seç
        const randomIndex = Math.floor(Math.random() * appState.totalProfilePictures) + 1;
        const imgPath = randomIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${randomIndex}.webp`;

        // Fotoğrafı fade efekti ile değiştir
        profileManager.fadeChangeProfilePicture(imgPath);
        profileManager.preloadNextProfilePicture(randomIndex);
        appState.currentProfileIndex = randomIndex;
    },

    // Bir sonraki fotoğrafı önceden yükle
    preloadNextProfilePicture: (currentIndex) => {
        const nextIndex = currentIndex % appState.totalProfilePictures + 1;
        const nextImgPath = nextIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${nextIndex}.webp`;

        const img = new Image();
        img.src = nextImgPath;
    },

    // Fade efekti ile profil fotoğrafı değiştirme
    fadeChangeProfilePicture: (newImagePath) => {
        if (!utils.elementExists(domElements.profilePicture)) return;

        const profileImg = domElements.profilePicture;
        const profileContainer = document.querySelector('.profile-image');
        if (!profileContainer) return;

        // Yeni bir resim elementi oluştur
        const newImg = document.createElement('img');
        newImg.src = newImagePath;
        newImg.alt = "@cushprod Profil Fotoğrafı";
        newImg.id = "profile-picture";
        newImg.style.position = "absolute";
        newImg.style.top = "0";
        newImg.style.left = "0";
        newImg.style.width = "100%";
        newImg.style.height = "100%";
        newImg.style.opacity = "0";
        newImg.style.transition = "opacity 0.8s ease";
        newImg.style.objectFit = "cover";

        // Mevcut resmi container'a ekle
        profileContainer.style.position = "relative";
        profileContainer.appendChild(newImg);

        // Yeni resmi fade-in yap
        setTimeout(() => {
            newImg.style.opacity = "1";
        }, 50);

        // Eski resmi fade-out yap ve kaldır
        profileImg.style.transition = "opacity 0.8s ease";
        profileImg.style.opacity = "0";

        // Eski resmi temizle
        setTimeout(() => {
            if (profileImg.parentNode === profileContainer) {
                profileContainer.removeChild(profileImg);
            }
            // Yeni resmin pozisyonunu düzelt
            newImg.style.position = "";
            // DOM referansını güncelle
            domElements.profilePicture = newImg;
        }, 800);
    },

    // Sıradaki profil fotoğrafına geç
    nextProfilePicture: () => {
        const nextIndex = appState.currentProfileIndex % appState.totalProfilePictures + 1;
        const imgPath = nextIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${nextIndex}.webp`;

        profileManager.fadeChangeProfilePicture(imgPath);
        profileManager.preloadNextProfilePicture(nextIndex);
        appState.currentProfileIndex = nextIndex;
    }
};

// Tema yönetimi
const themeManager = {
    // Tema değiştirme işlevi
    toggleTheme: () => {
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');

        // İkon ve tema bilgisini güncelle
        if (isLightTheme) {
            domElements.themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
            updateSocialIcons('light');
        } else {
            domElements.themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
            updateSocialIcons('dark');
        }
    }
};

// Sosyal medya ikonlarını güncelle
function updateSocialIcons(theme) {
    const socialIcons = {
        youtube: document.querySelector('.youtube img'),
        soundcloud: document.querySelector('.soundcloud img'),
        instagram: document.querySelector('.instagram img'),
        tiktok: document.querySelector('.tiktok img'),
        email: document.querySelector('.email img')
    };

    const iconPaths = {
        dark: {
            youtube: "icons/youtube.webp",
            soundcloud: "icons/soundcloud.webp",
            instagram: "icons/instagram.webp",
            tiktok: "icons/tiktok.webp",
            email: "icons/mail.webp"
        },
        light: {
            youtube: "icons/youtube2.webp",
            soundcloud: "icons/soundcloud2.webp",
            instagram: "icons/instagram2.webp",
            tiktok: "icons/tiktok2.webp",
            email: "icons/mail2.webp"
        }
    };

    for (const [platform, element] of Object.entries(socialIcons)) {
        if (element) {
            element.src = iconPaths[theme][platform];
        }
    }
}

// Modal yönetimi
const modalManager = {
    // Modal açma işlevi
    openPlatformModal: (beatName, beatData) => {
        domElements.scrollPos = window.pageYOffset;
        document.body.classList.add('body-no-scroll');
        document.body.style.setProperty('--scroll-pos', `-${domElements.scrollPos}px`);
        
        // Modal başlığını ayarla
        domElements.modalTitle.textContent = beatName;
        audioPlayers.currentBeatName = beatName;
        audioPlayers.currentBeatData = beatData;

        // Platform linklerini ayarla
        const platforms = ['youtube', 'beatstars', 'airbit', 'traktrain'];
        platforms.forEach(platform => {
            const element = document.querySelector(`.platform-option[data-platform="${platform}"]`);
            if (element && beatData[`data-${platform}`]) {
                element.href = beatData[`data-${platform}`];
            }
        });

        // Ses önizlemesini yükle
        const audioPath = beatData['data-audio'];
        if (audioPath) {
            audioManager.loadAudioPreview(audioPath, audioPlayers.currentAudio);
        } else {
            console.error('Audio path not found for beat:', beatName);
        }

        // Eğer beat "YOU" ise ikinci ses oynatıcıyı göster
        const secondAudioContainer = document.querySelector('.second-audio');
        if (beatName === 'YOU') {
            secondAudioContainer.style.display = 'block';
            const secondAudioPath = audioPath.replace('.mp3', '_part2.mp3');
            audioManager.loadAudioPreview(secondAudioPath, audioPlayers.currentAudio2, true);
        } else {
            secondAudioContainer.style.display = 'none';
            audioPlayers.currentAudio2.pause();
            audioManager.resetAudioUI(true);
        }

        // Modalı göster
        domElements.platformModal.classList.add('active');
        domElements.platformModal.setAttribute('aria-hidden', 'false');
    },

    // Modal kapatma işlevi
    closeModal: (modalElement) => {
        document.body.classList.remove('body-no-scroll');
        document.body.style.removeProperty('--scroll-pos');
        window.scrollTo(0, domElements.scrollPos);
        modalElement.classList.remove('active');
        modalElement.setAttribute('aria-hidden', 'true');

        // Sesleri durdur
        audioPlayers.currentAudio.pause();
        audioPlayers.currentAudio2.pause();
        audioManager.resetAudioUI();
        audioManager.resetAudioUI(true);
    },

    // Apple Music modalını aç
    openAppleMusicModal: (musicUrl) => {
        domElements.scrollPos = window.pageYOffset;
        document.body.classList.add('body-no-scroll');
        document.body.style.setProperty('--scroll-pos', `-${domElements.scrollPos}px`);
        
        const iframe = domElements.appleMusicModal?.querySelector('iframe');
        const directLink = domElements.appleMusicModal?.querySelector('.link-to-apple-music');

        if (iframe) {
            iframe.src = `https://embed.music.apple.com/tr/playlist/bi-bira-bi-soju/pl.u-qxylEYDT3ByJYdV?l=tr`;
        }
        
        if (directLink) {
            directLink.href = musicUrl;
        }

        domElements.appleMusicModal.classList.add('active');
        domElements.appleMusicModal.setAttribute('aria-hidden', 'false');
    }
};

// Ses yönetimi
const audioManager = {
    // Ses önizlemesi yükleme
    loadAudioPreview: (audioPath, audioElement, isSecond = false) => {
        // Önce mevcut sesi durdur ve sıfırla
        audioElement.pause();
        audioElement.currentTime = 0;

        // Yeni ses yolunu ayarla
        audioElement.src = audioPath;

        // Ses yüklendikten sonra UI'yı sıfırla
        audioElement.addEventListener('loadedmetadata', () => {
            audioManager.resetAudioUI(isSecond);
        });

        // Hata durumunda konsola bilgi ver
        audioElement.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            console.error('Failed to load audio from:', audioPath);
        });
    },

    // Ses arayüzünü sıfırla
    resetAudioUI: (isSecond = false) => {
        const suffix = isSecond ? '2' : '';
        const playButton = document.querySelector(`.play-pause${suffix}`);

        audioPlayers[isSecond ? 'isPlaying2' : 'isPlaying'] = false;
        audioManager.updatePlayPauseIcon(playButton, false);
        
        const progressBar = document.querySelector(`.audio-progress-bar${suffix}`);
        const timeDisplay = document.querySelector(`.audio-time${suffix}`);
        
        if (progressBar) progressBar.style.width = '0%';
        if (timeDisplay) timeDisplay.textContent = '0:00';
    },

    // Oynat/Duraklat butonunu güncelle
    updatePlayPauseIcon: (button, isPlaying) => {
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-play', !isPlaying);
            icon.classList.toggle('fa-pause', isPlaying);
        }
    },

    // Ses düzeyi butonunu güncelle
    updateMuteIcon: (button, isMuted) => {
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-volume-up', !isMuted);
            icon.classList.toggle('fa-volume-mute', isMuted);
        }
    },

    // Ses ilerlemesini güncelle
    updateAudioProgress: (audioElement, isSecond) => {
        const suffix = isSecond ? '2' : '';
        if (audioElement.duration) {
            const percent = (audioElement.currentTime / audioElement.duration) * 100;
            const progressBar = document.querySelector(`.audio-progress-bar${suffix}`);
            
            if (progressBar) {
                progressBar.style.width = `${percent}%`;
            }

            // Kalan süreyi hesapla
            const remainingTime = audioElement.duration - audioElement.currentTime;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = Math.floor(remainingTime % 60);

            const timeDisplay = document.querySelector(`.audio-time${suffix}`);
            if (timeDisplay) {
                timeDisplay.textContent = `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }
    },

    // İlerleme çubuğunda tıklama işlemi
    handleProgressBarClick: (e, isSecond) => {
        const progressBar = e.target.closest('.audio-progress');
        if (!progressBar) return;

        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const audio = isSecond ? audioPlayers.currentAudio2 : audioPlayers.currentAudio;

        if (audio.duration) {
            audio.currentTime = (clickX / width) * audio.duration;
        }
    }
};

// Scroll yönetimi
const scrollManager = {
    // Yukarı Çık butonu fonksiyonelliği
    initScrollToTop: () => {
        if (!utils.elementExists(domElements.scrollToTop)) return;

        // Scroll olayını dinle
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                domElements.scrollToTop.classList.add('show');
            } else {
                domElements.scrollToTop.classList.remove('show');
            }
        });

        // Tıklama olayını dinle
        domElements.scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// Event delegation için ana işleyici
const setupEventDelegation = () => {
    document.addEventListener('click', (e) => {
        // Beat linkleri için
        const beatLink = e.target.closest('.link-item[data-beat]');
        if (beatLink) {
            e.preventDefault();
            const beatData = {
                'data-youtube': beatLink.getAttribute('data-youtube'),
                'data-beatstars': beatLink.getAttribute('data-beatstars'),
                'data-airbit': beatLink.getAttribute('data-airbit'),
                'data-traktrain': beatLink.getAttribute('data-traktrain'),
                'data-audio': beatLink.getAttribute('data-audio')
            };
            modalManager.openPlatformModal(beatLink.getAttribute('data-beat'), beatData);
            return;
        }

        // Apple Music linki için
        const appleMusicLink = e.target.closest('.apple-music-link');
        if (appleMusicLink) {
            e.preventDefault();
            const musicUrl = appleMusicLink.getAttribute('data-apple-music-url');
            modalManager.openAppleMusicModal(musicUrl);
            return;
        }

        // Modal kapatma butonları için
        if (e.target.classList.contains('modal-close') || e.target.parentElement.classList.contains('modal-close')) {
            const modal = e.target.closest('.platform-modal');
            if (modal) {
                modalManager.closeModal(modal);
            }
            return;
        }

        // Modal dışına tıklama için
        if (e.target.classList.contains('platform-modal')) {
            modalManager.closeModal(e.target);
            return;
        }

        // Ses kontrolü için
        audioManager.handleAudioControls(e);
    });
};

// Ses kontrol event handler'ı
audioManager.handleAudioControls = (e) => {
    // İlk ses kontrolü
    if (e.target.closest('.play-pause')) {
        const btn = e.target.closest('.play-pause');
        if (audioPlayers.isPlaying) {
            audioPlayers.currentAudio.pause();
        } else if (audioPlayers.currentAudio.src) {
            audioPlayers.currentAudio.play().catch(error => {
                console.error('Audio play error:', error);
            });
        }
        audioPlayers.isPlaying = !audioPlayers.isPlaying;
        audioManager.updatePlayPauseIcon(btn, audioPlayers.isPlaying);
        return;
    }

    // İkinci ses kontrolü
    if (e.target.closest('.play-pause2')) {
        const btn = e.target.closest('.play-pause2');
        if (audioPlayers.isPlaying2) {
            audioPlayers.currentAudio2.pause();
        } else if (audioPlayers.currentAudio2.src) {
            audioPlayers.currentAudio2.play().catch(error => {
                console.error('Audio play error:', error);
            });
        }
        audioPlayers.isPlaying2 = !audioPlayers.isPlaying2;
        audioManager.updatePlayPauseIcon(btn, audioPlayers.isPlaying2);
        return;
    }

    // Ses seviyesi kontrolü
    if (e.target.closest('.mute')) {
        const btn = e.target.closest('.mute');
        audioPlayers.currentAudio.muted = !audioPlayers.currentAudio.muted;
        audioManager.updateMuteIcon(btn, audioPlayers.currentAudio.muted);
        return;
    }

    if (e.target.closest('.mute2')) {
        const btn = e.target.closest('.mute2');
        audioPlayers.currentAudio2.muted = !audioPlayers.currentAudio2.muted;
        audioManager.updateMuteIcon(btn, audioPlayers.currentAudio2.muted);
        return;
    }

    // İlerleme çubuğu tıklama
    const progressBar = e.target.closest('.audio-progress');
    if (progressBar) {
        const isSecond = progressBar.parentElement.parentElement.classList.contains('second-audio');
        audioManager.handleProgressBarClick(e, isSecond);
        return;
    }
};

// Sayfa yüklendikten sonra çalışacak kod
document.addEventListener('DOMContentLoaded', function () {
    // Apple Music iframe'ini yükle
    const iframe = domElements.appleMusicModal?.querySelector('iframe');
    if (iframe) {
        iframe.src = "https://embed.music.apple.com/tr/playlist/bi-bira-bi-soju/pl.u-qxylEYDT3ByJYdV?l=tr";
    }
    
    // Beat verilerini yükle
    beatManager.loadBeatsData();

    // Profil resmini ayarla ve döngüyü başlat
    profileManager.setRandomProfilePicture();
    setInterval(profileManager.nextProfilePicture, 5000);

    // Önceden yüklenecek görüntüler
    const preloadImages = [
        "icons/youtube.webp", "icons/youtube2.webp",
        "icons/soundcloud.webp", "icons/soundcloud2.webp",
        "icons/instagram.webp", "icons/instagram2.webp",
        "icons/tiktok.webp", "icons/tiktok2.webp",
        "icons/mail.webp", "icons/mail2.webp"
    ];

    preloadImages.forEach(src => {
        new Image().src = src;
    });

    // Kayıtlı temayı yükle
    utils.loadTheme();

    // Tema değiştirme butonuna event listener ekle
    if (domElements.themeToggle) {
        domElements.themeToggle.addEventListener('click', themeManager.toggleTheme);
    }

    // Event delegation'ı ayarla
    setupEventDelegation();

    // Ses ilerleme güncellemeleri
    audioPlayers.currentAudio.addEventListener('timeupdate', function () {
        audioManager.updateAudioProgress(this, false);
    });

    audioPlayers.currentAudio2.addEventListener('timeupdate', function () {
        audioManager.updateAudioProgress(this, true);
    });

    // Ses bitiş olayları
    audioPlayers.currentAudio.addEventListener('ended', function () {
        audioPlayers.isPlaying = false;
        audioManager.updatePlayPauseIcon(document.querySelector('.play-pause'), false);
        document.querySelector('.audio-progress-bar').style.width = '0%';
        document.querySelector('.audio-time').textContent = '0:00';
    });

    audioPlayers.currentAudio2.addEventListener('ended', function () {
        audioPlayers.isPlaying2 = false;
        audioManager.updatePlayPauseIcon(document.querySelector('.play-pause2'), false);
        document.querySelector('.audio-progress-bar2').style.width = '0%';
        document.querySelector('.audio-time2').textContent = '0:00';
    });

    // Scroll to top butonunu başlat
    scrollManager.initScrollToTop();
});

// Sayfa yüklendiğinde hoşgeldin ekranını kaldır
window.addEventListener('load', function () {
    setTimeout(function () {
        if (domElements.welcomeScreen) {
            domElements.welcomeScreen.style.opacity = '0';
        }
        
        if (domElements.mainContent) {
            domElements.mainContent.classList.add('show');
        }

        setTimeout(function () {
            if (domElements.welcomeScreen) {
                domElements.welcomeScreen.style.display = 'none';
            }
        }, 1000);
    }, 100);
});
