document.addEventListener("DOMContentLoaded", () => {

  const char = document.getElementById("character");
  const storyText = document.getElementById("story-text");
  const actionBtn = document.getElementById("action-btn");
  const bgLayer = document.getElementById("bg-layer");
  const touchHint = document.getElementById("touch-hint");

  let step = 0;
  let isTransitioning = false;
  let snowInterval = null;

  // ---------- HİKAYE ADIMLARI ----------
  const steps = [
    {
      text: "Bir kedi gördün. Peşinden gitmek ister misin?",
      bg: "linear-gradient(135deg, #f7c948, #f5a623)",
      btn: "🐾 Takip Et",
      hint: false,
    },
    {
      text: "Önüne bir kütük çıktı! Zıplamak mı, takla atmak mı?",
      bg: "linear-gradient(135deg, #d4a373, #b5835a)",
      btn: "⬆ Zıpla / ⬇ Takla",
      hint: true,
    },
    {
      text: "Kar fırtınası başladı! Hızla ilerlemelisin.",
      bg: "linear-gradient(135deg, #4a90d9, #357abd)",
      btn: "⬆ Zıpla / ⬇ Takla",
      hint: true,
    },
    {
      text: "Kedi seni ormana götürdü. Bir roket fırlatma alanı buldun.",
      bg: "linear-gradient(135deg, #1a2e1a, #2a4a2a)",
      btn: "🚀 BİN",
      hint: false,
    },
    // Buraya yeni adımlar ekleyebilirsin (uzay, retro, laboratuvar...)
  ];

  // ---------- ADIM GEÇİŞİ ----------
  function goToStep(index) {
    if (isTransitioning || index >= steps.length) return;
    isTransitioning = true;
    const s = steps[index];

    // Metin ve buton
    storyText.style.opacity = "0";
    setTimeout(() => {
      storyText.textContent = s.text;
      storyText.style.opacity = "1";
    }, 400);

    actionBtn.textContent = s.btn;
    if (s.hint) {
      touchHint.style.display = "block";
    } else {
      touchHint.style.display = "none";
    }

    // Arka plan
    bgLayer.style.background = s.bg;

    // Kar yağışını temizle
    if (snowInterval) {
      clearInterval(snowInterval);
      snowInterval = null;
      document.querySelectorAll(".snowflake").forEach(el => el.remove());
    }

    // Eğer kar fırtınası ise kar yağışını başlat
    if (index === 2) {
      startSnow();
    }

    step = index;
    isTransitioning = false;

    // Karakteri sıfırla
    char.classList.remove("jump", "flip", "move-right", "move-left");
  }

  // ---------- KAR YAĞIŞI ----------
  function startSnow() {
    if (snowInterval) return;
    snowInterval = setInterval(() => {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.textContent = "❄️";
      flake.style.left = Math.random() * 100 + "vw";
      flake.style.fontSize = (Math.random() * 20 + 12) + "px";
      flake.style.animationDuration = (Math.random() * 4 + 4) + "s";
      document.getElementById("game").appendChild(flake);
      setTimeout(() => flake.remove(), 8000);
    }, 200);
  }

  // ---------- KONTROLLER ----------
  // Buton ile ilerleme
  actionBtn.addEventListener("click", () => {
    if (step === 0) {
      goToStep(1);
    } else if (step === 3) {
      alert("🚀 Uzaya çıkıyorsun! (Sonraki bölüm gelecek)");
    } else {
      // Diğer adımlarda buton tekrar ilerletir (isteğe bağlı)
      if (step < steps.length - 1) goToStep(step + 1);
    }
  });

  // Klavye kontrolleri
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        char.classList.add("jump");
        setTimeout(() => char.classList.remove("jump"), 300);
        e.preventDefault();
        break;
      case "ArrowDown":
        char.classList.add("flip");
        setTimeout(() => char.classList.remove("flip"), 400);
        e.preventDefault();
        break;
      case "ArrowRight":
        char.classList.add("move-right");
        setTimeout(() => char.classList.remove("move-right"), 400);
        break;
      case "ArrowLeft":
        char.classList.add("move-left");
        setTimeout(() => char.classList.remove("move-left"), 400);
        break;
      case " ":
        actionBtn.click();
        e.preventDefault();
        break;
    }
  });

  // Telefon dokunmatik (swipe) kontrolleri
  let touchStartY = 0;
  let touchStartX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  });

  document.addEventListener("touchmove", (e) => {
    const diffY = touchStartY - e.touches[0].clientY;
    const diffX = touchStartX - e.touches[0].clientX;

    if (Math.abs(diffY) > 30) {
      if (diffY > 0) {
        char.classList.add("jump");
        setTimeout(() => char.classList.remove("jump"), 300);
      } else {
        char.classList.add("flip");
        setTimeout(() => char.classList.remove("flip"), 400);
      }
      touchStartY = e.touches[0].clientY;
    }

    if (Math.abs(diffX) > 30) {
      if (diffX < 0) {
        char.classList.add("move-right");
        setTimeout(() => char.classList.remove("move-right"), 400);
      } else {
        char.classList.add("move-left");
        setTimeout(() => char.classList.remove("move-left"), 400);
      }
      touchStartX = e.touches[0].clientX;
    }

    e.preventDefault();
  }, { passive: false });

  // ---------- BAŞLAT ----------
  goToStep(0);
});
