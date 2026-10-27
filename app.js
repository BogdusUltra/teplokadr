// Автоматически убираем .html из адресной строки браузера
if (window.location.protocol.startsWith("http") && window.location.pathname.endsWith(".html")) {
  const cleanPath = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  window.history.replaceState(null, "", cleanPath + window.location.search + window.location.hash);
}

/**
 * Интерактивная логика сайта «Тёплый Кадр»:
 * 1. Модальное окно заказа с формированием готовой заявки в WhatsApp / MAX / Telegram
 * 2. Интерактивный пульт на Главной (Hero Switcher, 9 вселенных, 9:16 плееры, До/После)
 * 3. Переключатели вселенных на странице Мультфильма и 9 стилей на странице Фотосессии
 * 4. Быстрый переход по таймкодам в ИИ-Рилсах и калькулятор оживления фото
 */

const STUDIO_CONTACTS = {
  whatsappPhone: "79147173132", // Реальный номер WhatsApp и MAX: +7 914 717-31-32
  maxPhoneDisplay: "+7 (914) 717-31-32",
  maxUrl: "https://max.ru", // Мессенджер MAX
  telegramUser: "teplo_kadr", // Реальный Telegram: @teplo_kadr
};

function openOrderModal(serviceName = "Консультация по подарку", tariffName = "Подбор тарифа", price = "") {
  const modal = document.getElementById("orderModal");
  if (!modal) return;
  const serviceInput = document.getElementById("modalService");
  const tariffInput = document.getElementById("modalTariff");
  const titleEl = document.getElementById("modalTitle");
  const subEl = document.getElementById("modalSub");

  if (serviceInput) serviceInput.value = serviceName;
  if (tariffInput) tariffInput.value = price ? `${tariffName} (${price})` : tariffName;
  if (titleEl) titleEl.textContent = serviceName;
  if (subEl) subEl.textContent = price ? `Выбранный вариант: ${tariffName} — ${price}` : `Тариф: ${tariffName}`;

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
    `Здравствуйте, студия «Тёплый Кадр»! 👋`,
    `Хочу заказать: *${service}*`,
  ];
  if (tariff) lines.push(`Выбранный пакет: *${tariff}*`);
  lines.push(`Повод: ${occasion}`);
  lines.push(`Меня зовут: ${name}`);
  if (comment) lines.push(`Пожелания: ${comment}`);
  lines.push(`Готов(а) прислать фото для бесплатной пробы!`);
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
    `Текст вашей заявки скопирован! 📋\n\nНаш номер в мессенджере MAX:\n${STUDIO_CONTACTS.maxPhoneDisplay}\n\nСейчас откроется MAX — просто вставьте скопированный текст в диалог по номеру +7 914 717-31-32.`
  );
  window.open(STUDIO_CONTACTS.maxUrl, "_blank");
}

function sendLeadToTelegram() {
  const msg = encodeURIComponent(buildLeadMessage());
  window.open(`https://t.me/${STUDIO_CONTACTS.telegramUser}?text=${msg}`, "_blank");
}

// Инициализация интерактивных элементов после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  // Закрытие модалки по клику на фон
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeOrderModal();
    });
  }

  // Аккордеоны FAQ
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (item) item.classList.toggle("open");
    });
  });

  // Ползунки «До / После»
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

  // Когда включается любое видео на странице — ставим на паузу остальные, чтобы звук не накладывался
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
});

