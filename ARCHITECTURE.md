# Architecture — EverBiohacking

Технический документ: стек, маршруты, схема данных, дерево папок. Дополняет [README.md](./README.md).

---

## 1. Стек

### MVP
| Слой | Технология | Зачем |
|---|---|---|
| Фреймворк | **Next.js 15** (App Router) | SSR/ISR, Server Components, i18n |
| Язык | **TypeScript** (strict) | Типобезопасность |
| Контент | **MDX** + `@next/mdx` или `next-mdx-remote` | Статьи как код, версионирование в git |
| Парсинг frontmatter | `gray-matter` | YAML-метаданные в MDX |
| i18n | **`next-intl`** | RU/EN, переключатель, локализованные URL |
| Стили | **Tailwind CSS** + CSS variables для темы | Скорость, единый дизайн-токен |
| Иконки | `lucide-react` | Минимальный набор |
| Шрифты | `next/font/google` — **Roboto Serif** (заголовки) + **Inter** (тело) | Self-hosted, без FOUT |
| Хостинг | **Vercel** | Бесшовно с Next.js, ISR из коробки |
| Аналитика | пока нет (заложим Vercel Analytics в v0.5) | — |
| Линт/формат | ESLint + Prettier | — |

### Заложено в архитектуру, реализовано позже
| Слой | Технология | Когда |
|---|---|---|
| Auth | Supabase (magic link) | v0.2 — EverPass |
| Оплаты | Stripe Checkout | v0.2 / v0.3 |
| Email | Resend (приоритет) или Postmark | v0.3 / v0.4 |
| Paywall | поле `access: free \| pass` во frontmatter + middleware | v0.2 |

**Решение по i18n:** `next-intl` (а не нативный App Router i18n) — поддерживает богатые сообщения, локализованные сегменты URL, удобную типизацию. Совместим с RSC.

---

## 2. Маршрутизация (App Router)

```
/                                  → redirect → /en (по Accept-Language)
/en                                → главная (EN)
/ru                                → главная (RU)
/en/protocols                      → каталог протоколов (список + фильтры)
/ru/protocols                      → то же на RU
/en/protocols/[section]            → лента по рубрике (например /en/protocols/sleep)
/en/protocols/[section]/[slug]     → страница протокола
/en/about                          → О проекте/авторе
/en/everpass                       → заглушка "coming soon"
/en/book                           → заглушка "coming soon"
/en/search                         → (v0.5) — placeholder в MVP
```

