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
 * Интерактивная логика сайта студии «Тёплый Кадр» (v14):
 * 1. Модальное окно заказа с отправкой готовой заявки в Telegram (@teplo_kadr)
 * 2. Управляемый слайдер баннеров (точки, стрелки, свайп, пауза при наведении)
 * 3. Адаптивный шоурил в первом экране (16:9 и 9:16 без чёрных полей)
 * 4. Масштабируемая Витрина работ по поводам (PORTFOLIO_ITEMS, клик-загрузка видео без тормозов)
 * 5. Переключатели стилей портретов/мультфильмов и синхронизированный калькулятор оживления фото
 */

const STUDIO_CONTACTS = {
  telegramUser: "teplo_kadr", // Официальный Telegram для заказов: @teplo_kadr
};

function openOrderModal(serviceName = "Консультация по подарку", tariffName = "Индивидуальный подбор", price = "") {
  const modal = document.getElementById("orderModal");
  if (!modal) return;
  const serviceInput = document.getElementById("modalService");
  const tariffInput = document.getElementById("modalTariff");
  const titleEl = document.getElementById("modalTitle");
  const subEl = document.getElementById("modalSub");

  if (serviceInput) serviceInput.value = serviceName;
  if (tariffInput) tariffInput.value = price ? `${tariffName} — ${price}` : tariffName;
  if (titleEl) titleEl.textContent = serviceName;
  if (subEl) subEl.textContent = price ? `Выбранный вариант: ${tariffName} — ${price}` : `Вариант: ${tariffName}`;

  modal.classList.add("active");
}

function closeOrderModal() {
  const modal = document.getElementById("orderModal");
  if (modal) modal.classList.remove("active");
}

function buildLeadMessage() {
  const service = document.getElementById("modalService")?.value.trim() || "Подарок";
  const tariff = document.getElementById("modalTariff")?.value.trim() || "";
  const name = document.getElementById("modalClientName")?.value.trim() || "";
  const occasion = document.getElementById("modalOccasion")?.value.trim() || "";
  const comment = document.getElementById("modalComment")?.value.trim() || "";

  const lines = [];
  if (name) {
    lines.push(`Здравствуйте, меня зовут ${name}!`);
  } else {
    lines.push("Здравствуйте!");
  }

  const sLower = service.toLowerCase();
  const isDefaultTariff =
    !tariff ||
    tariff === "Индивидуальный подбор" ||
    tariff === "Консультация и подбор подарка" ||
    tariff === "Консультация по сюжету + пробный образ" ||
    tariff === "Прислать снимки на бесплатную оценку" ||
    tariff === "Бесплатный пробный кадр по фото" ||
    tariff === "Полный фильм";

  if (sLower.includes("портрет")) {
    const isPaidTariff = tariff.startsWith("Тариф") || tariff.startsWith("Коллекция");
    let line = `Интересует «${service}»`;
    if (occasion) {
      line += occasion.toLowerCase().startsWith("стиль") ? ` (${occasion})` : ` — ${occasion}`;
    } else if (!isDefaultTariff && !isPaidTariff) {
      line += ` (${tariff})`;
    }
    if (isPaidTariff) {
      line += ` [${tariff}]`;
    }
    lines.push(line);
  } else {
    let line = `Интересует «${service}»`;
    if (occasion) {
      line += ` — ${occasion}`;
    }
    if (!isDefaultTariff) {
      line += ` (${tariff})`;
    }
    lines.push(line);
  }

  if (comment) {
    lines.push(`Пожелания: ${comment}`);
  }

  return lines.join("\n");
}

function sendLeadToTelegram() {
  const msg = encodeURIComponent(buildLeadMessage());
  window.open(`https://t.me/${STUDIO_CONTACTS.telegramUser}?text=${msg}`, "_blank");
}

// Безопасные алиасы на случай вызовов из старого кэша
const sendLeadToWhatsApp = sendLeadToTelegram;
const sendLeadToMax = sendLeadToTelegram;

/* ==========================================================================
   ЕДИНАЯ МАСШТАБИРУЕМАЯ БАЗА РАБОТ ДЛЯ ВИТРИНЫ НА ГЛАВНОЙ
   Чтобы добавить новый ролик на сайт — просто добавьте 1 объект в массив ниже!
   ========================================================================== */
