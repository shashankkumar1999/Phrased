# Phrased

A Chrome extension that injects 92 AI prompts directly into Claude, ChatGPT, Gemini, and Perplexity. No copy-paste. No signup. No tracking.

---

## What It Does

You write the same prompts over and over. Claude for code, ChatGPT for brainstorming, Gemini for research. Same prompts. Different tabs.

Phrased stores them for you—92 templates across writing, coding, career, analysis, and marketing. Fill in your variables, click inject, done.

Works on:
- **Claude** ✅
- **ChatGPT** ✅
- **Gemini** ✅
- **Perplexity** ✅
- **Any website** (copy-paste mode)

---

## Features

- **92 prompts** organized by category
- **Smart variables** — fill once, see preview, inject
- **Fuzzy search** — find what you need fast
- **Dark UI** — minimal, distraction-free
- **100% local** — no servers, no tracking, no account
- **Works everywhere** — tries injection on any platform

---

## Installation

### From Chrome Web Store
[Add to Chrome](https://chrome.webstore.google.com/detail/phrased-ai-prompts-made-easier) (live now)

### From Source

```bash
git clone https://github.com/shashankkumar1999/Phrased.git
cd Phrased
npm install
npm run build
npm run package
```

Then load `build/chrome-mv3-prod` into Chrome:
1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select `build/chrome-mv3-prod`

---

## The Prompts

| Category | Count | What's Inside |
|----------|-------|---------------|
| **Writing & Email** | 18 | Cold outreach, feedback, meeting notes, apologies, proposals |
| **Coding & Technical** | 18 | Debug, code review, tests, refactor, SQL, security |
| **Career & Job Search** | 18 | Resume, cover letters, interviews, negotiation, LinkedIn |
| **Analysis & Research** | 19 | Summarize, compare, evaluate, risk analysis, competitor research |
| **Marketing & Content** | 19 | Launch, ad copy, SEO blogs, landing pages, case studies |

Each prompt has fill-in-the-blank variables so you're not copy-pasting the same thing twice.

---

## How to Use

1. Click the Phrased icon
2. Search or browse
3. Fill in your variables
4. See preview
5. Click "Send to chat" or "Copy"

---

## Privacy

- No data collection
- No servers
- No tracking
- No account
- Everything runs locally

---

## Tech

- React 18
- TypeScript
- Plasmo (Chrome extension framework)
- Fuse.js (search)

See [BUILDING.md](./BUILDING.md) for dev setup.

---

## Roadmap

**Done:**
- 92 prompts
- Claude, ChatGPT, Gemini, Perplexity support
- Dark UI

**Next:**
- 150+ prompts
- Firefox
- Custom prompt builder
- Usage insights (local)

---

## Issues & Feedback

Open an issue on GitHub or check [BUILDING.md](./BUILDING.md) for dev setup.

---

## License

MIT

---

Made by an indie dev who got tired of writing the same prompts.