**Замечания:**
- Локаль — первый сегмент URL. Всё ниже идёт через `[locale]` динамический сегмент группы.
- Slug рубрик (`section`) одинаковый для обеих локалей (`sleep`, `nutrition`...), чтобы не плодить переводы slug'ов на старте. Названия рубрик локализуются через словарь.
- Slug протокола `[slug]` — может различаться между языками (протокол на EN и его перевод на RU имеют разные slug'и). Парный перевод связан полем `translationKey` (см. §4).
- **Slug протокола постоянный.** Он не содержит год, версию и «v2»: смысл модели в том, что один URL живёт годами и копит вес, а меняется содержимое. Год в slug'е (`my-supplement-stack-2026`) — наследие статейной модели и подлежит переименованию.
- `section` остаётся в пути. Это стоит того: 10 рубричных посадочных страниц дают охват запросов, которого плоский `/protocols/[slug]` не даёт. Цена — смена рубрики требует редиректа.

**Легаси-редиректы** (`next.config.ts`, 301):

```
/:locale(en|ru)/articles          → /:locale/protocols
/:locale(en|ru)/articles/:path*   → /:locale/protocols/:path*
```

Непрефиксный `/articles/...` не редиректится напрямую: сначала next-intl middleware подставляет локаль посетителя, дальше срабатывают правила выше. Лишний хоп в обмен на правильный язык.

---

## 3. Дерево файлов

```
EverBiohacking/
├── README.md
├── ARCHITECTURE.md
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .env.local.example
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   ├── images/                    # hero, иллюстрации протоколов
│   └── og/                        # Open Graph картинки
│
├── content/                       # ВЕСЬ контент здесь — MDX в git
│   ├── en/
│   │   ├── sleep/
│   │   │   └── how-i-optimized-my-sleep.mdx
│   │   ├── nutrition/
│   │   ├── activity/
│   │   ├── cognition/
│   │   ├── mental-health/
│   │   ├── hormones/
│   │   ├── supplements/
│   │   ├── tracking/
│   │   ├── longevity/
│   │   └── looks/
│   ├── ru/
│   │   └── ... (зеркальная структура)
│   └── pages/                     # one-off страницы (about.mdx)
│       ├── en/about.mdx
│       └── ru/about.mdx
│
├── messages/                      # i18n словари (next-intl)
│   ├── en.json
│   └── ru.json
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx         # Header + Footer + Providers
│   │   │   ├── page.tsx           # Главная
│   │   │   ├── protocols/
│   │   │   │   ├── page.tsx       # Каталог протоколов
│   │   │   │   └── [section]/
│   │   │   │       ├── page.tsx           # Лента рубрики
│   │   │   │       └── [slug]/page.tsx    # Страница протокола
│   │   │   ├── about/page.tsx
│   │   │   ├── everpass/page.tsx          # заглушка
│   │   │   └── book/page.tsx              # заглушка
│   │   ├── api/
│   │   │   └── subscribe/route.ts         # POST: email (MVP — пишет в лог/файл)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── AboutPreview.tsx
│   │   │   ├── ForBeginners.tsx
│   │   │   ├── RecentlyUpdated.tsx
│   │   │   └── TopicsGrid.tsx
│   │   ├── protocols/
│   │   │   ├── ProtocolCard.tsx
│   │   │   ├── ProtocolHeader.tsx         # заголовок + две даты
│   │   │   ├── SectionSidebar.tsx
│   │   │   └── FilterTabs.tsx
│   │   ├── mdx/                   # компоненты, доступные внутри MDX
│   │   │   ├── Callout.tsx
│   │   │   ├── TLDR.tsx
│   │   │   ├── DosageTable.tsx
│   │   │   ├── References.tsx
│   │   │   ├── MedicalDisclaimer.tsx
│   │   │   ├── ProtocolSummary.tsx        # блок «что делать» в начале
│   │   │   └── YouTube.tsx
│   │   └── ui/                    # примитивы
│   │       ├── Button.tsx
│   │       ├── Tag.tsx
│   │       └── Icon.tsx
│   │
│   ├── lib/
│   │   ├── content.ts             # getAllProtocols, getProtocolBySlug, getBySection
│   │   ├── mdx.ts                 # компиляция MDX, components map
│   │   ├── sections.ts            # константа 10 рубрик + локализация
│   │   ├── reading-time.ts        # подсчёт времени чтения
│   │   └── types.ts               # типы Protocol, Section, Locale
│   │
│   ├── i18n/
│   │   ├── routing.ts             # настройка next-intl
│   │   └── request.ts             # серверная конфигурация
│   │
│   └── styles/
│       └── tokens.css             # CSS-переменные (цвета, радиусы, тени)
│
└── scripts/
    └── new-protocol.ts            # CLI: создать шаблон нового протокола (опционально)
```

---

## 4. Типы данных

```typescript
// src/lib/types.ts

export type Locale = 'en' | 'ru';

export type Section =
  | 'sleep' | 'nutrition' | 'activity' | 'cognition'
  | 'mental-health' | 'hormones' | 'supplements'
  | 'tracking' | 'longevity' | 'looks';

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface ProtocolFrontmatter {
  title: string;
  slug: string;
  lang: Locale;
  section: Section;
  topics: string[];
  level: Level;

  type: 'protocol';          // единственный тип контента

  date: string;              // первая публикация, неизменна
  updated: string;           // последняя правка — задаёт сортировку
  lastReviewed: string;      // последняя сверка; в данных есть, в UI не выводится

  videoUrl?: string;         // YouTube-разбор протокола, опционально
  excerpt: string;
  heroImage?: string;
  readingTime?: number;      // вычисляется если не задано
  draft?: boolean;
  featured?: boolean;
  translationKey?: string;   // связывает RU/EN-перевод одного протокола
  access?: 'free' | 'pass';  // зарезервировано для v0.2 paywall
}

export interface Protocol extends ProtocolFrontmatter {
  content: string;           // raw MDX-исходник
  readingTime: number;       // всегда заполнен после обработки
}
```

**Парсинг и валидация:** при чтении MDX-файла фронтматтер проходит через Zod-схему — это даёт нам runtime-валидацию и автоматические типы. Опечатка в `section` или невалидная дата ломают сборку, а не показываются на проде.

**`translationKey`** — общий идентификатор для пары протоколов-переводов. Кнопка переключения языка на странице протокола может вести на парную локаль, если перевод существует.

**Разрешение дат при чтении.** `updated` и `lastReviewed` необязательны во frontmatter и достраиваются в `readProtocol`: `updated ?? lastReviewed ?? date`, затем `lastReviewed ?? updated`. Это позволяет старым файлам оставаться валидными и не заставляет проставлять даты вручную на каждом новом протоколе. На странице выводятся только `updated` и `date`.

**Сортировка по умолчанию — `updated desc`, не `date desc`.** Протокол попадает наверх списка за то, что он актуален, а не за то, что он новый. Это единственное место, где модель протоколов расходится со статейной на уровне данных, и именно оно определяет поведение главной, каталога и рубрик.

---

## 5. Поток данных

```
content/en/sleep/how-i-optimized.mdx
        │
        ▼
   gray-matter ──► frontmatter + body
        │
        ▼
    Zod-схема (валидация)
        │
        ▼
    Protocol object ──► кеш на время билда (lib/content.ts)
        │
        ├──► getAllProtocols(locale) — каталог, отсортирован по updated
        ├──► getBySection(locale, section)
        ├──► getProtocolBySlug(locale, section, slug)
        ├──► getRecentlyUpdated(locale, limit) — блок на главной
        │
        ▼
  React Server Component ──► рендер ──► ISR
```

Чтение файлов происходит на сервере во время билда / ревалидации. На клиент данные приходят уже отрендеренными.

---

## 6. i18n: ключевые решения

- **Стратегия URL:** `prefix` для обеих локалей (`/en/...`, `/ru/...`). Корень `/` редиректит на язык по `Accept-Language`.
- **Сегменты URL:** локализуются названия рубрик в UI, но slug в URL остаётся канонический (`sleep` и для RU и для EN). Это упрощает MVP; локализованные URL-сегменты можно добавить позже без миграции данных.
- **Контент:** не machine translation — каждый протокол пишется/правится вручную на каждом языке. Если перевода нет, протокол показывается только в своей локали.
- **Fallback:** если пользователь зашёл на `/ru/protocols/sleep/some-slug`, а этого перевода нет — 404 с кнопкой «прочитать на EN», если EN-версия есть.
- **Следствие модели:** правка протокола на одном языке оставляет вторую локаль устаревшей молча. Пары RU/EN нужно править вместе, иначе обещание актуальности выполняется только наполовину.

---

## 7. SEO / шаринг

- **Метаданные** генерируются в `generateMetadata` каждой страницы (title, description, OG).
- **OG-картинки:** статичные `/og/...` или динамические через `opengraph-image.tsx` (Edge runtime, satori).
- **Sitemap.xml** — генерируется автоматически (`app/sitemap.ts`).
- **Robots.txt** — `app/robots.ts`.
- **Структурированные данные:** JSON-LD типа `Article` на страницах протоколов (с `dateModified` = `updated`), `Person` для About.
- **`article:modified_time`** проставляется из `updated` в `generateMetadata` страницы протокола: для краулера у протокола значима дата последнего изменения, а не первой публикации.

---

## 8. Производительность

- ISR с `revalidate: 3600` для контентных страниц; on-demand ревалидация при пуше в `content/` (через webhook → Vercel).
- Изображения через `next/image` с автоматическим WebP/AVIF.
- Шрифты через `next/font` (subset, swap).
- Никакого client-side JS на страницах контента кроме переключателя языка.

---

## 9. Зафиксированные решения

Все открытые вопросы согласованы 2026-05-26:

1. **Шрифты:** Roboto Serif (заголовки) + Inter (тело). Подключение через `next/font/google` в `app/[locale]/layout.tsx`, оба self-hosted с `display: 'swap'`.
2. **i18n-библиотека:** `next-intl`.
3. **Структура `content/`:** локали → рубрики → файлы (`content/{locale}/{section}/{slug}.mdx`).
4. **slug рубрик в URL:** канонические, одинаковые для обеих локалей (`/ru/protocols/sleep`, `/en/protocols/sleep`). Названия локализуются только в UI через словарь.
5. **Логотип:** предоставлен — `public/logo.svg` (комбинированный знак + ворд-марк, чёрный квадрат с осветлённой типографикой).
7. **`translationKey`:** включаем в схему сразу, но необязательное поле. Можно проставлять, когда появятся первые пары переводов.

---

## 10. Что инициализируется на первом коммите

1. `pnpm create next-app` с TS + Tailwind + App Router + ESLint.
2. Зависимости: `pnpm add next-intl gray-matter zod next-mdx-remote lucide-react @vercel/kv`.
3. Базовый layout (Header / Footer) по макетам — лого из `public/logo.svg`, шрифты Roboto Serif + Inter.
4. i18n-роутинг через next-intl с локалями `en`, `ru` и `defaultLocale: 'en'`.
5. Заглушки всех страниц с правильными маршрутами и метаданными.
6. Один пробный MDX-протокол на EN и RU, чтобы прогнать весь пайплайн (frontmatter → Zod → рендер).
7. `.env.local.example` с ключами KV (`KV_REST_API_URL`, `KV_REST_API_TOKEN`).
8. Деплой на Vercel под временный домен.

Только после этого — наполнение контентом и шлифовка дизайна.
