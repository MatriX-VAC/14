// Инициализация AOS (анимация при скролле)
AOS.init({
    duration: 800,
    once: true,
});

// Падающие сердечки
const heartContainer = document.getElementById('heart-container');
if (heartContainer) {
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = Math.random() * 3 + 3 + 's';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        heartContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
    setInterval(createHeart, 400);
}

// Видео в галерее: воспроизведение при наведении
const videos = document.querySelectorAll('.gallery-item video');
videos.forEach(video => {
    video.addEventListener('mouseenter', () => video.play());
    video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// ===== ПОЧТА ДРУЖБЫ =====
const mailItems = document.querySelectorAll('.mail-item');
const mailMessage = document.getElementById('mailMessage');

mailItems.forEach(item => {
    item.addEventListener('click', () => {
        const message = item.getAttribute('data-message');
        if (mailMessage) {
            mailMessage.textContent = message;
            mailMessage.style.opacity = '0';
            setTimeout(() => mailMessage.style.opacity = '1', 10);
        }
    });
});

// ===== ГЕНЕРАТОР ВОСПОМИНАНИЙ =====
const memoryBtn = document.getElementById('memoryBtn');
const memoryCard = document.getElementById('memoryCard');

const memories = [
    "Как мы первый раз встретились в Аэро Парке, и не смогли пойти на фильм.",
    "Тот случай, когда в RAVE смотрели фильм, зато потом делали презентацию до утра.",
    "Наши бесконечные походы в Fix Price — каждый раз находим новую ерунду.",
    "Ночные созвоны в Telegram до 3 утра, когда батарейка садилась, но мы не хотели ложиться спать.",
    "Как я уговорил посмотреть тот странный фильм, и в итоге нам понравилось.",
];

if (memoryBtn && memoryCard) {
    memoryBtn.addEventListener('click', () => {
        const random = Math.floor(Math.random() * memories.length);
        memoryCard.textContent = memories[random];
    });
}

// ===== КНОПКА-СЮРПРИЗ =====
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseMsg = document.getElementById('surprise-message');

const powers = [
    "Твой уровень «Улыбателя 3000» сегодня зашкаливает! 😄",
    "Активирована суперсила «Поддержатор» — ты лучшая!",
    "Мем-детектор обнаружил, что ты сейчас улыбаешься :)",
    "Фото-магнит притянул удачу — день будет классным!",
    "Саундтрек-мейкер создаёт идеальное настроение 🎶",
    "Дружбометр показывает 100% — ты невероятная подруга!"
];

if (surpriseBtn && surpriseMsg) {
    surpriseBtn.addEventListener('click', () => {
        const random = Math.floor(Math.random() * powers.length);
        surpriseMsg.textContent = powers[random];
        surpriseMsg.classList.add('show');
    });
}

// ===== ПЛЕЕР =====
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = playPauseBtn.querySelector('i');
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const playlistItems = document.querySelectorAll('.playlist-item');
const currentTrackSpan = document.getElementById('current-track');

let currentlyPlaying = null;

// Форматирование времени
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Обновление цвета прогресс-бара (для Chrome)
function updateProgressBarColor() {
    const value = progressBar.value;
    progressBar.style.background = `linear-gradient(90deg, var(--accent-pink) ${value}%, rgba(255,255,255,0.2) ${value}%)`;
}

// Обновление прогресс-бара и времени
audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    const duration = audio.duration;
    if (duration) {
        const percent = (current / duration) * 100;
        progressBar.value = percent;
        updateProgressBarColor();
    }
    currentTimeSpan.textContent = formatTime(current);
});

audio.addEventListener('loadedmetadata', () => {
    durationSpan.textContent = formatTime(audio.duration);
    progressBar.value = 0;
    updateProgressBarColor();
});

audio.addEventListener('play', () => {
    playIcon.className = 'fas fa-pause';
});

audio.addEventListener('pause', () => {
    playIcon.className = 'fas fa-play';
});

audio.addEventListener('ended', () => {
    playIcon.className = 'fas fa-play';
    progressBar.value = 0;
    updateProgressBarColor();
    currentTimeSpan.textContent = '0:00';
    if (currentlyPlaying) {
        currentlyPlaying.classList.remove('playing');
        currentlyPlaying = null;
        currentTrackSpan.textContent = '—';
    }
});

// Обработка ошибок загрузки аудио
audio.addEventListener('error', (e) => {
    console.error('Ошибка загрузки аудио:', e);
    alert('Не удалось загрузить трек. Проверь путь к файлу.');
});

// Перемотка
progressBar.addEventListener('input', (e) => {
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (e.target.value / 100) * duration;
    }
    updateProgressBarColor();
});

// Громкость
volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    if (vol === 0) {
        volumeIcon.className = 'fas fa-volume-off';
    } else if (vol < 0.5) {
        volumeIcon.className = 'fas fa-volume-low';
    } else {
        volumeIcon.className = 'fas fa-volume-high';
    }
});

// Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        if (audio.src) {
            audio.play().catch(e => console.log('Ошибка воспроизведения', e));
        } else {
            // Если ничего не выбрано, попробуем выбрать первый трек
            if (playlistItems.length > 0) {
                playlistItems[0].click();
            }
        }
    } else {
        audio.pause();
    }
});

// Клик по треку в плейлисте
playlistItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation();
        const src = this.getAttribute('data-src');
        const title = this.getAttribute('data-title') || this.innerText.trim();

        // Если кликнули на уже играющий трек
        if (currentlyPlaying === this && !audio.paused) {
            audio.pause();
            this.classList.remove('playing');
            currentlyPlaying = null;
            currentTrackSpan.textContent = '—';
            return;
        }

        // Останавливаем предыдущий трек и снимаем выделение
        if (currentlyPlaying) {
            currentlyPlaying.classList.remove('playing');
        }

        // Устанавливаем новый источник и пробуем воспроизвести
        audio.src = src;
        audio.load();
        audio.play()
            .then(() => {
                this.classList.add('playing');
                currentlyPlaying = this;
                currentTrackSpan.textContent = title;
            })
            .catch(err => {
                console.error('Ошибка при воспроизведении:', err);
                alert('Не удалось воспроизвести трек. Проверь путь к файлу или формат.');
                this.classList.remove('playing');
                currentlyPlaying = null;
                currentTrackSpan.textContent = '—';
            });
    });
});

// Инициализация цвета прогресс-бара
updateProgressBarColor();
