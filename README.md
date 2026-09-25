# BidRank ⚡ — Pay Your Way to the Top

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bidrank--live.vercel.app-9fe870?style=for-the-badge&logo=vercel&logoColor=0e0f0c)](https://bidrank-live.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Backend-Convex-orange?style=for-the-badge&logo=convex)](https://www.convex.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

A transparent, realtime pay-to-rank auction leaderboard for SaaS products and startups. Founders compete for visibility by placing bids, with live rankings updating instantly across all visitors upon verified payment confirmation.

Built with a **Wise-inspired design system** (lime-green `#9fe870` accent, brand ink `#0e0f0c`, soft sage canvas, and pill-shaped geometries).

🔗 **Live Website**: [https://bidrank-live.vercel.app](https://bidrank-live.vercel.app/)

---

## 🌟 Key Features

- **⚡ Realtime Auction Leaderboard**: Products are ranked strictly by cumulative bid value. Tie-breaks are resolved by the earliest bid timestamp.
- **💰 Incremental Difference Pricing**: Founders never pay from scratch to raise rank — only the difference between the current bid and target bid is charged.
- **💳 Verified Razorpay Payment Pipeline**: End-to-end checkout with server-side order generation, Web Crypto HMAC-SHA256 signature verification, and idempotent webhook processing.
- **🏷️ Modern Category Dropdown & Catalog**: Interactive category filter with real-time search, category-specific icons, live product counts, and full category catalog.
- **📊 Outbound Click Attribution & Analytics**: Every visit is tracked via dynamic `/go/[productId]` redirects with anti-caching headers and live counters.
- **📜 Live Activity & Ranking Movement History**: Realtime sidebar activity feed and detailed product movement logs (`#previous → #new`).
- **🛡️ Admin Portal**: Admin-gated platform dashboard with revenue metrics, listing status controls (suspend/restore), and database seeding tools.
- **🌗 Theme Toggle & Responsive Drawer**: First-class light/dark mode support and responsive mobile drawer navigation.
- **🔍 SEO & Metadata Ready**: OpenGraph cards, Twitter cards, dynamic `sitemap.xml`, and `robots.txt`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Backend & Database**: [Convex](https://www.convex.dev/) (Reactive real-time document database & serverless backend)
- **Authentication**: [@convex-dev/auth](https://labs.convex.dev/auth) (Password and session auth)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Payments**: [Razorpay](https://razorpay.com/) Node SDK + Webhooks
- **Typography**: [Manrope](https://fonts.google.com/specimen/Manrope) (Display Headings) & [Inter](https://fonts.google.com/specimen/Inter) (Body)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) + [Convex Cloud](https://convex.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Convex Account](https://www.convex.dev/)
- [Razorpay Account](https://razorpay.com/) (Test or Live mode)

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/midlaj-muhammed/bidrank.git
cd bidrank
npm install
```

### 3. Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Populate the required client keys:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

Configure backend secrets in Convex:

```bash
npx convex env set RAZORPAY_KEY_ID=rzp_test_your_key_id
npx convex env set RAZORPAY_KEY_SECRET=your_key_secret
npx convex env set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
npx convex env set ADMIN_EMAILS=founder@yourdomain.com
npx convex env set SITE_URL=https://your-app-domain.com
```

### 4. Run Development Server

Start both Next.js and Convex:

```bash
# Terminal 1: Convex sync & database functions
npx convex dev

# Terminal 2: Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application locally.

---

## 📦 Scripts

- `npm run dev`: Starts the Next.js local development server.
- `npm run build`: Type-checks and creates an optimized Next.js production build.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint checks.

---

## 🚢 Deployment

### Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add the following (choose **Config** type):
   - `NEXT_PUBLIC_CONVEX_URL`: `https://your-deployment-name.convex.cloud`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `rzp_test_your_key_id`
4. Under **Project Settings > Domains**, add your custom domain or preferred URL.
5. Deploy!

### Configure Razorpay Webhooks (Optional Backup)

In your Razorpay Dashboard:
1. Go to **Settings > Webhooks > Add New Webhook**.
2. **Webhook URL**: `https://your-deployment-name.convex.site/razorpay/webhook`
3. **Secret**: Set the same secret stored in `RAZORPAY_WEBHOOK_SECRET`.
4. **Active Events**:
   - `payment.captured`
   - `order.paid`
   - `payment.failed`

---

## 🌐 Live Demo

Visit the deployed app at: **[https://bidrank-live.vercel.app](https://bidrank-live.vercel.app/)**

---

## 📄 License

MIT © [BidRank](https://bidrank-live.vercel.app)
