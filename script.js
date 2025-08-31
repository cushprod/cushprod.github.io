// App modülü - tüm fonksiyonları kapsar
const App = (() => {
    // DOM elementleri
    const DOM = {
        profilePicture: document.getElementById('profile-picture'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('#theme-toggle i'),
        welcomeScreen: document.getElementById('welcome-screen'),
        mainContent: document.getElementById('main-content'),
        linkGroupsContainer: document.querySelector('.link-groups-container'),
        platformModal: document.getElementById('platform-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalClose: document.querySelector('.modal-close'),
        appleMusicModal: document.getElementById('apple-music-modal'),
        appleMusicModalClose: document.querySelector('#apple-music-modal .modal-close'),
        appleMusicLink: document.querySelector('.apple-music-link')
    };

    // Uygulama durumu
    const state = {
        currentProfileIndex: 1,
        totalProfilePictures: 3,
        currentAudio: new Audio(),
        currentAudio2: new Audio(),
        isPlaying: false,
        isPlaying2: false,
        currentBeatName: '',
        theme: localStorage.getItem('theme') || 'dark'
    };

    // Yardımcı fonksiyonlar
    const helpers = {
        // CSS sınıfı ekle/kaldır
        toggleClass: (element, className) => {
            element.classList.toggle(className);
        },

        // Element göster/gizle
        toggleElement: (element, show) => {
            element.style.display = show ? 'block' : 'none';
        },

        // LocalStorage'dan veri al
        getFromStorage: (key) => {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (error) {
                console.error('Storage okuma hatası:', error);
                return null;
            }
        },

        // LocalStorage'a veri kaydet
        saveToStorage: (key, data) => {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error('Storage yazma hatası:', error);
            }
        }
    };

    // Profil resmi işlemleri
    const profilePicture = {
        // Rastgele profil resmi ayarla
        setRandom: () => {
            const randomIndex = Math.floor(Math.random() * state.totalProfilePictures) + 1;
            const imgPath = randomIndex === 1 ?
                'img/profile-picture.webp' :
                `img/profile-picture${randomIndex}.webp`;

            profilePicture.fadeChange(imgPath);
            state.currentProfileIndex = randomIndex;
            profilePicture.preloadNext(randomIndex);
        },

        // Sonraki profil resmi
        next: () => {
            let nextIndex = state.currentProfileIndex % state.totalProfilePictures + 1;
            const imgPath = nextIndex === 1 ?
                'img/profile-picture.webp' :
                `img/profile-picture${nextIndex}.webp`;

            profilePicture.fadeChange(imgPath);
            state.currentProfileIndex = nextIndex;
            profilePicture.preloadNext(nextIndex);
        },

        // Fade efekti ile profil resmi değiştir
        fadeChange: (newImagePath) => {
            const profileImg = DOM.profilePicture;
            const profileContainer = document.querySelector('.profile-image');

            if (!profileImg) return;

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

            profileContainer.style.position = "relative";
            profileContainer.appendChild(newImg);

            setTimeout(() => {
                newImg.style.opacity = "1";
            }, 50);

            profileImg.style.transition = "opacity 0.8s ease";
            profileImg.style.opacity = "0";

            setTimeout(() => {
                if (profileImg.parentNode === profileContainer) {
                    profileContainer.removeChild(profileImg);
                }
                newImg.style.position = "";
            }, 800);
        },

        // Sonraki resmi önceden yükle
        preloadNext: (currentIndex) => {
            const totalPictures = state.totalProfilePictures;
            let nextIndex = currentIndex % totalPictures + 1;
            const nextImgPath = nextIndex === 1 ?
                'img/profile-picture.webp' :
                `img/profile-picture${nextIndex}.webp`;

            const img = new Image();
            img.src = nextImgPath;
        }
    };

    // Tema işlemleri
    const themeManager = {
        // Temayı başlat
        init: () => {
            if (state.theme === 'light') {
                themeManager.setLightTheme();
            } else {
                themeManager.setDarkTheme();
            }
        },

        // Açık tema ayarla
        setLightTheme: () => {
            document.body.classList.add('light-theme');
            DOM.themeIcon.classList.replace('fa-moon', 'fa-sun');
            
            const socialIcons = {
                youtube: "icons/youtube2.webp",
                soundcloud: "icons/soundcloud2.webp",
                instagram: "icons/instagram2.webp",
                tiktok: "icons/tiktok2.webp",
                email: "icons/mail2.webp"
            };
            
            Object.keys(socialIcons).forEach(platform => {
                const img = document.querySelector(`.${platform} img`);
                if (img) img.src = socialIcons[platform];
            });
            
            localStorage.setItem('theme', 'light');
            state.theme = 'light';
        },

        // Koyu tema ayarla
        setDarkTheme: () => {
            document.body.classList.remove('light-theme');
            DOM.themeIcon.classList.replace('fa-sun', 'fa-moon');
            
            const socialIcons = {
                youtube: "icons/youtube.webp",
                soundcloud: "icons/soundcloud.webp",
                instagram: "icons/instagram.webp",
                tiktok: "icons/tiktok.webp",
                email: "icons/mail.webp"
            };
            
            Object.keys(socialIcons).forEach(platform => {
                const img = document.querySelector(`.${platform} img`);
                if (img) img.src = socialIcons[platform];
            });
            
            localStorage.setItem('theme', 'dark');
            state.theme = 'dark';
        },

        // Temayı değiştir
        toggle: () => {
            if (state.theme === 'dark') {
                themeManager.setLightTheme();
            } else {
                themeManager.setDarkTheme();
            }
        }
    };

    // Modal işlemleri
    const modalManager = {
        // Platform modalını aç
        openPlatformModal: (beatData) => {
            state.currentBeatName = beatData.name;
            DOM.modalTitle.textContent = beatData.name;

            // Platform linklerini ayarla
            document.querySelector('[data-platform="youtube"]').href = beatData.youtube;
            document.querySelector('[data-platform="beatstars"]').href = beatData.beatstars;
            document.querySelector('[data-platform="airbit"]').href = beatData.airbit;
            document.querySelector('[data-platform="traktrain"]').href = beatData.traktrain;

            // Ses önizlemesini yükle
            audioPlayer.loadAudioPreview(beatData.name);

            // İkinci ses oynatıcıyı kontrol et
            const secondAudioContainer = document.querySelector('.second-audio');
            if (beatData.name === 'YOU') {
                helpers.toggleElement(secondAudioContainer, true);
                audioPlayer.loadSecondAudioPreview(beatData.name);
            } else {
                helpers.toggleElement(secondAudioContainer, false);
                state.currentAudio2.pause();
                audioPlayer.resetAudioUI2();
            }

            DOM.platformModal.classList.add('active');
        },

        // Platform modalını kapat
        closePlatformModal: () => {
            DOM.platformModal.classList.remove('active');
            state.currentAudio.pause();
            state.currentAudio2.pause();
            audioPlayer.resetAudioUI();
            audioPlayer.resetAudioUI2();
        },

        // Apple Music modalını aç
        openAppleMusicModal: () => {
            DOM.appleMusicModal.classList.add('active');
        },

        // Apple Music modalını kapat
        closeAppleMusicModal: () => {
            DOM.appleMusicModal.classList.remove('active');
        }
    };

    // Ses oynatıcı işlemleri
    const audioPlayer = {
        // Ses önizlemesini yükle
        loadAudioPreview: (beatName) => {
            state.currentAudio.pause();
            state.currentAudio = new Audio(`sounds/${beatName}.mp3`);

            state.currentAudio.addEventListener('loadedmetadata', () => {
                audioPlayer.resetAudioUI();
            });

            state.currentAudio.addEventListener('timeupdate', () => {
                if (state.currentAudio.duration) {
                    const percent = (state.currentAudio.currentTime / state.currentAudio.duration) * 100;
                    document.querySelector('.audio-progress-bar').style.width = `${percent}%`;

                    const remainingTime = state.currentAudio.duration - state.currentAudio.currentTime;
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = Math.floor(remainingTime % 60);

                    document.querySelector('.audio-time').textContent = 
                        `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }
            });

            state.currentAudio.addEventListener('ended', () => {
                state.isPlaying = false;
                audioPlayer.updatePlayPauseIcon(document.querySelector('.play-pause'), state.isPlaying);
                document.querySelector('.audio-progress-bar').style.width = '0%';
                document.querySelector('.audio-time').textContent = '0:00';
            });
        },

        // İkinci ses önizlemesini yükle
        loadSecondAudioPreview: (beatName) => {
            state.currentAudio2.pause();
            state.currentAudio2 = new Audio(`sounds/${beatName}_part2.mp3`);

            state.currentAudio2.addEventListener('loadedmetadata', () => {
                audioPlayer.resetAudioUI2();
            });

            state.currentAudio2.addEventListener('timeupdate', () => {
                if (state.currentAudio2.duration) {
                    const percent = (state.currentAudio2.currentTime / state.currentAudio2.duration) * 100;
                    document.querySelector('.audio-progress-bar2').style.width = `${percent}%`;

                    const remainingTime = state.currentAudio2.duration - state.currentAudio2.currentTime;
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = Math.floor(remainingTime % 60);

                    document.querySelector('.audio-time2').textContent = 
                        `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }
            });

            state.currentAudio2.addEventListener('ended', () => {
                state.isPlaying2 = false;
                audioPlayer.updatePlayPauseIcon(document.querySelector('.play-pause2'), state.isPlaying2);
                document.querySelector('.audio-progress-bar2').style.width = '0%';
                document.querySelector('.audio-time2').textContent = '0:00';
            });
        },

        // Ses arayüzünü sıfırla
        resetAudioUI: () => {
            state.isPlaying = false;
            audioPlayer.updatePlayPauseIcon(document.querySelector('.play-pause'), state.isPlaying);
            document.querySelector('.audio-progress-bar').style.width = '0%';
            document.querySelector('.audio-time').textContent = '0:00';
        },

        // İkinci ses arayüzünü sıfırla
        resetAudioUI2: () => {
            state.isPlaying2 = false;
            audioPlayer.updatePlayPauseIcon(document.querySelector('.play-pause2'), state.isPlaying2);
            document.querySelector('.audio-progress-bar2').style.width = '0%';
            document.querySelector('.audio-time2').textContent = '0:00';
        },

        // Oynat/Duraklat ikonunu güncelle
        updatePlayPauseIcon: (button, isPlaying) => {
            const icon = button.querySelector('i');
            icon.classList.toggle('fa-play', !isPlaying);
            icon.classList.toggle('fa-pause', isPlaying);
        },

        // Ses düzeyi ikonunu güncelle
        updateMuteIcon: (button, isMuted) => {
            const icon = button.querySelector('i');
            icon.classList.toggle('fa-volume-up', !isMuted);
            icon.classList.toggle('fa-volume-mute', isMuted);
        }
    };

    // Beat listesi işlemleri
    const beatManager = {
        // Beat listesini yükle
        loadBeats: async () => {
            try {
                const response = await fetch('beats.json');
                const beatsData = await response.json();
                beatManager.renderBeats(beatsData);
            } catch (error) {
                console.error('Beat listesi yüklenirken hata oluştu:', error);
            }
        },

        // Beat listesini render et
        renderBeats: (beatsData) => {
            let html = '';

            // New Drop bölümü
            html += `
                <div class="link-group">
                    <div class="group-title">NEW DROP 🔥</div>
                    ${beatManager.createBeatLink(beatsData.newDrop)}
                </div>
                <div class="group-divider"></div>
            `;

            // Marketler bölümü
            html += `
                <div class="link-group">
                    <div class="group-title">Purchase My Beats</div>
                    ${beatsData.markets.map(market => `
                        <a href="${market.url}" target="_blank" class="link-item">
                            <div class="link-icon">
                                <img src="${market.icon}" alt="${market.name}">
                            </div>
                            <div class="link-text">${market.name}</div>
                            <div class="link-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </a>
                    `).join('')}
                </div>
                <div class="group-divider"></div>
            `;

            // Diğer beatler bölümü
            html += `
                <div class="link-group">
                    ${beatsData.beats.map(beat => beatManager.createBeatLink(beat)).join('')}
                </div>
                <div class="group-divider"></div>
            `;

            // Apple Music bölümü
            html += `
                <div class="link-group">
                    <a class="link-item apple-music-link" data-apple-music-url="${beatsData.appleMusic.url}">
                        <div class="link-icon">
                            <img src="${beatsData.appleMusic.icon}" alt="Apple Music">
                        </div>
                        <div class="link-text">${beatsData.appleMusic.text}</div>
                        <div class="link-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </a>
                </div>
            `;

            DOM.linkGroupsContainer.innerHTML = html;
            
            // Beat linklerine tıklama olaylarını ekle
            document.querySelectorAll('.link-item[data-beat]').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const beatName = item.getAttribute('data-beat');
                    const beatData = beatsData.beats.find(b => b.name === beatName) || beatsData.newDrop;
                    modalManager.openPlatformModal(beatData);
                });
            });

            // Apple Music linkine tıklama olayını ekle
            document.querySelector('.apple-music-link').addEventListener('click', (e) => {
                e.preventDefault();
                modalManager.openAppleMusicModal();
            });
        },

        // Beat linki oluştur
        createBeatLink: (beat) => {
            return `
                <a class="link-item" data-beat="${beat.name}">
                    <div class="link-icon">
                        <img src="${beat.image}" alt="${beat.name}">
                    </div>
                    <div class="link-text">${beat.description}</div>
                    <div class="link-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
            `;
        }
    };

    // Olay dinleyicileri
    const eventListeners = {
        // Tema değiştirme butonu
        setupThemeToggle: () => {
            DOM.themeToggle.addEventListener('click', themeManager.toggle);
        },

        // Modal kapatma butonları
        setupModalClose: () => {
            DOM.modalClose.addEventListener('click', modalManager.closePlatformModal);
            DOM.appleMusicModalClose.addEventListener('click', modalManager.closeAppleMusicModal);

            // Modal dışına tıklama
            DOM.platformModal.addEventListener('click', (e) => {
                if (e.target === DOM.platformModal) modalManager.closePlatformModal();
            });

            DOM.appleMusicModal.addEventListener('click', (e) => {
                if (e.target === DOM.appleMusicModal) modalManager.closeAppleMusicModal();
            });
        },

        // Ses oynatıcı kontrolleri
        setupAudioControls: () => {
            // İlk oynatıcı
            document.querySelector('.play-pause')?.addEventListener('click', () => {
                if (state.isPlaying) {
                    state.currentAudio.pause();
                } else {
                    state.currentAudio.play();
                }
                state.isPlaying = !state.isPlaying;
                audioPlayer.updatePlayPauseIcon(document.querySelector('.play-pause'), state.isPlaying);
            });

            document.querySelector('.mute')?.addEventListener('click', () => {
                state.currentAudio.muted = !state.currentAudio.muted;
                audioPlayer.updateMuteIcon(document.querySelector('.mute'), state.currentAudio.muted);
            });

            document.querySelector('.audio-progress')?.addEventListener('click', (e) => {
                const width = e.currentTarget.clientWidth;
                const clickX = e.offsetX;
                const duration = state.currentAudio.duration;
                state.currentAudio.currentTime = (clickX / width) * duration;
            });

            // İkinci oynatıcı
            document.querySelector('.play-pause2')?.addEventListener('click', () => {
                if (state.isPlaying2) {
                    state.currentAudio2.pause();
                } else {
                    state.currentAudio2.play();
                }
                state.isPlaying2 = !state.isPlaying2;
                audioPlayer.updatePlayPauseIcon(document.querySelector('.play-pause2'), state.isPlaying2);
            });

            document.querySelector('.mute2')?.addEventListener('click', () => {
                state.currentAudio2.muted = !state.currentAudio2.muted;
                audioPlayer.updateMuteIcon(document.querySelector('.mute2'), state.currentAudio2.muted);
            });

            document.querySelectorAll('.audio-progress')[1]?.addEventListener('click', (e) => {
                const width = e.currentTarget.clientWidth;
                const clickX = e.offsetX;
                const duration = state.currentAudio2.duration;
                state.currentAudio2.currentTime = (clickX / width) * duration;
            });
        },

        // Hover efektleri
        setupHoverEffects: () => {
            // Link item hover
            document.querySelectorAll('.link-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'scale(1.03)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'scale(1)';
                });
            });

            // Sosyal ikon hover
            document.querySelectorAll('.social-icon').forEach(icon => {
                icon.addEventListener('mouseenter', () => {
                    icon.style.transform = 'translateY(-5px) scale(1.1)';
                });
                icon.addEventListener('mouseleave', () => {
                    icon.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    };

    // Uygulamayı başlat
    const init = () => {
        // Hoş geldin ekranını kaldır
        setTimeout(() => {
            DOM.welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                DOM.welcomeScreen.style.display = 'none';
            }, 1000);
        }, 100);

        // Profil resmini ayarla ve döngüyü başlat
        profilePicture.setRandom();
        setInterval(profilePicture.next, 5000);

        // Temayı ayarla
        themeManager.init();

        // Beat listesini yükle
        beatManager.loadBeats();

        // Olay dinleyicilerini kur
        eventListeners.setupThemeToggle();
        eventListeners.setupModalClose();
        eventListeners.setupHoverEffects();

        // Sayfa yüklendikten sonra ses kontrollerini kur
        window.addEventListener('load', eventListeners.setupAudioControls);
    };

    // Dışa aktarılacak metodlar
    return {
        init
    };
})();

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', App.init);