const PORTFOLIO_ITEMS = [
  {
    id: "wedding-blockbuster",
    cats: ["hits", "love"],
    badge: "🎬 Хит • Свадебный блокбастер",
    duration: "0:41 • 16:9",
    isVertical: false,
    video: "media/wedding_blockbuster_16x9.mp4",
    poster: "media/wedding_blockbuster_poster_16x9.jpg",
    title: "Комедийный блокбастер «Операция: Вернуть Жениха»",
    desc: "Ироничный экшен-фильм для показа на свадебном банкете: жених после бани в гусарском мундире, гусь-свидетель и погоня на кабриолете к ЗАГСу.",
    price: "от 4 900 ₽",
    orderService: "Свадебный мультфильм / блокбастер",
    orderTariff: "Сюжет в стиле «Операция: Вернуть Жениха»",
    moreUrl: "/love-story",
  },
  {
    id: "pixar-jubilee-max30",
    cats: ["hits", "friends"],
    badge: "🎉 Юбилей и биография • 3D Pixar",
    duration: "2:37 • 16:9",
    isVertical: false,
    video: "media/pixar_max30_1080p.mp4",
    poster: "pixar_poster_1080p.jpg",
    title: "Биографический 3D-мультфильм «Максу 30 лет!»",
    desc: "Тёплая история жизни по фотографиям: детство и пирожки у бабушки, школа, университет, встреча с любимой женой, рыжий кот и друзья.",
    price: "от 4 900 ₽",
    orderService: "Персональный 3D-мультфильм",
    orderTariff: "Биографический фильм на День рождения / Юбилей",
    moreUrl: "/cartoon",
  },
  {
    id: "mom-film-1min",
    cats: ["hits", "mom"],
    badge: "🌸 Ко Дню матери и на юбилей",
    duration: "1:00 • 16:9",
    isVertical: false,
    video: "media/mom_styles/film_mom_1min.mp4",
    poster: "media/mom_styles/film_01.jpg",
    title: "Трогательный фильм о маме по семейным снимкам",
    desc: "Душевная история материнской заботы от первых детских шагов до тёплых встреч взрослой семьи — подарок, который хранят всю жизнь.",
    price: "от 4 900 ₽",
    orderService: "Фильм-подарок для мамы",
    orderTariff: "Персональный фильм о маме с озвучкой",
    moreUrl: "/mothers-day",
  },
  {
    id: "love-story-16x9",
    cats: ["hits", "love"],
    badge: "❤️ Для пары и годовщины • 4 стиля",
    duration: "0:41 • 16:9",
    isVertical: false,
    video: "media/love_stories/00_horizontal_love_story_16x9.mp4",
    poster: "media/love_stories/00_horizontal_poster_16x9.jpg",
    title: "Мультфильм Love Story по вашим совместным фото",
    desc: "Знакомство, первые свидания, смешные моменты и предложение руки и сердца в 4 художественных вселенных для ТВ и проектора.",
    price: "от 4 900 ₽",
    orderService: "Мультфильм Love Story",
    orderTariff: "Горизонтальный фильм 16:9 для пары",
    moreUrl: "/love-story",
  },
  {
    id: "photo-alive-main",
    cats: ["hits", "mom"],
    badge: "🕰 Память семьи • Реставрация + цвет",
    duration: "0:45 • 16:9",
    isVertical: false,
    video: "media/photo_alive_1080p.mp4",
    poster: "media/avito_photo_alive_cover_16x9.png",
    title: "Бережное оживление старых архивных фотографий",
    desc: "Убираем трещины, возвращаем цвет и оживляем тёплые улыбки и объятия родителей, бабушек и дедушек под любимую песню семьи.",
    price: "от 1 500 ₽",
    orderService: "Оживление старых фотографий",
    orderTariff: "Реставрация и оживление семейного архива",
    moreUrl: "/photo-alive",
  },
  {
    id: "invite-ghost-rider",
    cats: ["hits", "invites"],
    badge: "🔥 Вау-приглашение за 2–4 часа",
    duration: "0:24 • 9:16",
    isVertical: true,
    video: "media/invitations/01_rider_hth.mp4",
    poster: "media/invitations/01_rider_hth_poster.jpg",
    title: "Герой у реального входа в ваш ресторан",
    desc: "Байкер на огненном чоппере подъезжает к реальному фасаду вашего заведения с карт и харизматичным голосом зовёт гостей на праздник.",
    price: "1 990 ₽",
    orderService: "3D Видео-приглашение",
    orderTariff: "Приглашение с героем у нашего ресторана (1 990 ₽)",
    moreUrl: "/invitations",
  },
  {
    id: "ls-pixar-hook",
    cats: ["love"],
    badge: "❤️ 3D Disney / Pixar • 9:16",
    duration: "0:28 • 9:16",
    isVertical: true,
    video: "media/love_stories/01_pixar_hook.mp4",
    poster: "media/love_stories/01_poster.jpg",
    title: "«Не фильм про идеальных — фильм про настоящих»",
    desc: "Тёплый вертикальный ролик про домашний уют, совместные вечера, шутки и настоящую любовь вашей пары.",
    price: "от 4 900 ₽",
    orderService: "Мультфильм Love Story",
    orderTariff: "Стиль 3D Disney / Pixar (9:16)",
    moreUrl: "/love-story",
  },
  {
    id: "ls-smith-comic",
    cats: ["love"],
    badge: "💥 Кино-комикс • Драйв и юмор",
    duration: "0:30 • 9:16",
    isVertical: true,
    video: "media/love_stories/02_smith_comic.mp4",
    poster: "media/love_stories/02_poster.jpg",
    title: "Экшен-история пары в духе «Мистер и Миссис Смит»",
    desc: "Динамичный сюжет с искромётным юмором для ярких пар, которые любят приключения, скорость и необычные подарки.",
    price: "от 4 900 ₽",
    orderService: "Мультфильм Love Story",
    orderTariff: "Стиль Кино-комикс «Мистер и Миссис Смит»",
    moreUrl: "/love-story",
  },
  {
    id: "ls-riviera",
    cats: ["love"],
    badge: "🌊 Акварель и солнце • 9:16",
    duration: "0:28 • 9:16",
    isVertical: true,
    video: "media/love_stories/03_riviera_watercolor.mp4",
    poster: "media/love_stories/03_poster.jpg",
    title: "Нежная акварельная история «Морская Ривьера»",
    desc: "Воздушная живописная рисовка, морской бриз, прогулки у воды и романтика летнего путешествия вдвоём.",
    price: "от 4 900 ₽",
    orderService: "Мультфильм Love Story",
    orderTariff: "Стиль Акварельная Ривьера",
    moreUrl: "/love-story",
  },
  {
    id: "ls-anime-rain",
    cats: ["love"],
    badge: "✨ Романтическое аниме • 9:16",
    duration: "0:30 • 9:16",
    isVertical: true,
    video: "media/love_stories/04_anime_rain.mp4",
    poster: "media/love_stories/04_poster.jpg",
    title: "Вечерний город, дождь и один зонт на двоих",
    desc: "Атмосферная история знакомства и нежности в эстетике полнометражного японского аниме с глубоким светом неоновых улиц.",
    price: "от 4 900 ₽",
    orderService: "Мультфильм Love Story",
    orderTariff: "Стиль Романтическое аниме",
    moreUrl: "/love-story",
  },
  {
    id: "mom-card-30s",
    cats: ["mom"],
    badge: "💌 Видео-открытка маме • 9:16",
    duration: "0:30 • 9:16",
    isVertical: true,
    video: "media/mom_styles/card_mom_30s.mp4",
    poster: "media/mom_styles/card_mom_poster_9x16.jpg",
    title: "Именная музыкальная видео-открытка для мамы",
    desc: "Короткое трогательное поздравление для отправки маме утром в праздник — со стихами, голосом и ожившими кадрами.",
    price: "от 1 500 ₽",
    orderService: "Видео-открытка для мамы",
    orderTariff: "Музыкальная открытка 30 сек",
    moreUrl: "/mothers-day",
  },
  {
    id: "mom-looks-30s",
    cats: ["mom"],
    badge: "🎨 9 художественных образов",
    duration: "0:30 • 9:16",
    isVertical: true,
    video: "media/mom_styles/looks_mom_30s.mp4",
    poster: "media/mom_styles/looks_mom_poster_9x16.jpg",
    title: "Преображение портрета мамы + видеоролик в подарок",
    desc: "По одной фотографии создаём коллекцию картин 4K (акварель, масло, Pixar, королевский зал) для печати на холсте.",
    price: "2 900 ₽",
    orderService: "Портреты для мамы в 9 стилях",
    orderTariff: "Коллекция 9 стилей + видеоролик (2 900 ₽)",
    moreUrl: "/mothers-day",
  },
  {
    id: "vladivostok-friends",
    cats: ["friends"],
    badge: "✈️ Путешествия и мужская дружба",
    duration: "8:07 • 16:9",
    isVertical: false,
    video: "media/vladivostok_travel_16x9.mp4",
    poster: "media/vladivostok_poster_16x9.jpg",
    title: "Приключенческий фильм «Поездка друзей во Владивосток»",
    desc: "Большой сюжетный мультфильм по фотографиям из отпуска: перелёт, море, крабы, локальные шутки компании и настоящий драйв.",
    price: "от 4 900 ₽",
    orderService: "Мультфильм про друзей / путешествие",
    orderTariff: "Приключенческий фильм по фото поездки",
    moreUrl: "/cartoon#travel-movie",
  },
  {
    id: "family-9styles-showreel",
    cats: ["friends"],
    badge: "🖼 Картины 4K для холста",
    duration: "0:28 • 16:9",
    isVertical: false,
    video: "media/slideshow_7styles_1080p.mp4",
    poster: "media/avito_cover_16x9.png",
    title: "Семейный портрет по 1 домашнему фото в 9 стилях",
    desc: "Наглядное преображение обычного снимка на диване в 9 ярких художественных миров с сохранением узнаваемых черт всей семьи.",
    price: "от 1 500 ₽",
    orderService: "Семейный портрет по фото",
    orderTariff: "Коллекция 9 стилей + видео (2 900 ₽)",
    moreUrl: "/photoshoot",
  },
  {
    id: "invite-wedding-popup",
    cats: ["invites"],
    badge: "💍 Свадебная 3D-книга Pop-Up",
    duration: "0:22 • 9:16",
    isVertical: true,
    video: "media/invitations/02_wedding.mp4",
    poster: "media/invitations/02_wedding_poster.jpg",
    title: "Объёмное свадебное приглашение с именами и озвучкой",
    desc: "Раскрывающаяся 3D-книга с вашей датой, местом банкета и тёплым голосом диктора — готово к рассылке гостям за 2–4 часа.",
    price: "1 490 ₽",
    orderService: "3D Видео-приглашение",
    orderTariff: "Свадебная 3D-открытка Pop-Up (1 490 ₽)",
    moreUrl: "/invitations",
  },
  {
    id: "invite-jubilee-gold",
    cats: ["invites"],
    badge: "🥂 Юбилей • Золотой конверт",
    duration: "0:24 • 9:16",
    isVertical: true,
    video: "media/invitations/04_jubilee.mp4",
    poster: "media/invitations/04_jubilee_poster.jpg",
    title: "Торжественное 3D-приглашение на Юбилей 50 / 55 / 60 лет",
    desc: "Благородный золотой конверт с сургучной печатью, датой торжества, адресом зала и уважительным голосовым обращением к гостям.",
    price: "1 490 ₽",
    orderService: "3D Видео-приглашение",
    orderTariff: "Юбилейный золотой конверт (1 490 ₽)",
    moreUrl: "/invitations",
  },
  {
    id: "invite-kids-tralalero",
    cats: ["invites"],
    badge: "🦈 Детский хит • Мем-вечеринка",
    duration: "0:25 • 9:16",
    isVertical: true,
    video: "media/invitations/03_tralalero.mp4",
    poster: "media/invitations/03_tralalero_poster.jpg",
    title: "Весёлое приглашение на детский День рождения",
    desc: "Любимые мем-персонажи зовут друзей именинника на праздник — дети пересматривают по 10 раз!",
    price: "1 990 ₽",
    orderService: "3D Видео-приглашение",
    orderTariff: "Детское приглашение с героями (1 990 ₽)",
    moreUrl: "/invitations",
  },
  {
    id: "invite-baby-teddy",
    cats: ["invites"],
    badge: "🧸 1 годик малышу • Плюшевый мир",
    duration: "0:22 • 9:16",
    isVertical: true,
    video: "media/invitations/05_teddy.mp4",
    poster: "media/invitations/05_teddy_poster.jpg",
    title: "Нежное приглашение на первый День рождения малыша",
    desc: "Уютная сказочная открытка с плюшевым мишкой, воздушными шарами, именем крохи и тёплой озвучкой для родных.",
    price: "1 490 ₽",
    orderService: "3D Видео-приглашение",
    orderTariff: "Приглашение на 1 годик (1 490 ₽)",
    moreUrl: "/invitations",
  },
  {
    id: "ai-reels-magic",
    cats: ["invites"],
    badge: "⚡ ИИ-Рилсы • Эффект со 2-й секунды",
    duration: "0:42 • 9:16",
    isVertical: true,
    video: "media/video_magic_reels_9x16.mp4",
    poster: "media/avito_video_magic_cover_16x9.png",
    title: "Голливудское преображение видео с телефона в движении",
    desc: "Королевский бал, вечернее платье на ходу, сакура или северное сияние прямо в вашем ролике для соцсетей и поздравлений.",
    price: "от 990 ₽",
    orderService: "Короткие ИИ-Рилсы и эффекты",
    orderTariff: "1 вертикальный ролик с ИИ-преображением (990 ₽)",
    moreUrl: "/video-edit",
  },
];

