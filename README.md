# Phrased — AI Prompt Templates

> **Stop writing prompts. Start using them.**

A sleek, dark-themed prompt template library for Claude, Gemini, and Perplexity. **92 expert-crafted prompts** with fill-in-the-blank variables. Inject directly into any AI chat—no copy-paste busywork.

**[Install from Chrome Web Store](#installation)** • **[See a Demo](#demo)** • **[Open an Issue](#support)**

## Why Phrased?

You spend your day switching between AI chats. Claude for coding. ChatGPT for brainstorming. Gemini for research. You write the same prompts. Over and over. We built Phrased to stop that waste.

**92 battle-tested prompts** that actually work. Fill your variables. One click. Your prompt is in the chat.

### Features

✨ **92 expert prompts** across 5 categories—Writing, Coding, Career, Analysis, Marketing (with more coming weekly)
🎯 **Smart variables** — fill placeholders once, see live preview, then inject or copy
🔍 **Fuzzy search** — find the right prompt in milliseconds, no digging
📋 **Copy or inject** — directly into Claude/ChatGPT/Gemini/Perplexity with one click, or copy-paste anywhere
🎨 **Dark, minimal UI** — orange accents, clean typography, no distraction
🚀 **Universal compatibility** — "Try Inject" mode works on Canva, custom AI tools, and beyond
🔒 **Zero data collection** — 100% local, no servers, no tracking, no account needed
🌱 **Indie-built** — made by developers for developers, shaped by community feedback

## Installation

### From Chrome Web Store (Easiest)

Coming soon to the Chrome Web Store. [Add to Chrome](https://chromewebstore.google.com) when available.

### From Source (Developer Mode)

Want to try it now? Load it locally:

1. **Get the code**
   ```bash
   git clone https://github.com/your-username/phrased.git
   cd phrased
   npm install
   npm run build
   npm run package
   ```

2. **Load into Chrome**
   - Open `chrome://extensions` in Chrome
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked**
   - Select the `build/chrome-mv3-prod` folder
   - Done! The **Phrased** icon appears in your Chrome toolbar

## How to Use

1. **Click the Phrased icon** — appears in your Chrome toolbar on any website
2. **Search or browse** — find a prompt using fuzzy search or category filters
3. **Fill variables** — type your custom values (green dot shows when complete)
4. **See preview** — live preview shows exactly what you'll send
5. **One-click injection**:
   - **On Claude/ChatGPT/Gemini/Perplexity** — "Send to chat" button injects directly
   - **Anywhere else** — "Copy" button copies to clipboard, paste where you need it

## Supported Platforms

| Platform | Copy | Inject | Status |
|----------|------|--------|--------|
| **Claude** | ✅ | ✅ | Fully supported |
| **Gemini** | ✅ | ✅ | Fully supported |
| **Perplexity** | ✅ | ✅ | Fully supported |
| **Any website** | ✅ | — | Copy-paste mode |

## The 92 Prompts

Organized by use case. Each prompt has fill-in-the-blank variables so you never write the same thing twice.

| Category | Count | Examples |
|----------|-------|----------|
| **Writing & Email** | 18 | Cold outreach, feedback, meeting notes, apologies, negotiations, proposals |
| **Coding & Technical** | 18 | Debug errors, code review, write tests, refactor, SQL queries, security audits |
| **Career & Job Search** | 18 | Resume bullets, cover letters, interviews, salary negotiation, LinkedIn profiles |
| **Analysis & Research** | 19 | Summarize, compare, evaluate, risk analysis, lessons learned, competitor research |
| **Marketing & Content** | 19 | Launch announcements, ad copy, SEO blogs, landing pages, case studies, Twitter threads |

**More coming soon:** Productivity, AI workflows, product management, design, customer support, and more based on community feedback.

## Design Philosophy

**Dark, fast, focused.**

- 🌑 **Dark theme** (`#0f0f1e` background) for reduced eye strain during long AI sessions
- 🟠 **Orange accents** (`#ff8c42`) for clarity and visual hierarchy
- ⚪ **High contrast text** for readability at any size
- 📱 **Responsive sidebar** that doesn't hog your screen—stays out of the way, ready when you need it
- 🎯 **Minimalist design**—every pixel has a purpose

The goal: inject a prompt in 3 seconds. No friction. No distraction.

## Privacy

- ✅ **No data collection** — all prompts bundled in the extension
- ✅ **No servers** — everything runs locally in your browser
- ✅ **No tracking** — zero analytics, zero telemetry
- ✅ **No account** — install and use immediately
- ✅ **No network requests** — 100% offline operation

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + K` | Focus search (when sidebar is open) |
| `Esc` | Close sidebar |
| `Enter` | Copy the selected prompt |

## Troubleshooting

### Using Phrased on unsupported platforms (Canva, custom AI, etc.)
- Click the **"Try Inject"** button (appears in category pills when on unknown platform)
- This enables the "Send to chat" button for best-effort injection
- If injection doesn't work, use **Copy** and paste manually
- See `TRY_INJECT_FEATURE.md` for detailed instructions

### "Send to chat" button shows "Copy instead" or doesn't appear
- If on an officially supported platform (Claude, ChatGPT, Gemini, Perplexity):
  - Reload the page — platform detection runs on page load
  - Check `chrome://extensions` that extension is enabled
- If on an unsupported platform:
  - Click the **"Try Inject"** button to enable injection attempt
  - Use **Copy** as reliable fallback (works everywhere)

### Variables aren't filling or focus jumps to Claude
- Click in the variable input field to ensure focus
- Type your value — the input should stay focused in the sidebar
- If focus jumps, click back into the Phrased sidebar input
- Use Tab to move between variables (focus trap keeps you in the sidebar)
- The green dot next to the label indicates a filled variable

### Injection works on official platform but not on unsupported site
- Use **Copy** instead and paste manually
- Phrased has deep integration with Claude/ChatGPT/Gemini/Perplexity
- Other platforms may have custom input handling that Copy bypasses

**On Claude:**
- Reload `claude.ai` and try again (platform detection updates on page load)
- If variables still jump, use Copy instead
- The focus trap should prevent jumping

**On ChatGPT:**
- Make sure you're on `chat.openai.com` (not the mobile site)
- If injection blocked, try Copy and paste instead
- Reload and try again

**On Perplexity:**
- Try Copy + manual paste if inject doesn't work
- Reload the page and check that the search box is visible

**On Canva AI or other custom platforms:**
- Click **"Try Inject"** button if available
- Use **Copy** as reliable fallback

### Extension doesn't appear
- Reload the page (`Ctrl+R` or `Cmd+R`)
- Check `chrome://extensions` and enable Developer mode (top-right toggle)
- Verify you loaded the **build/chrome-mv3-prod** folder, not the root project
- Try a fresh browser window if the extension still doesn't load

### Extension sidebar is small or hard to read
- The dark theme uses `#0f0f1e` background with `#ff8c42` orange accents
- Zoom your browser if text is too small (`Ctrl++` or `Cmd++`)
- The sidebar is 340px wide and covers the right edge of your screen

### Build from source
See `BUILDING.md` for development and custom modifications
- Or press `Escape`
- Reload the page if stuck

## Building from Source

```bash
cd phrased-extension
npm install
npm run build
npm run package
```

The extension is built with:
- **React 18** — UI
- **TypeScript** — type-safe code
- **Plasmo** — Chrome extension framework
- **Fuse.js** — fuzzy search

## Roadmap

**Q2 2026:**
- ✅ Chrome Web Store launch (92 prompts)
- 🔄 Community feedback loop—shape what we build next

**Q3 2026 (Coming):**
- 🚀 150+ prompts across 8 categories
- 📱 Firefox extension
- 🎨 Custom prompt builder (create & share your own)
- 🌐 Safari extension
- 📊 Usage analytics (opt-in, local only)

**Q4 2026 (Planned):**
- 💬 AI-powered prompt suggestions based on context
- 🔌 Integration with Notion, Google Docs, Slack
- 🌍 Multi-language prompts
- 👥 Prompt sharing community

**We listen to you.** Open an issue with feature requests, and we'll prioritize based on what actually matters to developers.

## Support

Found a bug? Want to suggest a prompt? Have feedback?

- **Open an issue** on GitHub (best way to reach us)
- **Email** [your-email@example.com](mailto:your-email@example.com)
- **Discord/Twitter** [coming soon]

This is an indie project, but we're responsive and committed to making it useful for you.

## For Developers

**Want to build on Phrased?**

The codebase is modern and clean:
- **React 18** + **TypeScript** for type safety
- **Plasmo** for zero-config Chrome extension development
- **Fuse.js** for blazing-fast fuzzy search
- **Tailwind CSS** for styling (if you want to customize)

See [BUILDING.md](./BUILDING.md) for detailed dev setup.

## License

MIT — use freely, modify, share, learn.

---

**Built by indie developers. For indie developers.** 

If you're using Phrased and it saves you even 30 minutes a week, that's a win. If you have ideas for prompts or features, open an issue—we're building this for you.

**Star this repo** to follow along. More coming soon. 🚀
