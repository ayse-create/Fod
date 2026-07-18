document.addEventListener("DOMContentLoaded", () => {

    // ----- SAHNE YÖNETİMİ -----
    const scenes = {
        sokak: document.getElementById('scene-sokak'),
        orman: document.getElementById('scene-orman'),
        araba: document.getElementById('scene-araba'),
        yeralti: document.getElementById('scene-yeralti'),
        uzay: document.getElementById('scene-uzay'),
        uzayli: document.getElementById('scene-uzayli'),
        retro: document.getElementById('scene-retro'),
        lab: document.getElementById('scene-lab')
    };

    let currentScene = 'sokak';

    function switchScene(sceneId) {
        Object.keys(scenes).forEach(key => {
            scenes[key].classList.remove('active');
        });
        scenes[sceneId].classList.add('active');
        currentScene = sceneId;
    }

    // ----- SAHNE 1: SOKAK (3 ŞERİT) -----
    let laneIndex = 1; // 0-left, 1-center, 2-right
    const catSokak = document.getElementById('cat-sokak');
    const scoreSokak = document.getElementById('score-sokak');
    let sokakScore = 0;
    let gameRunning = true;

    function updateLane() {
        const lanePositions = ['15%', '50%', '85%'];
        catSokak.style.left = lanePositions[laneIndex];
    }

    function moveLane(direction) {
        if (!gameRunning) return;
        const newIndex = laneIndex + direction;
        if (newIndex >= 0 && newIndex <= 2) {
            laneIndex = newIndex;
            updateLane();
        }
    }

    function jumpSokak() {
        if (!gameRunning) return;
        catSokak.style.transform = 'translateX(-50%) scale(1.2)';
        setTimeout(() => {
            catSokak.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
        sokakScore++;
        scoreSokak.textContent = '🏆 ' + sokakScore;
        if (sokakScore % 5 === 0) {
            // Sonbahar/Kış geçişi
            const bg = document.getElementById('scene-sokak');
            if (sokakScore % 10 === 0) {
                bg.style.background = '#4a7a9a'; // Kış
            } else {
                bg.style.background = '#d4a373'; // Sonbahar
            }
        }
        if (sokakScore === 15) {
            gameRunning = false;
            setTimeout(() => switchScene('orman'), 500);
        }
    }

    // Klavye kontrolleri (Sokak)
    document.addEventListener('keydown', (e) => {
        if (currentScene === 'sokak') {
            switch (e.key) {
                case 'ArrowLeft':
                    moveLane(-1);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    moveLane(1);
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                case ' ':
                    jumpSokak();
                    e.preventDefault();
                    break;
            }
        }
    });

    // Dokunmatik kontroller (Sokak)
    let touchStartX = 0,
        touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        if (currentScene === 'sokak') {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (currentScene === 'sokak') {
            const diffX = e.touches[0].clientX - touchStartX;
            const diffY = e.touches[0].clientY - touchStartY;
            if (Math.abs(diffX) > 30) {
                if (diffX > 0) moveLane(1);
                else moveLane(-1);
                touchStartX = e.touches[0].clientX;
            }
            if (Math.abs(diffY) > 30 && diffY < 0) {
                jumpSokak();
                touchStartY = e.touches[0].clientY;
            }
            e.preventDefault();
        }
    }, { passive: false });

    // ----- SAHNE 2: ORMAN -----
    const btnOrman = document.getElementById('btn-orman');
    btnOrman.addEventListener('click', () => {
        switchScene('araba');
    });

    // ----- SAHNE 3: ARABA (ÜSTTEN) -----
    const car = document.getElementById('car');
    const hole = document.getElementById('hole');
    let carX = 50,
        carY = 70;
    let carAngle = 0;
    let carSpeed = 0;
    const maxSpeed = 5;
    let carGameRunning = true;

    function updateCar() {
        if (!carGameRunning) return;
        carX += Math.sin(carAngle) * carSpeed * 0.2;
        carY -= Math.cos(carAngle) * carSpeed * 0.2;
        carX = Math.max(5, Math.min(95, carX));
        carY = Math.max(5, Math.min(95, carY));
        car.style.left = carX + '%';
        car.style.top = carY + '%';
        car.style.transform = `rotate(${carAngle * 180 / Math.PI}deg)`;

        // Deliğe ulaşma kontrolü
        const carRect = car.getBoundingClientRect();
        const holeRect = hole.getBoundingClientRect();
        if (carRect.left < holeRect.left + holeRect.width &&
            carRect.left + carRect.width > holeRect.left &&
            carRect.top < holeRect.top + holeRect.height &&
            carRect.top + carRect.height > holeRect.top) {
            carGameRunning = false;
            setTimeout(() => switchScene('yeralti'), 500);
        }
    }

    // Araba kontrolleri
    document.addEventListener('keydown', (e) => {
        if (currentScene === 'araba') {
            switch (e.key) {
                case 'ArrowUp':
                    carSpeed = Math.min(maxSpeed, carSpeed + 0.2);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    carSpeed = Math.max(-maxSpeed / 2, carSpeed - 0.2);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    carAngle -= 0.05;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    carAngle += 0.05;
                    e.preventDefault();
                    break;
            }
        }
    });

    // Araba dokunmatik
    let carTouchStartX = 0,
        carTouchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        if (currentScene === 'araba') {
            carTouchStartX = e.touches[0].clientX;
            carTouchStartY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (currentScene === 'araba') {
            const diffX = e.touches[0].clientX - carTouchStartX;
            const diffY = e.touches[0].clientY - carTouchStartY;
            if (Math.abs(diffX) > 20) {
                carAngle += diffX * 0.01;
                carTouchStartX = e.touches[0].clientX;
            }
            if (Math.abs(diffY) > 20) {
                carSpeed = Math.min(maxSpeed, Math.max(-maxSpeed / 2, carSpeed + diffY * 0.01));
                carTouchStartY = e.touches[0].clientY;
            }
            e.preventDefault();
        }
    }, { passive: false });

    // ----- SAHNE 4: YERALTI (KÖSTEBEK) -----
    let molesHit = 0;
    const moleContainer = document.getElementById('moles-container');
    const moleScore = document.getElementById('mole-score');
    let moleInterval = null;

    function startMoles() {
        moleContainer.innerHTML = '';
        molesHit = 0;
        moleScore.textContent = '🔨 0 / 8';
        for (let i = 0; i < 8; i++) {
            const mole = document.createElement('div');
            mole.className = 'mole';
            mole.dataset.index = i;
            mole.addEventListener('click', () => hitMole(mole));
            moleContainer.appendChild(mole);
        }
        moleInterval = setInterval(() => {
            const allMoles = document.querySelectorAll('.mole');
            allMoles.forEach(m => m.classList.remove('active'));
            const randomIndex = Math.floor(Math.random() * allMoles.length);
            allMoles[randomIndex].classList.add('active');
        }, 800);
    }

    function hitMole(mole) {
        if (!mole.classList.contains('active')) return;
        mole.classList.remove('active');
        molesHit++;
        moleScore.textContent = '🔨 ' + molesHit + ' / 8';
        if (molesHit === 8) {
            clearInterval(moleInterval);
            setTimeout(() => switchScene('uzay'), 500);
        }
    }

    // ----- SAHNE 5: UZAY (METEOR) -----
    let meteorScore = 0;
    const ship = document.getElementById('ship');
    const spaceScore = document.getElementById('space-score');
    let shipY = 50;
    let meteorInterval = null;

    function startSpace() {
        shipY = 50;
        ship.style.top = shipY + '%';
        ship.style.left = '20%';
        meteorScore = 0;
        spaceScore.textContent = '💫 0';
        if (meteorInterval) clearInterval(meteorInterval);
        meteorInterval = setInterval(spawnMeteor, 1200);
    }

    function spawnMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'obstacle';
        meteor.textContent = '☄️';
        meteor.style.position = 'absolute';
        meteor.style.right = '-60px';
        meteor.style.top = Math.random() * 80 + 10 + '%';
        meteor.style.fontSize = '40px';
        meteor.style.zIndex = '5';
        meteor.style.animation = 'slide 2s linear forwards';
        document.getElementById('scene-uzay').appendChild(meteor);
        setTimeout(() => {
            if (meteor.parentNode) meteor.remove();
        }, 2500);
    }

    // Uzay kontrolleri
    document.addEventListener('keydown', (e) => {
        if (currentScene === 'uzay') {
            if (e.key === 'ArrowUp') { shipY = Math.max(5, shipY - 5);
                ship.style.top = shipY + '%';
                e.preventDefault(); }
            if (e.key === 'ArrowDown') { shipY = Math.min(90, shipY + 5);
                ship.style.top = shipY + '%';
                e.preventDefault(); }
        }
    });

    // Uzay dokunmatik
    let shipTouchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        if (currentScene === 'uzay') {
            shipTouchStartY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (currentScene === 'uzay') {
            const diffY = e.touches[0].clientY - shipTouchStartY;
            if (Math.abs(diffY) > 10) {
                shipY = Math.max(5, Math.min(90, shipY + diffY * 0.2));
                ship.style.top = shipY + '%';
                shipTouchStartY = e.touches[0].clientY;
            }
            e.preventDefault();
        }
    }, { passive: false });

    // ----- SAHNE 6: UZAYLI SAVAŞI -----
    let alienCount = 0;
    const alienContainer = document.getElementById('aliens-container');
    const alienScoreEl = document.getElementById('alien-score');

    function startAliens() {
        alienContainer.innerHTML = '';
        alienCount = 0;
        alienScoreEl.textContent = '👾 0';
        for (let i = 0; i < 10; i++) {
            const alien = document.createElement('div');
            alien.className = 'alien';
            alien.textContent = '👾';
            alien.style.left = Math.random() * 80 + 10 + '%';
            alien.style.top = Math.random() * 80 + 10 + '%';
            alien.style.animationDelay = (Math.random() * 2) + 's';
            alien.addEventListener('click', () => {
                alien.remove();
                alienCount++;
                alienScoreEl.textContent = '👾 ' + alienCount;
                if (alienCount === 10) {
                    setTimeout(() => switchScene('retro'), 500);
                }
            });
            alienContainer.appendChild(alien);
        }
    }

    // Uzaylı savaşı dokunmatik
    document.addEventListener('touchstart', (e) => {
        if (currentScene === 'uzayli') {
            const touch = e.touches[0];
            const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
            elements.forEach(el => {
                if (el.classList.contains('alien')) {
                    el.click();
                }
            });
        }
    });

    // ----- SAHNE 7: RETRO PİXEL -----
    let retroCatPos = 50;
    const retroCat = document.getElementById('retro-cat');
    let retroGameRunning = true;

    document.addEventListener('keydown', (e) => {
        if (currentScene === 'retro') {
            if (e.key === 'ArrowLeft') { retroCatPos = Math.max(10, retroCatPos - 10);
                retroCat.style.left = retroCatPos + 'px';
                e.preventDefault(); }
            if (e.key === 'ArrowRight') { retroCatPos = Math.min(90, retroCatPos + 10);
                retroCat.style.left = retroCatPos + 'px';
                e.preventDefault(); }
            if (e.key === 'ArrowUp') {
                retroCat.style.transform = 'scale(1.2)';
                setTimeout(() => retroCat.style.transform = 'scale(1)', 200);
                e.preventDefault();
            }
        }
    });

    // ----- SAHNE GEÇİŞLERİ -----
    // Sahne değişimlerinde özel başlangıç fonksiyonları
    const originalSwitch = switchScene;
    switchScene = function(sceneId) {
        originalSwitch(sceneId);
        if (sceneId === 'yeralti') startMoles();
        if (sceneId === 'uzay') startSpace();
        if (sceneId === 'uzayli') startAliens();
        if (sceneId === 'lab') {
            setTimeout(() => {
                const labText = document.getElementById('lab-text');
                labText.textContent = '🧪 TO BE CONTINUED...';
                labText.style.animation = 'flicker 0.1s infinite alternate';
            }, 100);
        }
    };

    // ----- OYUN DÖNGÜSÜ (ARABA) -----
    setInterval(() => {
        if (currentScene === 'araba') updateCar();
    }, 50);

    // ----- BAŞLAT -----
    switchScene('sokak');

});
