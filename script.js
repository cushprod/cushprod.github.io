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
    newDropSection: document.querySelector('.link-group .group-title').parentElement,
    beatListSection: document.getElementById('beat-list')
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

// Önceden yüklenmiş profil resimleri
let preloadedProfilePictures = [];
let currentProfileIndex = 1;

// JSON'dan beat verilerini çekme ve sayfayı doldurma
async function loadBeatsData() {
    try {
        const response = await fetch('./beats.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 'beats' alanının varlığını ve array olduğunu kontrol et
        if (!data.beats || !Array.isArray(data.beats)) {
            throw new Error('Invalid JSON structure: beats array not found');
        }
        
        // Beat'leri isNew durumuna göre filtrele
        const newBeats = data.beats.filter(beat => beat.isNew === true);
        const otherBeats = data.beats.filter(beat => beat.isNew !== true);
        
        // NEW DROP bölümünü doldur
        populateNewDropSection(newBeats);
        
        // BEAT LIST bölümünü doldur
        populateBeatListSection(otherBeats);
        
    } catch (error) {
        console.error('Error loading beats data:', error);
        showErrorMessage('Beat data load error.');
    }
}

// NEW DROP bölümünü doldurma
function populateNewDropSection(beats) {
    // Önce mevcut içeriği temizle (örnek beat hariç)
    const groupTitle = domElements.newDropSection.querySelector('.group-title');
    domElements.newDropSection.innerHTML = '';
    domElements.newDropSection.appendChild(groupTitle);
    
    // Yeni beat'leri ekle
    beats.forEach(beat => {
        const beatElement = createBeatElement(beat);
        domElements.newDropSection.appendChild(beatElement);
    });
}

// BEAT LIST bölümünü doldurma
function populateBeatListSection(beats) {
    // Önce mevcut içeriği temizle
    domElements.beatListSection.innerHTML = '';
    
    // Beat'leri ekle
    beats.forEach(beat => {
        const beatElement = createBeatElement(beat);
        domElements.beatListSection.appendChild(beatElement);
    });
}

// Tek bir beat elementi oluşturma
function createBeatElement(beat) {
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
    
    // Metin bölümü - description kullanılıyor
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

// Hata mesajı gösterme
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff6b6b;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    // Hata mesajını sayfanın üst kısmına ekle
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
}

// Rastgele profil fotoğrafı ayarlama
function setRandomProfilePicture() {
    const totalProfilePictures = 3;
    
    if (!preloadedProfilePictures.length) {
        // Tüm fotoğrafları önceden yükle
        for (let i = 1; i <= totalProfilePictures; i++) {
            const img = new Image();
            const imgSrc = i === 1 ? 'img/profile-picture.webp' : `img/profile-picture${i}.webp`;
            img.src = imgSrc;
            preloadedProfilePictures.push(img);
        }
    }

    // Rastgele bir indeks seç (1'den başlayarak)
    const randomIndex = Math.floor(Math.random() * totalProfilePictures) + 1;
    const imgPath = randomIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${randomIndex}.webp`;

    // Fotoğrafı fade efekti ile değiştir
    fadeChangeProfilePicture(imgPath);
    preloadNextProfilePicture(totalProfilePictures, randomIndex);
    currentProfileIndex = randomIndex;
}

// Bir sonraki fotoğrafı önceden yükle
function preloadNextProfilePicture(totalPictures, currentIndex) {
    let nextIndex = currentIndex % totalPictures + 1;
    const nextImgPath = nextIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${nextIndex}.webp`;

    const img = new Image();
    img.src = nextImgPath;
}

// Fade efekti ile profil fotoğrafı değiştirme
function fadeChangeProfilePicture(newImagePath) {
    const profileImg = domElements.profilePicture;
    const profileContainer = document.querySelector('.profile-image');

    if (!profileImg) return;

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
}

// Sıradaki profil fotoğrafına geç (fade efekti ile)
function nextProfilePicture() {
    const totalProfilePictures = 5;
    let nextIndex = currentProfileIndex % totalProfilePictures + 1;
    const imgPath = nextIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${nextIndex}.webp`;

    fadeChangeProfilePicture(imgPath);
    
    // Bir sonraki fotoğrafı önceden yükle
    let nextNextIndex = nextIndex % totalProfilePictures + 1;
    const nextImgPath = nextNextIndex === 1 ? 'img/profile-picture.webp' : `img/profile-picture${nextNextIndex}.webp`;

    const img = new Image();
    img.src = nextImgPath;

    // Mevcut indeksi güncelle
    currentProfileIndex = nextIndex;
}

// Tema değiştirme işlevi
function toggleTheme() {
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

// Hover animasyonları için genel fonksiyon
function setupHoverAnimation(selector, hoverStyle, normalStyle) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            Object.assign(element.style, hoverStyle);
        });
        element.addEventListener('mouseleave', () => {
            Object.assign(element.style, normalStyle);
        });
    });
}

// Ses önizlemesi yükleme - JSON'daki audio alanını kullanacak şekilde güncellendi
function loadAudioPreview(audioPath, audioElement, isSecond = false) {
    // Önce mevcut sesi durdur ve sıfırla
    audioElement.pause();
    audioElement.currentTime = 0;
    
    // Yeni ses yolunu ayarla
    audioElement.src = audioPath;
    
    // Ses yüklendikten sonra UI'yı sıfırla
    audioElement.addEventListener('loadedmetadata', () => {
        resetAudioUI(isSecond);
    });
    
    // Hata durumunda konsola bilgi ver
    audioElement.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        console.error('Failed to load audio from:', audioPath);
    });
}

// Ses arayüzünü sıfırla
function resetAudioUI(isSecond = false) {
    const suffix = isSecond ? '2' : '';
    const playButton = document.querySelector(`.play-pause${suffix}`);
    
    audioPlayers[isSecond ? 'isPlaying2' : 'isPlaying'] = false;
    updatePlayPauseIcon(playButton, false);
    document.querySelector(`.audio-progress-bar${suffix}`).style.width = '0%';
    document.querySelector(`.audio-time${suffix}`).textContent = '0:00';
}

// Oynat/Duraklat butonunu güncelle
function updatePlayPauseIcon(button, isPlaying) {
    const icon = button.querySelector('i');
    icon.classList.toggle('fa-play', !isPlaying);
    icon.classList.toggle('fa-pause', isPlaying);
}

// Ses düzeyi butonunu güncelle
function updateMuteIcon(button, isMuted) {
    const icon = button.querySelector('i');
    icon.classList.toggle('fa-volume-up', !isMuted);
    icon.classList.toggle('fa-volume-mute', isMuted);
}

// Modal açma işlevi - Güncellendi: title ve audio path doğru şekilde kullanılıyor
function openPlatformModal(beatName, beatData) {
    // Modal başlığını ayarla (title kullanılıyor)
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

    // Ses önizlemesini yükle - JSON'daki audio yolunu kullan
    const audioPath = beatData['data-audio'];
    if (audioPath) {
        loadAudioPreview(audioPath, audioPlayers.currentAudio);
    } else {
        console.error('Audio path not found for beat:', beatName);
    }

    // Eğer beat "YOU" ise ikinci ses oynatıcıyı göster
    const secondAudioContainer = document.querySelector('.second-audio');
    if (beatName === 'YOU') {
        secondAudioContainer.style.display = 'block';
        // İkinci ses dosyası için özel bir yol (örn: _part2 eklenmiş)
        const secondAudioPath = audioPath.replace('.mp3', '_part2.mp3');
        loadAudioPreview(secondAudioPath, audioPlayers.currentAudio2, true);
    } else {
        secondAudioContainer.style.display = 'none';
        audioPlayers.currentAudio2.pause();
        resetAudioUI(true);
    }

    // Modalı göster
    domElements.platformModal.classList.add('active');
    domElements.platformModal.setAttribute('aria-hidden', 'false');
}

// Modal kapatma işlevi
function closeModal(modalElement) {
    modalElement.classList.remove('active');
    modalElement.setAttribute('aria-hidden', 'true');
    
    // Sesleri durdur
    audioPlayers.currentAudio.pause();
    audioPlayers.currentAudio2.pause();
    resetAudioUI();
    resetAudioUI(true);
}

// Ses ilerlemesini güncelle
function updateAudioProgress(audioElement, isSecond) {
    const suffix = isSecond ? '2' : '';
    if (audioElement.duration) {
        const percent = (audioElement.currentTime / audioElement.duration) * 100;
        document.querySelector(`.audio-progress-bar${suffix}`).style.width = `${percent}%`;

        // Kalan süreyi hesapla
        const remainingTime = audioElement.duration - audioElement.currentTime;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);

        document.querySelector(`.audio-time${suffix}`).textContent = 
            `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Sayfa yüklendikten sonra çalışacak kod
document.addEventListener('DOMContentLoaded', function () {
    const iframe = domElements.appleMusicModal.querySelector('iframe');
    if (iframe) {
        iframe.src = "https://embed.music.apple.com/tr/playlist/bi-bira-bi-soju/pl.u-qxylEYDT3ByJYdV?l=tr";
    }
    // Beat verilerini yükle
    loadBeatsData();
    
    // Profil resmini ayarla ve döngüyü başlat
    setRandomProfilePicture();
    setInterval(nextProfilePicture, 5000);

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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        domElements.themeIcon.classList.replace('fa-moon', 'fa-sun');
        updateSocialIcons('light');
    }

    // Tema değiştirme butonuna event listener ekle
    domElements.themeToggle.addEventListener('click', toggleTheme);

    // Hover animasyonlarını ayarla
    setupHoverAnimation('.link-item', 
        { transform: 'scale(1.03)' }, 
        { transform: 'scale(1)' }
    );
    
    setupHoverAnimation('.social-icon', 
        { transform: 'translateY(-5px) scale(1.1)' }, 
        { transform: 'translateY(0) scale(1)' }
    );

    // Event delegation için container'a click eventi ekle
    document.addEventListener('click', function(e) {
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
            openPlatformModal(beatLink.getAttribute('data-beat'), beatData);
            return;
        }

        // Apple Music linki için
        const appleMusicLink = e.target.closest('.apple-music-link');
        if (appleMusicLink) {
            e.preventDefault();
            const musicUrl = appleMusicLink.getAttribute('data-apple-music-url');
            const iframe = domElements.appleMusicModal.querySelector('iframe');
            const directLink = domElements.appleMusicModal.querySelector('.link-to-apple-music');
            
            iframe.src = `https://embed.music.apple.com/tr/playlist/bi-bira-bi-soju/pl.u-qxylEYDT3ByJYdV?l=tr`;
            directLink.href = musicUrl;
            
            domElements.appleMusicModal.classList.add('active');
            domElements.appleMusicModal.setAttribute('aria-hidden', 'false');
            return;
        }

        // Modal kapatma butonları için
        if (e.target.classList.contains('modal-close') || e.target.parentElement.classList.contains('modal-close')) {
            const modal = e.target.closest('.platform-modal');
            if (modal) {
                closeModal(modal);
            }
            return;
        }

        // Modal dışına tıklama için
        if (e.target.classList.contains('platform-modal')) {
            closeModal(e.target);
        }
    });

    // Ses kontrolü için event delegation
    document.addEventListener('click', function(e) {
        // İlk ses kontrolü
        if (e.target.closest('.play-pause')) {
            const btn = e.target.closest('.play-pause');
            if (audioPlayers.isPlaying) {
                audioPlayers.currentAudio.pause();
            } else {
                // Ses dosyasının yüklü olduğundan emin ol
                if (audioPlayers.currentAudio.src) {
                    audioPlayers.currentAudio.play().catch(error => {
                        console.error('Audio play error:', error);
                    });
                }
            }
            audioPlayers.isPlaying = !audioPlayers.isPlaying;
            updatePlayPauseIcon(btn, audioPlayers.isPlaying);
            return;
        }

        // İkinci ses kontrolü
        if (e.target.closest('.play-pause2')) {
            const btn = e.target.closest('.play-pause2');
            if (audioPlayers.isPlaying2) {
                audioPlayers.currentAudio2.pause();
            } else {
                // Ses dosyasının yüklü olduğundan emin ol
                if (audioPlayers.currentAudio2.src) {
                    audioPlayers.currentAudio2.play().catch(error => {
                        console.error('Audio play error:', error);
                    });
                }
            }
            audioPlayers.isPlaying2 = !audioPlayers.isPlaying2;
            updatePlayPauseIcon(btn, audioPlayers.isPlaying2);
            return;
        }

        // Ses seviyesi kontrolü
        if (e.target.closest('.mute')) {
            const btn = e.target.closest('.mute');
            audioPlayers.currentAudio.muted = !audioPlayers.currentAudio.muted;
            updateMuteIcon(btn, audioPlayers.currentAudio.muted);
            return;
        }

        if (e.target.closest('.mute2')) {
            const btn = e.target.closest('.mute2');
            audioPlayers.currentAudio2.muted = !audioPlayers.currentAudio2.muted;
            updateMuteIcon(btn, audioPlayers.currentAudio2.muted);
            return;
        }

        // İlerleme çubuğu tıklama
        const progressBar = e.target.closest('.audio-progress');
        if (progressBar) {
            const width = progressBar.clientWidth;
            const clickX = e.offsetX;
            const isSecond = progressBar.parentElement.parentElement.classList.contains('second-audio');
            const audio = isSecond ? audioPlayers.currentAudio2 : audioPlayers.currentAudio;
            
            if (audio.duration) {
                audio.currentTime = (clickX / width) * audio.duration;
            }
            return;
        }
    });

    // Ses ilerleme güncellemeleri
    audioPlayers.currentAudio.addEventListener('timeupdate', function() {
        updateAudioProgress(this, false);
    });

    audioPlayers.currentAudio2.addEventListener('timeupdate', function() {
        updateAudioProgress(this, true);
    });

    // Ses bitiş olayları
    audioPlayers.currentAudio.addEventListener('ended', function() {
        audioPlayers.isPlaying = false;
        updatePlayPauseIcon(document.querySelector('.play-pause'), false);
        document.querySelector('.audio-progress-bar').style.width = '0%';
        document.querySelector('.audio-time').textContent = '0:00';
    });

    audioPlayers.currentAudio2.addEventListener('ended', function() {
        audioPlayers.isPlaying2 = false;
        updatePlayPauseIcon(document.querySelector('.play-pause2'), false);
        document.querySelector('.audio-progress-bar2').style.width = '0%';
        document.querySelector('.audio-time2').textContent = '0:00';
    });
});

// Sayfa yüklendiğinde hoşgeldin ekranını kaldır
window.addEventListener('load', function () {
    setTimeout(function () {
        domElements.welcomeScreen.style.opacity = '0';
        domElements.mainContent.classList.add('show');

        setTimeout(function () {
            domElements.welcomeScreen.style.display = 'none';
        }, 1000);
    }, 100);
});