function pauseAllPageVideos(exceptVideo = null) {
  document.querySelectorAll("video").forEach((other) => {
    if (other !== exceptVideo && !other.paused) {
      other.pause();
    }
  });
}

function bindExclusiveVideoPlay(vid) {
  if (!vid || vid.dataset.exclusiveBound) return;
  vid.dataset.exclusiveBound = "1";
  vid.addEventListener("play", () => pauseAllPageVideos(vid));
}

function renderPortfolioCards(category = "hits") {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  pauseAllPageVideos();

  const list = PORTFOLIO_ITEMS.filter((item) => item.cats.includes(category));
  grid.innerHTML = list
    .map((item) => {
      const safeTitle = item.orderService.replace(/'/g, "\\'");
      const safeTariff = item.orderTariff.replace(/'/g, "\\'");
      const safePrice = item.price.replace(/'/g, "\\'");
      return `
      <article class="portfolio-card" data-item-id="${item.id}">
        <div class="portfolio-media-box" id="pmedia-${item.id}">
          <span class="portfolio-badge-top">${item.badge}</span>
          <span class="portfolio-badge-dur">${item.duration}</span>
          <button type="button" class="portfolio-thumb-trigger ${item.isVertical ? "is-vertical" : ""}" onclick="playPortfolioVideo('${item.id}')" aria-label="Смотреть видео: ${item.title}">
            <img src="${item.poster}" alt="${item.title}" loading="lazy" />
            <span class="portfolio-play-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </button>
        </div>
        <div class="portfolio-body">
          <div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
          </div>
          <div class="portfolio-actions">
            <span class="portfolio-price">${item.price}</span>
            <div class="portfolio-btn-group">
              <a href="${item.moreUrl}" class="btn btn-outline btn-sm">О формате</a>
              <button type="button" class="btn btn-primary btn-sm" onclick="openOrderModal('${safeTitle}', '${safeTariff}', '${safePrice}')">Хочу так же</button>
            </div>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function filterPortfolio(category, btnEl) {
  document.querySelectorAll(".portfolio-tab-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderPortfolioCards(category);
}

function playPortfolioVideo(itemId) {
  const item = PORTFOLIO_ITEMS.find((x) => x.id === itemId);
  const box = document.getElementById(`pmedia-${itemId}`);
  if (!item || !box) return;

  pauseAllPageVideos();

  box.innerHTML = `
    <video controls autoplay playsinline poster="${item.poster}">
      <source src="${item.video}" type="video/mp4" />
    </video>
  `;
  const vid = box.querySelector("video");
  if (vid) {
    bindExclusiveVideoPlay(vid);
    vid.play().catch(() => {});
  }
}

// Глобальное управление верхним слайдером баннеров
let topBannerGoTo = null;
let topBannerCur = 0;

function stepTopBanner(delta) {
  if (typeof topBannerGoTo === "function") {
    topBannerGoTo(topBannerCur + delta, true);
  }
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
      if (beforeImg && container.offsetWidth > 0) {
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

  document.querySelectorAll("video").forEach(bindExclusiveVideoPlay);

  // Рендерим стартовую вкладку Витрины работ на главной
  if (document.getElementById("portfolioGrid")) {
    renderPortfolioCards("hits");
  }

  // Инициализация калькулятора оживления фото, если он есть на странице
  if (document.getElementById("photoCountRange")) {
    updatePhotoAliveCalc();
  }

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

  // Управляемый слайдер баннеров (точки + стрелки + свайп + пауза при наведении)
  const topSlider = document.getElementById("topBannerSlider");
  const topTrack = document.getElementById("topBannerTrack");
  const dotsWrap = document.getElementById("topBannerDots");
  if (topSlider && topTrack) {
    const slides = topTrack.querySelectorAll(".top-banner-slide");
    const totalSlides = slides.length;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isHovered = false;
    let movedPx = 0;
    let autoTimer = null;

    if (dotsWrap && totalSlides > 1) {
      dotsWrap.innerHTML = Array.from({ length: totalSlides })
        .map(
          (_, i) =>
            `<button type="button" class="top-banner-dot ${i === 0 ? "active" : ""}" aria-label="Слайд ${i + 1}" onclick="event.stopPropagation(); topBannerGoTo(${i}, true)"></button>`
        )
        .join("");
    }

    const updateDots = () => {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll(".top-banner-dot").forEach((d, i) => {
        d.classList.toggle("active", i === topBannerCur);
      });
    };

    const goToSlide = (idx, animate = true) => {
      topBannerCur = ((idx % totalSlides) + totalSlides) % totalSlides;
      topTrack.style.transition = animate ? "transform 0.52s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
      topTrack.style.transform = `translate3d(-${topBannerCur * 100}%, 0, 0)`;
      updateDots();
    };

    topBannerGoTo = (idx, animate = true) => {
      goToSlide(idx, animate);
      restartAuto();
    };

    const restartAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isDragging && !isHovered) {
          goToSlide(topBannerCur + 1, true);
        }
      }, 5500);
    };

    restartAuto();

    topSlider.addEventListener("mouseenter", () => {
      isHovered = true;
    });
    topSlider.addEventListener("mouseleave", () => {
      isHovered = false;
    });

    const onStart = (x) => {
      isDragging = true;
      startX = x;
      currentX = x;
      movedPx = 0;
      topTrack.style.transition = "none";
      if (autoTimer) clearInterval(autoTimer);
    };

    const onMove = (x) => {
      if (!isDragging) return;
      currentX = x;
      const dx = currentX - startX;
      movedPx = Math.max(movedPx, Math.abs(dx));
      const width = topSlider.offsetWidth || 1;
      const offsetPct = -topBannerCur * 100 + (dx / width) * 100;
      topTrack.style.transform = `translate3d(${offsetPct}%, 0, 0)`;
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const dx = currentX - startX;
      const threshold = Math.min(75, (topSlider.offsetWidth || 300) * 0.14);
      if (dx < -threshold) {
        goToSlide(topBannerCur + 1, true);
      } else if (dx > threshold) {
        goToSlide(topBannerCur - 1, true);
      } else {
        goToSlide(topBannerCur, true);
      }
      restartAuto();
    };

    topSlider.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
    topSlider.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
    topSlider.addEventListener("touchend", onEnd);
    topSlider.addEventListener("touchcancel", onEnd);

    topSlider.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) return;
      e.preventDefault();
      onStart(e.clientX);
    });
    window.addEventListener("mousemove", (e) => onMove(e.clientX));
    window.addEventListener("mouseup", onEnd);

    slides.forEach((sl) => {
      sl.addEventListener("click", (e) => {
        if (movedPx > 12) {
          e.preventDefault();
        }
      });
    });
  }
});

// Адаптивный переключатель шоурила в первом экране главной страницы
function switchHeroShowcase(idx, btnEl) {
  const items = [
    {
      video: "media/pixar_max30_1080p.mp4",
      poster: "pixar_poster_1080p.jpg",
      isVertical: false,
      badge: "🎬 Персональный 3D-мультфильм на юбилей и для семьи (от 4 900 ₽)",
      caption: "Индивидуальный фильм по фотографиям и фактам биографии с высокой узнаваемостью героев и озвучкой диктора.",
      linkUrl: "/cartoon",
      linkText: "Подробнее о мультфильмах →",
    },
    {
      video: "media/wedding_blockbuster_16x9.mp4",
      poster: "media/wedding_blockbuster_poster_16x9.jpg",
      isVertical: false,
      badge: "❤️ Новинка: Свадебный блокбастер «Операция: Вернуть Жениха» (от 4 900 ₽)",
      caption: "Комедийный экшен-фильм по фото молодожёнов для яркого показа гостям на свадебном банкете.",
      linkUrl: "/love-story",
      linkText: "Свадебные фильмы и Love Story →",
    },
    {
      video: "media/love_stories/00_horizontal_love_story_16x9.mp4",
      poster: "media/love_stories/00_horizontal_poster_16x9.jpg",
      isVertical: false,
      badge: "💑 Love Story по вашим совместным фото в 4 стилях (от 4 900 ₽)",
      caption: "Романтическая история вашей пары (16:9 для экрана на празднике или 9:16 для телефона).",
      linkUrl: "/love-story",
      linkText: "Смотреть все Love Story →",
    },
    {
      video: "media/mom_styles/film_mom_1min.mp4",
      poster: "media/mom_styles/film_01.jpg",
      isVertical: false,
      badge: "🌸 Трогательный фильм о маме ко Дню матери и юбилею (от 4 900 ₽)",
      caption: "Душевный подарок маме по детским и семейным фотографиям — от первых шагов до сегодняшнего дня.",
      linkUrl: "/mothers-day",
      linkText: "Подарки для мамы →",
    },
    {
      video: "media/photo_alive_1080p.mp4",
      poster: "media/avito_photo_alive_cover_16x9.png",
      isVertical: false,
      badge: "🕰 Бережное оживление и реставрация старых фото (от 1 500 ₽)",
      caption: "Восстанавливаем чёткость лиц, убираем трещины и оживляем памятные снимки родителей, бабушек и дедушек.",
      linkUrl: "/photo-alive",
      linkText: "Оживление архивных фото →",
    },
    {
      video: "media/invitations/01_rider_hth.mp4",
      poster: "media/invitations/01_rider_hth_poster.jpg",
      isVertical: true,
      badge: "💌 Живые 3D видео-приглашения гостям за 2–4 часа (от 1 490 ₽)",
      caption: "Вертикальные открытки 9:16 с озвучкой на свадьбу, юбилей или день рождения у входа в ваш ресторан.",
      linkUrl: "/invitations",
      linkText: "Все 3D-приглашения →",
    },
  ];

  const item = items[idx];
  if (!item) return;

  const cardEl = document.getElementById("heroVideoCard");
  const vidEl = document.getElementById("heroMainVideo");
  const badgeEl = document.getElementById("heroVideoBadge");
  const capEl = document.getElementById("heroVideoCaption");
  const linkEl = document.getElementById("heroVideoLink");

  if (cardEl) {
    cardEl.classList.toggle("is-vertical", Boolean(item.isVertical));
  }

  if (vidEl) {
    pauseAllPageVideos(vidEl);
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
      desc: "Хотите свадебный блокбастер, морское путешествие друзей или фантастическую историю? Мы бережно напишем сценарий и создадим фильм по вашим пожеланиям.",
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

// Переключатель 10 стилей портретов (9 стилей + исходное фото) с интерактивом До/После
function switchStyleGallery(styleIdx, btnEl) {
  const styles = [
    {
      img: "media/family_styles/style_06.png",
      title: "1. Объёмная 3D-анимация (в стиле классики Disney / Pixar)",
      desc: "Тёплый кинематографичный образ: узнаваемые черты лица, добрый взгляд, улыбка, причёски, любимая одежда и даже домашний питомец.",
      shortLabel: "После: 3D-портрет 4K",
    },
    {
      img: "media/family_styles/style_05.png",
      title: "2. Живописная акварель и аниме (в духе студии Ghibli)",
      desc: "Нежная ручная рисовка и солнечный уют — прекрасно подходит для истории любви, годовщины свадьбы и печати на холсте.",
      shortLabel: "После: Акварель и аниме 4K",
    },
    {
      img: "media/family_styles/style_08.png",
      title: "3. Уютный плюшевый и вязаный мир",
      desc: "Необычайно тёплый образ: вся семья, домашний кот, свитера и детали интерьера созданы словно из мягкого войлока и шерстяной пряжи.",
      shortLabel: "После: Плюшевый мир 4K",
    },
    {
      img: "media/family_styles/style_09.png",
      title: "4. Добрый художественный шарж",
      desc: "Традиционный дружеский портрет с выразительными чертами лица, открытыми улыбками и яркой художественной прорисовкой.",
      shortLabel: "После: Добрый шарж 4K",
    },
    {
      img: "media/family_styles/style_10.png",
      title: "5. Современная иллюстрация (стиль GTA и стрит-арт)",
      desc: "Контрастная графическая рисовка с чётким контуром, тёплым закатным светом и ярким художественным фоном.",
      shortLabel: "После: Стиль GTA 4K",
    },
    {
      img: "media/family_styles/style_04.png",
      title: "6. Тёплая атмосфера 90-х годов",
      desc: "Перенесём вашу семью в уютную обстановку 90-х годов с узнаваемыми деталями интерьера и эффектом плёночной фотографии.",
      shortLabel: "После: Атмосфера 90-х 4K",
    },
    {
      img: "media/family_styles/style_03.png",
      title: "7. Королевская династия и рыцарский замок",
      desc: "Глава семьи в благородных доспехах, супруга в бархатном платье в старинном замке — торжественный подарок на юбилей.",
      shortLabel: "После: Королевский образ 4K",
    },
    {
      img: "media/family_styles/style_02.png",
      title: "8. Добрая комедия: Каменный век",
      desc: "Шуточный семейный портрет в первобытном стиле с пушистым саблезубым котом — дарит искренние улыбки всем гостям.",
      shortLabel: "После: Каменный век 4K",
    },
    {
      img: "media/family_styles/style_01.png",
      title: "9. Ретро-иллюстрация 16-Bit (классические видеоигры)",
      desc: "Ностальгический стиль приставок 90-х годов — оригинальный подарок для супруга, брата или друга.",
      shortLabel: "После: 16-Bit ретро 4K",
    },
    {
      img: "media/family_styles/style_07.png",
      title: "10. Исходная домашняя фотография",
      desc: "Вот с такого обычного снимка на диване мы начали работу — без похода в фотостудию и сложной подготовки.",
      shortLabel: "Исходное фото семьи",
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

  const compareCard = document.getElementById("styleCompareCard");
  const compareSection = document.getElementById("photoshootCompareSection");
  const compareGrid = document.querySelector(".styles-compare-grid");
  const compareAfterImg = document.getElementById("styleCompareAfterImg");
  const compareAfterLabel = document.getElementById("styleCompareAfterLabel");

  if (styleIdx === 9) {
    if (compareCard && imgEl) compareCard.style.display = "none";
    if (compareSection) compareSection.style.display = "none";
    if (compareGrid && imgEl) {
      compareGrid.style.gridTemplateColumns = "1fr";
      compareGrid.style.maxWidth = "680px";
      compareGrid.style.margin = "0 auto";
    }
  } else {
    if (compareCard) compareCard.style.display = "";
    if (compareSection) compareSection.style.display = "";
    if (compareGrid && imgEl) {
      compareGrid.style.gridTemplateColumns = "";
      compareGrid.style.maxWidth = "";
      compareGrid.style.margin = "";
    }
    if (compareAfterImg) {
      compareAfterImg.src = data.img;
      compareAfterImg.alt = data.shortLabel;
    }
    if (compareAfterLabel) {
      compareAfterLabel.textContent = data.shortLabel;
    }
    document.querySelectorAll(".ba-container").forEach((container) => {
      const beforeImg = container.querySelector(".ba-overlay img");
      if (beforeImg && container.offsetWidth > 0) {
        beforeImg.style.width = `${container.offsetWidth}px`;
      }
    });
  }

  document.querySelectorAll(".style-tab-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

/**
 * Синхронизированный калькулятор оживления фото (100% совпадение с утверждёнными тарифами!):
 * - Реставрация трещин и цвет включены бесплатно в каждый заказ!
 * - 3 фото = 1 500 ₽
 * - 10 фото (видеоальбом с музыкой и страницей) = 4 900 ₽
 * - 20 фото + диктор (большая семейная летопись) = 9 900 ₽
 */
function updatePhotoAliveCalc() {
  const countEl = document.getElementById("photoCountRange");
  const countLabel = document.getElementById("photoCountLabel");
  const voiceCheck = document.getElementById("photoVoiceCheck");
  const totalEl = document.getElementById("photoCalcTotal");
  const hintEl = document.getElementById("photoCalcHint");
  const btnEl = document.getElementById("photoCalcOrderBtn");

  if (!countEl || !totalEl) return;
  const count = parseInt(countEl.value, 10);
  if (countLabel) countLabel.textContent = `${count} фото`;

  let basePrice = 0;
  let packageNote = "Реставрация трещин, цвет и музыка включены";

  if (count <= 9) {
    basePrice = Math.min(4900, count * 500);
    if (count === 3) packageNote = "Пакет «Знакомство»: 3 оживших снимка с реставрацией";
  } else if (count === 10) {
    basePrice = 4900;
    packageNote = "Хит «Семейный видеоальбом»: 10 фото + музыка + именная страница";
  } else if (count < 20) {
    // Плавный переход от 10 фото (4 900 ₽) к 20 фото (8 400 ₽ без диктора / 9 900 ₽ с диктором)
    basePrice = 4900 + (count - 10) * 350;
  } else {
    basePrice = 8400 + (count - 20) * 350;
    packageNote = "Масштабный фильм «Семейная летопись»";
  }

  let total = basePrice;
  if (voiceCheck?.checked) {
    // Для 20 фото пакет с диктором ровно 9 900 ₽ (8 400 + 1 500 = 9 900 ₽)
    total += 1500;
    if (count === 20) {
      packageNote = "Пакет «Большая семейная летопись»: 20 фото + сценарий и голос диктора";
    }
  }

  const formatted = total.toLocaleString("ru-RU") + " ₽";
  totalEl.textContent = formatted;
  if (hintEl) hintEl.textContent = packageNote;

  if (btnEl) {
    btnEl.onclick = () =>
      openOrderModal(
        "Оживление старых фотографий",
        `${count} оживших фото (реставрация включена)${voiceCheck?.checked ? " + озвучка диктора" : ""}`,
        formatted
      );
  }
}