// Интерактивный переключатель 5 направлений в Первом экране Главной страницы (index.html)
function switchHeroShowcase(idx, btnEl) {
  const items = [
    {
      video: "media/pixar_max30_1080p.mp4",
      poster: "pixar_poster_1080p.jpg",
      badge: "🎬 1. Мультфильм по вашей истории (от 9 900 ₽)",
      caption: "Мультфильм в любой вселенной (Pixar, Аниме, GTA, Плюшевый мир) со 100% сходством лиц!",
      linkUrl: "/cartoon",
      linkText: "Вселенная и сюжеты →",
    },
    {
      video: "media/photo_alive_1080p.mp4",
      poster: "media/avito_photo_alive_cover_16x9.png",
      badge: "🎞 2. Оживление старых фото (от 1 500 ₽)",
      caption: "Реставрируем и бережно оживляем архивные снимки родителей, бабушек и дедушек",
      linkUrl: "/photo-alive",
      linkText: "Калькулятор фото →",
    },
    {
      video: "media/slideshow_7styles_1080p.mp4",
      poster: "media/avito_cover_16x9.png",
      badge: "🎨 3. 1 фото → 9 вселенных (от 1 500 ₽)",
      caption: "Превращаем обычное фото с дивана в 9 крутых вселенных (Pixar, Плюш, Шарж, GTA, Аниме и др.)",
      linkUrl: "/photoshoot",
      linkText: "Пощёлкать 9 стилей →",
    },
    {
      video: "media/video_magic_reels_9x16.mp4",
      poster: "media/avito_video_magic_cover_16x9.png",
      badge: "✨ 4. ИИ-Рилсы с 2-й секунды (990 ₽)",
      caption: "Лёгкий монтаж и голливудское ИИ-преображение ваших видео с телефона прямо в движении!",
      linkUrl: "/video-edit",
      linkText: "Смотреть ИИ-Рилсы →",
    },
    {
      video: "media/invitations/01_rider_hth.mp4",
      poster: "media/avito_invitations_cover_16x9.png",
      badge: "💌 5. Живые 3D Видео-Приглашения (от 1 490 ₽)",
      caption: "Говорящие герои у вашего реального ресторана с Карт и 3D Pop-Up открытки на свадьбу и юбилей!",
      linkUrl: "/invitations",
      linkText: "Лента приглашений →",
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

// Быстрый переход по 5 эффектам в видео ИИ-Рилсов (на главной и на video-edit.html)
function seekReelsDemo(sec, videoId = "reelsMainVideo") {
  const vid = document.getElementById(videoId);
  if (!vid) return;
  vid.currentTime = sec;
  vid.play().catch(() => {});
}

// Переключатель рок-хита у Призрачного Гонщика на главной странице
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

// Переключатель вселенных и сюжетов на странице Мультфильма (cartoon.html)
function switchTemplatePreview(tplIdx, btnEl) {
  const universes = [
    {
      img: "media/family_styles/style_06.png",
      title: "1. Вселенная 3D Disney / Pixar — Биография, Любовь и Семья",
      desc: "Любой сюжет: от реальной биографии именинника (Детство → Школа → Универ → Свадьба → Юбилей) до исполнения заветной мечты, полёта в космос или кругосветного путешествия всей семьёй!",
    },
    {
      img: "media/family_styles/style_05.png",
      title: "2. Вселенная Аниме (Хаяо Миядзаки) — Романтика и Волшебство",
      desc: "Нежная и трогательная история знакомства пары, годовщины свадьбы или семейного уюта в живописной рисовке Studio Ghibli с тёплым ветром, лепестками и волшебной атмосферой.",
    },
    {
      img: "media/family_styles/style_08.png",
      title: "3. Плюшевый и Вязаный Мир — Уютная Семейная Сказка",
      desc: "Уникальный кукольно-плюшевый мультфильм, где ваши близкие и домашние питомцы оживают в мире из мягкого войлока и тёплой пряжи. Идеально для детских праздников и подарка маме или бабушке!",
    },
    {
      img: "media/family_styles/style_10.png",
      title: "4. Вселенная GTA / Боевик / Форсаж — Драйв и Дружеский Юмор",
      desc: "Дерзкий сюжет для мужа, брата, друга или босса: крутые тачки, погони, рок-саундтрек и фирменный стиль Rockstar, где именинник — главный герой криминального или экшен-блокбастера!",
    },
    {
      img: "media/family_styles/style_03.png",
      title: "5. Королевское Фэнтези и Рыцарские Хроники",
      desc: "Эпическая сага о главе вашей семейной династии: замки, рыцарские турниры, коронация юбиляра и пир на весь мир!",
    },
    {
      img: "media/family_styles/style_04.png",
      title: "6. Машина Времени: Ламповые 90-е и СССР",
      desc: "Ностальгический сюжет о молодости родителей или друзей: дворы детства, кассетные магнитофоны, первые свидания и атмосфера любимой эпохи.",
    },
    {
      img: "media/family_styles/style_02.png",
      title: "7. Комедия в Каменном Веке или Любая Ваша Идея!",
      desc: "Хотите комедийный ситком, пиратское приключение, супергеройское кино Marvel или фантастику? Мы напишем сценарий и снимем мультфильм в абсолютно любой вселенной по вашим фактам!",
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

// Переключатель 10 стилей портретов (9 вселенных + исходное фото) — работает и на Главной, и на photoshoot.html
function switchStyleGallery(styleIdx, btnEl) {
  const styles = [
    {
      img: "media/family_styles/style_06.png",
      title: "1. 3D Мультфильм Disney / Pixar (Хит заказов!)",
      desc: "Объёмный кино-стиль: 100% узнаваемость лиц, добрый взгляд, фирменная улыбка, причёски, любимый свитер и даже ваш домашний питомец.",
    },
    {
      img: "media/family_styles/style_05.png",
      title: "2. Аниме Хаяо Миядзаки (Studio Ghibli)",
      desc: "Нежная акварельная рисовка и солнечный уют — идеальный вариант для истории любви, годовщины свадьбы и печати на холсте.",
    },
    {
      img: "media/family_styles/style_08.png",
      title: "3. Плюшевый и Вязаный Мир (Felt & Plush World)",
      desc: "Невероятно тёплый и тактильный образ: вся семья, домашний котик, свитера и даже кружка на столе созданы из мягкого войлока, шерсти и уютной пряжи!",
    },
    {
      img: "media/family_styles/style_09.png",
      title: "4. Добрый Художественный Шарж (Выразительные черты!)",
      desc: "Классический дружеский шарж с крупными выразительными чертами лица, харизматичными улыбками и яркой рисовкой — идеальный подарок на праздник!",
    },
    {
      img: "media/family_styles/style_10.png",
      title: "5. Стиль GTA V и Стрит-Арт Граффити",
      desc: "Культовая рисовка в стиле загрузочных экранов Rockstar GTA с дерзким контуром, закатным светом и ярким граффити позади героев!",
    },
    {
      img: "media/family_styles/style_04.png",
      title: "6. Ностальгия 90-х (Кассета VHS и тот самый ковёр)",
      desc: "Перенесём вашу семью в ламповую атмосферу 90-х с настенным ковром, свитерами Boys и датой съёмки на плёнке!",
    },
    {
      img: "media/family_styles/style_03.png",
      title: "7. Королевская Династия и Рыцарский Замок",
      desc: "Глава семьи в сияющих доспехах, супруга в королевском бархате, и даже кот в рыцарском мини-шлеме — роскошный подарок на юбилей.",
    },
    {
      img: "media/family_styles/style_02.png",
      title: "8. Каменный Век (Добрый семейный юмор)",
      desc: "Пещерный уют, меха и саблезубый домашний котик — вызывает бурю восторга и смеха у гостей на празднике.",
    },
    {
      img: "media/family_styles/style_01.png",
      title: "9. Пиксель-Арт 16-Bit (Ретро-приставка Sega / Dendy)",
      desc: "Ностальгический стиль классических видеоигр 90-х — крутой подарок для мужа, брата, друга или IT-специалиста.",
    },
    {
      img: "media/family_styles/style_07.png",
      title: "10. Исходное домашнее фото семьи",
      desc: "Вот с такого обычного снимка на диване мы начали работу — без студийного света и позирования.",
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

// Калькулятор оживления фото на странице photo-alive.html
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
