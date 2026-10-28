// Автоматически перенаправляем с HTTP на защищённый HTTPS
if (window.location.protocol === "http:" && window.location.hostname.endsWith("teplo-kadr.ru")) {
  window.location.replace("https://" + window.location.host + window.location.pathname + window.location.search + window.location.hash);
}

// Автоматически убираем .html из адресной строки браузера
if (window.location.protocol.startsWith("http") && window.location.pathname.endsWith(".html")) {
  const cleanPath = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  window.history.replaceState(null, "", cleanPath + window.location.search + window.location.hash);
}

/**
 * Интерактивная логика сайта студии «Тёплый Кадр»:
 * 1. Модальное окно заказа с формированием готовой заявки в WhatsApp / MAX / Telegram
 * 2. Переключатель примеров работ на главной странице
 * 3. Переключатели стилей оформления на страницах услуг
 * 4. Быстрый переход по фрагментам в примерах видеороликов и калькулятор оживления фото
 */

const STUDIO_CONTACTS = {
  whatsappPhone: "79147173132", // WhatsApp и MAX: +7 914 717-31-32
  maxPhoneDisplay: "+7 (914) 717-31-32",
  maxUrl: "https://max.ru",
  telegramUser: "teplo_kadr", // Telegram: @teplo_kadr
};

function openOrderModal(serviceName = "Консультация по подарку", tariffName = "Индивидуальный подбор", price = "") {
  const modal = document.getElementById("orderModal");
  if (!modal) return;
  const serviceInput = document.getElementById("modalService");
  const tariffInput = document.getElementById("modalTariff");
  const titleEl = document.getElementById("modalTitle");
  const subEl = document.getElementById("modalSub");

  if (serviceInput) serviceInput.value = serviceName;
  if (tariffInput) tariffInput.value = price ? `${tariffName} (${price})` : tariffName;
  if (titleEl) titleEl.textContent = serviceName;
  if (subEl) subEl.textContent = price ? `Выбранный вариант: ${tariffName} — ${price}` : `Вариант: ${tariffName}`;

  modal.classList.add("active");
}

function closeOrderModal() {
  const modal = document.getElementById("orderModal");
  if (modal) modal.classList.remove("active");
}

function buildLeadMessage() {
  const service = document.getElementById("modalService")?.value || "Подарок";
  const tariff = document.getElementById("modalTariff")?.value || "";
  const name = document.getElementById("modalClientName")?.value.trim() || "Клиент с сайта";
  const occasion = document.getElementById("modalOccasion")?.value || "Праздник";
  const comment = document.getElementById("modalComment")?.value.trim() || "";

  let lines = [
    `Здравствуйте, студия «Тёплый Кадр»!`,
    `Хочу обсудить заказ: *${service}*`,
  ];
  if (tariff) lines.push(`Выбранный тариф: *${tariff}*`);
  lines.push(`Повод: ${occasion}`);
  lines.push(`Меня зовут: ${name}`);
  if (comment) lines.push(`Пожелания: ${comment}`);
  lines.push(`Готов(а) прислать фотографии для ознакомления.`);
  return lines.join("\n");
}

function sendLeadToWhatsApp() {
  const msg = encodeURIComponent(buildLeadMessage());
  window.open(`https://wa.me/${STUDIO_CONTACTS.whatsappPhone}?text=${msg}`, "_blank");
}

function sendLeadToMax() {
  const rawMsg = buildLeadMessage();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(rawMsg).catch(() => {});
  }
  alert(
    `Текст вашей заявки скопирован!\n\nНаш номер в мессенджере MAX:\n${STUDIO_CONTACTS.maxPhoneDisplay}\n\nСейчас откроется MAX — просто вставьте скопированный текст в диалог по номеру +7 914 717-31-32.`
  );
  window.open(STUDIO_CONTACTS.maxUrl, "_blank");
}

