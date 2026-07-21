<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منوویتا — پلتفرم منوی دیجیتال برای رستوران‌های ایرانی</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;800&family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --brand: #f97316;
            --brand-subtle: #ffedd5;
            --brand-dark: #ea580c;
            --ui-bg: #f8fafc;
            --ui-card: #ffffff;
            --ui-border: #e2e8f0;
            --ui-text: #0f172a;
            --ui-text-muted: #64748b;
            --code-bg: #0f172a;
            --code-text: #f8fafc;
            --sidebar-width: 280px;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --ui-bg: #0b0f19;
                --ui-card: #111827;
                --ui-border: #1f2937;
                --ui-text: #f3f4f6;
                --ui-text-muted: #9ca3af;
                --brand-subtle: #371b04;
                --code-bg: #030712;
            }
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--ui-bg);
            color: var(--ui-text);
            line-height: 1.8;
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Navigation */
        aside {
            width: var(--sidebar-width);
            background: var(--ui-card);
            border-left: 1px solid var(--ui-border);
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            padding: 2rem 1.5rem;
            overflow-y: auto;
            z-index: 10;
        }

        aside .logo-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--brand);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        aside nav ul {
            list-style: none;
        }

        aside nav li {
            margin-bottom: 0.5rem;
        }

        aside nav a {
            color: var(--ui-text-muted);
            text-decoration: none;
            font-size: 0.95rem;
            display: block;
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        aside nav a:hover {
            background-color: var(--brand-subtle);
            color: var(--brand);
        }

        /* Main Content Layout */
        main {
            margin-right: var(--sidebar-width);
            flex: 1;
            padding: 3rem;
            max-width: 1000px;
        }

        .hero {
            text-align: center;
            padding: 2.5rem 1.5rem;
            background: var(--ui-card);
            border: 1px solid var(--ui-border);
            border-radius: 16px;
            margin-bottom: 3rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .hero h1 {
            font-size: 2.25rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }

        .badges {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 1.25rem;
        }

        .badge {
            background: var(--ui-bg);
            border: 1px solid var(--ui-border);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .hero p {
            color: var(--ui-text-muted);
            font-size: 1.1rem;
        }

        section {
            background: var(--ui-card);
            border: 1px solid var(--ui-border);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }

        h2 {
            font-size: 1.5rem;
            font-weight: 700;
            border-bottom: 2px solid var(--brand-subtle);
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        h3 {
            font-size: 1.15rem;
            margin: 1.5rem 0 0.75rem 0;
            color: var(--brand);
        }

        ul {
            padding-right: 1.25rem;
            margin-bottom: 1rem;
        }

        li {
            margin-bottom: 0.4rem;
        }

        /* Flow Diagrams & Code */
        pre {
            background: var(--code-bg);
            color: var(--code-text);
            padding: 1.25rem;
            border-radius: 12px;
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            direction: ltr;
            text-align: left;
            margin: 1rem 0;
        }

        code {
            font-family: 'Fira Code', monospace;
            background: var(--brand-subtle);
            color: var(--brand-dark);
            padding: 0.15rem 0.4rem;
            border-radius: 4px;
            font-size: 0.875em;
            direction: ltr;
            display: inline-block;
        }

        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }

        /* Tables */
        .table-container {
            overflow-x: auto;
            margin: 1rem 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: right;
            font-size: 0.95rem;
        }

        th, td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--ui-border);
        }

        th {
            background-color: var(--ui-bg);
            font-weight: 700;
        }

        tr:last-child td {
            border-bottom: none;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            aside {
                display: none;
            }

            main {
                margin-right: 0;
                padding: 1.5rem;
            }
        }

        footer {
            text-align: center;
            padding: 2rem 0;
            color: var(--ui-text-muted);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

    <!-- Sidebar Navigation -->
    <aside>
        <div class="logo-title">🍽️ منوویتا</div>
        <nav>
            <ul>
                <li><a href="#about">درباره پروژه</a></li>
                <li><a href="#features">ویژگی‌های کلیدی</a></li>
                <li><a href="#tech">تکنولوژی‌ها</a></li>
                <li><a href="#structure">ساختار پروژه</a></li>
                <li><a href="#data-model">مدل داده</a></li>
                <li><a href="#design">سیستم طراحی</a></li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content -->
    <main>

        <!-- Hero Header -->
        <header class="hero">
            <h1>🍽️ منوویتا</h1>
            <div class="badges">
                <span class="badge">Next.js 15</span>
                <span class="badge">React 19</span>
                <span class="badge">TypeScript 5</span>
                <span class="badge">Supabase</span>
                <span class="badge">Tailwind CSS v4</span>
            </div>
            <p>پلتفرم مدرن منوی دیجیتال برای رستوران‌های ایرانی — بدون نیاز به دانش فنی، در چند دقیقه منوی حرفه‌ای خود را بسازید.</p>
        </header>

        <!-- About Section -->
        <section id="about">
            <h2>🎯 درباره پروژه</h2>
            <p>منوویتا یک راه‌حل <strong>SaaS</strong> کامل برای رستوران‌های ایرانی است. مالک رستوران با ثبت‌نام یک پنل مدیریت کامل دریافت می‌کند و مشتریان بدون نیاز به ثبت‌نام، منو را از طریق یک آدرس اختصاصی مشاهده می‌کنند.</p>

            <pre>
مالک رستوران ثبت‌نام می‌کند
        ↓
پروفایل رستوران را تکمیل می‌کند
        ↓
دسته‌بندی‌ها و آیتم‌های منو را اضافه می‌کند
        ↓
آدرس اختصاصی را در اختیار مشتریان قرار می‌دهد
        ↓
مشتریان منو را مشاهده می‌کنند  ←  yourdomain.com/{slug}</pre>
        </section>

        <!-- Features Section -->
        <section id="features">
            <h2>✨ ویژگی‌های کلیدی</h2>

            <h3>🏪 مدیریت رستوران</h3>
            <ul>
                <li>پروفایل کامل — نام، توضیحات، آدرس، شماره تماس، لوگو</li>
                <li>اسلاگ اختصاصی — هر رستوران آدرس یکتای خود را دارد</li>
                <li>ساعات کاری — تنظیم ساعت باز و بسته با تایم‌پیکر فارسی اختصاصی</li>
                <li>آپلود لوگو — ذخیره در Supabase Storage با پیش‌نمایش فوری</li>
            </ul>

            <h3>📂 مدیریت دسته‌بندی‌ها</h3>
            <ul>
                <li>ایجاد و ویرایش دسته‌بندی با نام و آیکون اموجی</li>
                <li>مرتب‌سازی با <strong>Drag & Drop</strong> — تغییر ترتیب نمایش با کشیدن و رها کردن</li>
                <li>ذخیره خودکار ترتیب جدید در دیتابیس</li>
                <li>فعال و غیرفعال کردن دسته‌بندی بدون حذف</li>
            </ul>

            <h3>🍕 مدیریت آیتم‌های منو</h3>
            <ul>
                <li>اطلاعات کامل — نام، توضیحات، قیمت، دسته‌بندی</li>
                <li>آپلود تصویر اختصاصی برای هر آیتم</li>
                <li>نمایش قیمت با فرمت فارسی و جداکننده هزارگان</li>
                <li><strong>Drag & Drop</strong> برای تغییر ترتیب آیتم‌ها</li>
                <li>فعال و غیرفعال کردن آیتم برای مدیریت موجودی</li>
            </ul>

            <h3>👁️ منوی عمومی (دید مشتری)</h3>
            <ul>
                <li>صفحه منوی زیبا و سریع برای مشتریان</li>
                <li>فیلتر بر اساس دسته‌بندی</li>
                <li>نمایش وضعیت رستوران — باز یا بسته بر اساس ساعات کاری</li>
                <li>نمایش بهینه‌شده تصاویر با Next.js Image</li>
                <li>بدون نیاز به ورود یا ثبت‌نام برای مشتری</li>
            </ul>

            <h3>🖥️ پنل مدیریت</h3>
            <ul>
                <li>داشبورد سه‌تبه — پروفایل، دسته‌بندی‌ها، آیتم‌های منو</li>
                <li><strong>Tab Loading State</strong> — نمایش لودینگ هنگام تغییر تب</li>
                <li>هدر چسبنده با اطلاعات رستوران و دسترسی سریع به منوی عمومی</li>
                <li>فرم‌های کاربرپسند با اعتبارسنجی</li>
            </ul>

            <h3>🎨 رابط کاربری</h3>
            <ul>
                <li><strong>Dark / Light Mode</strong> — سوییچ بین حالت روشن و تاریک</li>
                <li>پشتیبانی کامل <strong>RTL</strong> — طراحی بهینه برای زبان فارسی</li>
                <li>تبدیل خودکار اعداد به فارسی در تمام رابط کاربری</li>
                <li>انیمیشن‌های روان با Tailwind CSS</li>
                <li>طراحی کاملاً <strong>موبایل‌فرست</strong> و واکنش‌گرا</li>
            </ul>

            <h3>⏰ تایم‌پیکر فارسی اختصاصی</h3>
            <ul>
                <li>اسکرول با موس برای تغییر ساعت و دقیقه</li>
                <li>دکمه‌های بالا و پایین برای increment/decrement</li>
                <li>پریست‌های سریع برای ساعت‌های رایج</li>
                <li>پیش‌نمایش زنده ساعت انتخاب‌شده</li>
                <li>طراحی موبایل‌فرست با dropdown ثابت</li>
            </ul>

            <h3>🔐 احراز هویت و امنیت</h3>
            <ul>
                <li>ورود با ایمیل و رمز عبور از طریق Supabase Auth</li>
                <li>Session در کوکی HTTPOnly — امن در برابر XSS</li>
                <li><strong>Row Level Security</strong> در سطح دیتابیس PostgreSQL</li>
                <li>محافظت Server-side — ریدایرکت کاربران احراز نشده</li>
                <li>هر مالک فقط به داده‌های رستوران خود دسترسی دارد</li>
            </ul>
        </section>

        <!-- Tech Stack Section -->
        <section id="tech">
            <h2>🛠️ تکنولوژی‌ها</h2>

            <h3>فرانت‌اند</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>تکنولوژی</th>
                            <th>نسخه</th>
                            <th>کاربرد</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Next.js</strong></td>
                            <td>15 — App Router</td>
                            <td>فریم‌ورک اصلی، SSR، Routing، Server Actions</td>
                        </tr>
                        <tr>
                            <td><strong>React</strong></td>
                            <td>19</td>
                            <td>کتابخانه UI</td>
                        </tr>
                        <tr>
                            <td><strong>TypeScript</strong></td>
                            <td>5</td>
                            <td>تایپ‌گذاری استاتیک در کل پروژه</td>
                        </tr>
                        <tr>
                            <td><strong>Tailwind CSS</strong></td>
                            <td>v4</td>
                            <td>استایل‌دهی utility-first</td>
                        </tr>
                        <tr>
                            <td><strong>Tabler Icons</strong></td>
                            <td>latest</td>
                            <td>آیکون‌های رابط کاربری</td>
                        </tr>
                        <tr>
                            <td><strong>next-themes</strong></td>
                            <td>latest</td>
                            <td>مدیریت Dark / Light Mode</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>بک‌اند و دیتابیس</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>تکنولوژی</th>
                            <th>کاربرد</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Supabase</strong></td>
                            <td>دیتابیس PostgreSQL، احراز هویت، Storage</td>
                        </tr>
                        <tr>
                            <td><strong>Supabase Auth</strong></td>
                            <td>مدیریت کاربران و Session</td>
                        </tr>
                        <tr>
                            <td><strong>Supabase Storage</strong></td>
                            <td>ذخیره تصاویر لوگو و آیتم‌های منو</td>
                        </tr>
                        <tr>
                            <td><strong>Row Level Security</strong></td>
                            <td>امنیت دسترسی به داده در سطح دیتابیس</td>
                        </tr>
                        <tr>
                            <td><strong>Server Actions</strong></td>
                            <td>mutation سمت سرور بدون API جداگانه</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>کتابخانه‌های کمکی</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>کتابخانه</th>
                            <th>کاربرد</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>@dnd-kit/react</strong></td>
                            <td>Drag & Drop برای مرتب‌سازی دسته‌بندی‌ها و آیتم‌ها</td>
                        </tr>
                        <tr>
                            <td><strong>React Hook Form</strong></td>
                            <td>مدیریت state فرم‌ها</td>
                        </tr>
                        <tr>
                            <td><strong>Zod</strong></td>
                            <td>اعتبارسنجی schema در فرم‌ها و Server Actions</td>
                        </tr>
                        <tr>
                            <td><strong>clsx</strong></td>
                            <td>ترکیب شرطی کلاس‌های CSS</td>
                        </tr>
                        <tr>
                            <td><strong>tailwind-merge</strong></td>
                            <td>حل تضاد کلاس‌های Tailwind</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>معماری و الگوها</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>الگو</th>
                            <th>توضیح</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Server Components</strong></td>
                            <td>رندر سمت سرور برای سرعت و SEO</td>
                        </tr>
                        <tr>
                            <td><strong>Client Components</strong></td>
                            <td>فقط برای تعاملات کاربری که نیاز به state دارند</td>
                        </tr>
                        <tr>
                            <td><strong>Feature-based Structure</strong></td>
                            <td>سازماندهی کد بر اساس ویژگی نه نوع فایل</td>
                        </tr>
                        <tr>
                            <td><strong>Server Actions</strong></td>
                            <td>عملیات دیتابیس مستقیم از کامپوننت‌ها</td>
                        </tr>
                        <tr>
                            <td><strong>Optimistic UI</strong></td>
                            <td>به‌روزرسانی فوری رابط قبل از پاسخ سرور</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Project Structure Section -->
        <section id="structure">
            <h2>📁 ساختار پروژه</h2>
            <pre>
mnoovita/
│
├── app/                              # Next.js App Router
│   ├── [slug]/                       # صفحه منوی عمومی رستوران
│   │   └── page.tsx
│   ├── admin/
│   │   ├── login/                    # صفحه ورود
│   │   │   └── page.tsx
│   │   └── dashboard/                # پنل مدیریت
│   │       └── page.tsx              # سرور کامپوننت اصلی
│   ├── layout.tsx
│   └── page.tsx                      # لندینگ پیج
│
├── features/                         # ماژول‌های feature-based
│   └── admin/
│       └── components/
│           ├── dashboard-tabs/       # تب‌های داشبورد با لودینگ state
│           ├── profile-form/         # فرم پروفایل رستوران
│           ├── sortable-category-list/  # لیست دسته‌بندی با DnD
│           └── sortable-menu-item-list/ # لیست آیتم‌ها با DnD
│
├── components/                       # کامپوننت‌های مشترک
│   ├── shared/
│   │   ├── logout-button.tsx
│   │   └── theme-switcher.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── persian-time-picker.tsx   # تایم‌پیکر فارسی اختصاصی
│       └── ...
│
├── actions/                          # Server Actions
│   ├── restaurant.ts
│   ├── categories.ts
│   └── menu-items.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase Client برای مرورگر
│   │   └── server.ts                 # Supabase Client برای سرور
│   └── utils.ts                      # cn، toPersianNumber و ...
│
└── types/
    ├── database.ts                   # تایپ‌های جداول Supabase
    └── index.ts                      # تایپ‌های مشترک</pre>
        </section>

        <!-- Data Model Section -->
        <section id="data-model">
            <h2>🗄️ مدل داده</h2>

            <h3>جدول <code>restaurants</code></h3>
            <pre><code class="language-sql">id            uuid        -- شناسه یکتا
owner_id      uuid        -- ارجاع به auth.users
name          text        -- نام رستوران
slug          text        -- آدرس اختصاصی یکتا
description   text        -- توضیحات
address       text        -- آدرس فیزیکی
phone         text        -- شماره تماس
logo_url      text        -- آدرس لوگو در Storage
open_time     text        -- ساعت باز شدن HH:MM
close_time    text        -- ساعت بسته شدن HH:MM
is_active     boolean     -- وضعیت فعال بودن
created_at    timestamptz</code></pre>

            <h3>جدول <code>categories</code></h3>
            <pre><code class="language-sql">id              uuid
restaurant_id   uuid        -- ارجاع به restaurants
name            text        -- نام دسته‌بندی
icon            text        -- اموجی آیکون
description     text
display_order   integer     -- ترتیب نمایش (مدیریت توسط DnD)
is_active       boolean
created_at      timestamptz</code></pre>

            <h3>جدول <code>menu_items</code></h3>
            <pre><code class="language-sql">id              uuid
restaurant_id   uuid        -- ارجاع به restaurants
category_id     uuid        -- ارجاع به categories
name            text        -- نام آیتم
description     text
price           numeric     -- قیمت
image_url       text        -- آدرس تصویر در Storage
display_order   integer     -- ترتیب نمایش (مدیریت توسط DnD)
is_active       boolean
created_at      timestamptz</code></pre>

            <h3>Storage Buckets</h3>
            <pre>
restaurant-logos/      ← لوگوی رستوران‌ها  (public)
menu-item-images/      ← تصاویر آیتم‌های منو  (public)</pre>

            <h3>Row Level Security</h3>
            <pre>
رستوران‌ها   → فقط مالک می‌تواند ویرایش کند — همه می‌توانند ببینند
دسته‌بندی‌ها → فقط مالک رستوران مربوطه دسترسی نوشتن دارد
آیتم‌ها      → فقط مالک رستوران مربوطه دسترسی نوشتن دارد</pre>
        </section>

        <!-- Design System Section -->
        <section id="design">
            <h2>🎨 سیستم طراحی</h2>

            <h3>توکن‌های رنگی</h3>
            <pre><code class="language-css">--brand              /* رنگ اصلی برند */
--brand-subtle       /* نسخه روشن برند */

--ui-bg              /* پس‌زمینه اصلی */
--ui-bg-muted        /* پس‌زمینه ثانویه */
--ui-surface         /* سطح کارت‌ها و پنل‌ها */

--ui-border          /* رنگ خطوط جداکننده */

--ui-text            /* متن اصلی */
--ui-text-muted      /* متن ثانویه و توضیحات */</code></pre>

            <h3>توابع کمکی</h3>
            <pre><code class="language-typescript">// ترکیب کلاس‌های Tailwind بدون تضاد
cn("base", isActive && "active", variant === "primary" && "primary")

// تبدیل اعداد لاتین به فارسی
toPersianNumber(1234)  // → "۱۲۳۴"
toPersianNumber(42)    // → "۴۲"</code></pre>
        </section>

        <footer>
            ساخته‌شده با ❤️ برای رستوران‌های ایرانی
            <br>
            <strong>اگر این پروژه برایتان مفید بود یک ⭐ بدهید</strong>
        </footer>

    </main>

</body>
</html>