function sendLeadToTelegram() {
  const msg = encodeURIComponent(buildLeadMessage());
  window.open(`https://t.me/${STUDIO_CONTACTS.telegramUser}?text=${msg}`, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeOrderModal();
    });
  }

  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (item) item.classList.toggle("open");
    });
  });

  document.querySelectorAll(".ba-container").forEach((container) => {
    const input = container.querySelector(".ba-slider-input");
    const overlay = container.querySelector(".ba-overlay");
    const beforeImg = overlay?.querySelector("img");

    const syncWidth = () => {
      if (beforeImg) {
        beforeImg.style.width = `${container.offsetWidth}px`;
      }
    };
    window.addEventListener("resize", syncWidth);
    syncWidth();

    if (input && overlay) {
      input.addEventListener("input", (e) => {
        overlay.style.width = `${e.target.value}%`;
        syncWidth();
      });
    }
  });

  const allVideos = document.querySelectorAll("video");
  allVideos.forEach((vid) => {
    vid.addEventListener("play", () => {
      allVideos.forEach((other) => {
        if (other !== vid && !other.paused) {
          other.pause();
        }
      });
    });
  });

  const navBar = document.querySelector(".nav-links");
  const activeNav = navBar?.querySelector("a.active");
  if (navBar && activeNav && window.innerWidth <= 768) {
    const scrollTarget = activeNav.offsetLeft - navBar.clientWidth / 2 + activeNav.clientWidth / 2;
    navBar.scrollTo({ left: Math.max(0, scrollTarget), behavior: "instant" });
  }

  const headerEl = document.querySelector("header");
  if (headerEl) {
    let lastScrollY = window.scrollY;
    window.addEventListener(
      "scroll",
      () => {
        const currentY = window.scrollY;
        if (window.innerWidth <= 768) {
          if (currentY > 55 && currentY >= lastScrollY) {
            headerEl.classList.add("header-scrolled");
          } else if (currentY < 30 || lastScrollY - currentY > 25) {
            headerEl.classList.remove("header-scrolled");
          }
        } else {
          headerEl.classList.remove("header-scrolled");
        }
        lastScrollY = currentY;
      },
      { passive: true }
    );
  }
});

// Переключатель 5 направлений в первом экране главной страницы
function switchHeroShowcase(idx, btnEl) {
  const items = [
    {
      video: "media/pixar_max30_1080p.mp4",
      poster: "pixar_poster_1080p.jpg",
      badge: "1. Мультфильм по вашей истории (от 9 900 ₽)",
      caption: "Индивидуальный фильм по фотографиям и семейным воспоминаниям с полным портретным сходством.",
      linkUrl: "/cartoon",
      linkText: "Подробнее о мультфильмах →",
    },
    {
      video: "media/photo_alive_1080p.mp4",
      poster: "media/avito_photo_alive_cover_16x9.png",
      badge: "2. Оживление старых фотографий (от 1 500 ₽)",
      caption: "Бережно восстанавливаем и оживляем памятные снимки родителей, бабушек и дедушек.",
      linkUrl: "/photo-alive",
      linkText: "Подробнее об оживлении фото →",
    },
    {
      video: "media/slideshow_7styles_1080p.mp4",
      poster: "media/avito_cover_16x9.png",
      badge: "3. Семейный портрет в 9 стилях (от 1 500 ₽)",
      caption: "Превращаем обычную домашнюю фотографию в картины высокого разрешения 4K для печати на холсте.",
      linkUrl: "/photoshoot",
      linkText: "Посмотреть стили портретов →",
    },
    {
      video: "media/video_magic_reels_9x16.mp4",
      poster: "media/avito_video_magic_cover_16x9.png",
      badge: "4. Короткие видеоролики и видеоэффекты (от 990 ₽)",
      caption: "Красивый монтаж видеозаписей с телефона и художественное преображение кадра в движении.",
      linkUrl: "/video-edit",
      linkText: "Примеры видеороликов →",
    },
    {
      video: "media/invitations/01_rider_hth.mp4",
      poster: "media/avito_invitations_cover_16x9.png",
      badge: "5. Живые 3D видео-приглашения (от 1 490 ₽)",
      caption: "Именные видео-открытки с озвучкой и приглашения с любимыми героями у входа в ваш ресторан.",
      linkUrl: "/invitations",
      linkText: "Посмотреть приглашения →",
    },
  ];

  const item = items[idx];
  if (!item) return;

  const vidEl = document.getElementById("heroMainVideo");
  const badgeEl = document.getElementById("heroVideoBadge");
  const capEl = document.getElementById("heroVideoCaption");
  const linkEl = document.getElementById("heroVideoLink");

  if (vidEl) {
    vidEl.pause();
    vidEl.poster = item.poster;
    vidEl.src = item.video;
    vidEl.load();
    vidEl.play().catch(() => {});
  }
  if (badgeEl) badgeEl.textContent = item.badge;
  if (capEl) capEl.textContent = item.caption;
  if (linkEl) {
    linkEl.href = item.linkUrl;
    linkEl.textContent = item.linkText;
  }

  document.querySelectorAll(".hero-switch-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

function seekReelsDemo(sec, videoId = "reelsMainVideo") {
  const vid = document.getElementById(videoId);
  if (!vid) return;
  vid.currentTime = sec;
  vid.play().catch(() => {});
}

function switchHomeRiderTrack(src, btnEl) {
  const vid = document.getElementById("homeRiderVideo");
  if (!vid) return;
  vid.pause();
  vid.src = src;
  vid.load();
  vid.play().catch(() => {});
  const parent = btnEl.parentElement;
  if (parent) {
    parent.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  }
  btnEl.classList.add("active");
}

// Переключатель художественных стилей и сюжетов на странице мультфильма (cartoon.html)
function switchTemplatePreview(tplIdx, btnEl) {
  const universes = [
    {
      img: "media/family_styles/style_06.png",
      title: "1. Объёмная 3D-анимация (Disney / Pixar) — Биография и Семья",
      desc: "Тёплый фильм по реальной истории жизни: детство, юность, знакомство с любимым человеком, верные друзья, семейные традиции и праздничное торжество.",
    },
    {
      img: "media/family_styles/style_05.png",
      title: "2. Акварельная анимация (в духе Хаяо Миядзаки) — Романтика и Уют",
      desc: "Нежная и трогательная история знакомства пары, годовщины свадьбы или семейного тепла в мягкой живописной рисовке.",
    },
    {
      img: "media/family_styles/style_08.png",
      title: "3. Плюшевый и вязаный мир — Добрая семейная сказка",
      desc: "Уютный кукольный мультфильм, где ваши близкие и домашние питомцы оживают в мире из мягкого войлока и тёплой пряжи. Замечательный подарок для детей, мамы или бабушки.",
    },
    {
      img: "media/family_styles/style_10.png",
      title: "4. Приключенческий стиль (Кино и Игры) — Динамика и Дружеский юмор",
      desc: "Яркий приключенческий сюжет для супруга, брата, друга или коллеги: любимые автомобили, путешествия, музыка и весёлые истории из жизни.",
    },
    {
      img: "media/family_styles/style_03.png",
      title: "5. Королевская хроника и Рыцарский замок",
      desc: "Торжественная сказка о вашей семейной династии: рыцарские доспехи, королевский бал и чествование юбиляра.",
    },
    {
      img: "media/family_styles/style_04.png",
      title: "6. Ностальгия по эпохе 80-х и 90-х годов",
      desc: "Душевный сюжет о молодости родителей или друзей: дворы детства, кассетные магнитофоны, первые свидания и тёплая атмосфера прошлых лет.",
    },
    {
      img: "media/family_styles/style_02.png",
      title: "7. Добрая комедия или любой ваш индивидуальный сюжет",
      desc: "Хотите весёлую семейную комедию, морское путешествие или фантастическую историю? Мы бережно напишем сценарий и создадим фильм по вашим пожеланиям.",
    },
  ];

  const data = universes[tplIdx];
  if (!data) return;

  const imgEl = document.getElementById("tplPreviewImg");
  const titleEl = document.getElementById("tplPreviewTitle");
  const descEl = document.getElementById("tplPreviewDesc");
  if (imgEl) imgEl.src = data.img;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;

  document.querySelectorAll(".tpl-tab-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

// Переключатель 10 стилей портретов (9 стилей + исходное фото)
function switchStyleGallery(styleIdx, btnEl) {
  const styles = [
    {
      img: "media/family_styles/style_06.png",
      title: "1. Объёмная 3D-анимация (в стиле классики Disney / Pixar)",
      desc: "Тёплый кинематографичный образ: 100% узнаваемость черт лица, добрый взгляд, улыбка, причёски, любимая одежда и даже домашний питомец.",
    },
    {
      img: "media/family_styles/style_05.png",
      title: "2. Живописная акварель и аниме (в духе студии Ghibli)",
      desc: "Нежная ручная рисовка и солнечный уют — прекрасно подходит для истории любви, годовщины свадьбы и печати на холсте.",
    },
    {
      img: "media/family_styles/style_08.png",
      title: "3. Уютный плюшевый и вязаный мир",
      desc: "Необычайно тёплый образ: вся семья, домашний кот, свитера и детали интерьера созданы словно из мягкого войлока и шерстяной пряжи.",
    },
    {
      img: "media/family_styles/style_09.png",
      title: "4. Добрый художественный шарж",
      desc: "Традиционный дружеский портрет с выразительными чертами лица, открытыми улыбками и яркой художественной прорисовкой.",
    },
    {
      img: "media/family_styles/style_10.png",
      title: "5. Современная иллюстрация (стиль GTA и стрит-арт)",
      desc: "Контрастная графическая рисовка с чётким контуром, тёплым закатным светом и ярким художественным фоном.",
    },
    {
      img: "media/family_styles/style_04.png",
      title: "6. Тёплая атмосфера 90-х годов",
      desc: "Перенесём вашу семью в уютную обстановку 90-х годов с узнаваемыми деталями интерьера и эффектом плёночной фотографии.",
    },
    {
      img: "media/family_styles/style_03.png",
      title: "7. Королевская династия и рыцарский замок",
      desc: "Глава семьи в благородных доспехах, супруга в бархатном платье в старинном замке — торжественный подарок на юбилей.",
    },
    {
      img: "media/family_styles/style_02.png",
      title: "8. Добрая комедия: Каменный век",
      desc: "Шуточный семейный портрет в первобытном стиле с пушистым саблезубым котом — дарит искренние улыбки всем гостям.",
    },
    {
      img: "media/family_styles/style_01.png",
      title: "9. Ретро-иллюстрация 16-Bit (классические видеоигры)",
      desc: "Ностальгический стиль приставок 90-х годов — оригинальный подарок для супруга, брата или друга.",
    },
    {
      img: "media/family_styles/style_07.png",
      title: "10. Исходная домашняя фотография",
      desc: "Вот с такого обычного снимка на диване мы начали работу — без похода в фотостудию и сложной подготовки.",
    },
  ];

  const data = styles[styleIdx];
  if (!data) return;

  const imgEl = document.getElementById("stylePreviewImg");
  const titleEl = document.getElementById("stylePreviewTitle");
  const descEl = document.getElementById("stylePreviewDesc");
  if (imgEl) imgEl.src = data.img;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;

  document.querySelectorAll(".style-tab-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

function updatePhotoAliveCalc() {
  const countEl = document.getElementById("photoCountRange");
  const countLabel = document.getElementById("photoCountLabel");
  const voiceCheck = document.getElementById("photoVoiceCheck");
  const restoreCheck = document.getElementById("photoRestoreCheck");
  const totalEl = document.getElementById("photoCalcTotal");
  const btnEl = document.getElementById("photoCalcOrderBtn");

  if (!countEl || !totalEl) return;
  const count = parseInt(countEl.value, 10);
  if (countLabel) countLabel.textContent = `${count} фото`;

  let perPhoto = 500;
  if (count >= 10) perPhoto = 450;
  if (count >= 20) perPhoto = 400;

  let total = count * perPhoto;
  if (voiceCheck?.checked) total += 2500;
  if (restoreCheck?.checked) total += count * 150;

  const formatted = total.toLocaleString("ru-RU") + " ₽";
  totalEl.textContent = formatted;
  if (btnEl) {
    btnEl.onclick = () =>
      openOrderModal(
        "Оживление архивных фотографий",
        `${count} оживших фото${voiceCheck?.checked ? " + диктор" : ""}`,
        formatted
      );
  }
}
