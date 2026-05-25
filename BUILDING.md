# Building Phrased from Source

## Prerequisites

- Node.js 16+ and npm
- Chrome or Chrome-based browser

## Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```

This starts a Plasmo dev server that watches for changes and auto-reloads.

### 3. Load in Chrome
- Open `chrome://extensions`
- Enable Developer mode (top-right)
- Click "Load unpacked"
- Select the `build/chrome-mv3-dev` folder (created by `npm run dev`)
- The extension auto-updates as you edit files

### 4. Make changes
Edit files in `src/` and changes will auto-reload:

#### Sidebar UI (main interface)
- `src/contents/sidebar.tsx` — React component with dark theme
- `src/styles/sidebar.css` — minimal scoped styles

#### Platform detection & injection
- `src/lib/inject.ts` — detects platform, injects text into chat
- Update selectors here if platforms change their DOM structure

#### Prompt data
- `src/lib/prompts.json` — 100 prompts with variables
- Edit to add/remove/modify prompts

#### Popup
- `src/popup.tsx` — page that opens when you click the extension icon

#### Type definitions
- `src/types/index.ts` — TypeScript types for Prompt, Category, etc.

## Building for Production

### 1. Build the extension
```bash
npm run build
```

Creates `build/chrome-mv3-prod/` with optimized bundles.

### 2. Package into a zip
```bash
npm run package
```

Creates `build/chrome-mv3-prod.zip` for distribution.

## Key Files to Understand

### Design System (Colors)
All defined in `src/contents/sidebar.tsx`:
- **Dark background**: `#0f0f1e`
- **Orange accent**: `#ff8c42` (buttons, borders, highlights)
- **Light gray text**: `#e0e0e0`
- **Muted text**: `#808090`

To change theme: search `#0f0f1e` or `#ff8c42` and replace throughout.

### Adding New Prompts

Edit `src/lib/prompts.json`:

```json
{
  "id": "my-new-prompt",
  "title": "My New Prompt",
  "category": "Writing & Email",
  "description": "Brief description",
  "body": "Full prompt text with {{variables}}",
  "variables": ["variables"],
  "tags": ["tag1", "tag2"]
}
```

Then rebuild: `npm run build`

### Modifying Platform Support

Edit `src/lib/inject.ts`:

```typescript
export function detectPlatform(): Platform {
  const host = window.location.hostname
  if (host.includes('your-platform.com')) return 'your_platform'
  // ...
}

export async function injectIntoChat(text: string): Promise<boolean> {
  switch (platform) {
    case 'your_platform': {
      // Find the input element
      element = document.querySelector('your-selector')
      break
    }
    // ...
  }
  // ...
}
```

Also update `src/types/index.ts` to add the new platform type.

## Debugging

### Console errors
Open DevTools (`F12`) on any website and check:
- Console tab for JavaScript errors
- Network tab to ensure no network requests
- Elements tab to inspect the sidebar DOM

### Platform detection issues
Run in the console:
```javascript
window.location.hostname  // check which platform you're on
document.querySelector('your-selector')  // check if element exists
```

### Injection not working
1. Verify the selector finds the input element
2. Add a delay before injection (platforms take time to render)
3. Try `console.log()` to debug step-by-step
4. Check if the element needs a different event (input, change, blur, etc.)

## Deployment

### For yourself
1. `npm run build`
2. Load `build/chrome-mv3-prod/` as unpacked extension

### For distribution
1. `npm run build`
2. `npm run package`
3. Share `build/chrome-mv3-prod.zip`
4. Users extract and load as unpacked extension

### To Chrome Web Store
(Future work - requires: privacy policy, screenshots, asset pack)

## Architecture

```
src/
├── contents/sidebar.tsx      # Main React sidebar component
├── popup.tsx                 # Extension popup page
├── styles/sidebar.css        # Minimal scoped styles
├── types/index.ts            # TypeScript definitions
└── lib/
    ├── prompts.json          # 100 prompts with variables
    ├── search.ts             # Fuse.js fuzzy search
    ├── variables.ts          # Parse and substitute {{variables}}
    └── inject.ts             # Platform detection and injection
```

### How it works

1. **Content script injects sidebar** into every website (`sidebar.tsx`)
2. **User searches or selects** a prompt
3. **Sidebar renders variables** and preview
4. **User clicks "Send to chat"** which calls `injectIntoChat()`
5. **Inject function detects platform** and finds the chat input
6. **Text is inserted** using appropriate method (contenteditable or textarea)
7. **Events dispatched** to ensure platform recognizes the input

## Testing

See `TESTING.md` for comprehensive testing guide.

Quick test:
1. `npm run build`
2. Load extension from `build/chrome-mv3-prod/`
3. Visit claude.ai, chat.openai.com, gemini.google.com, or perplexity.ai
4. Open Phrased sidebar, search, fill variables, click Send
5. Prompt should appear in chat

## Performance

- Bundle size: ~0.15 MB (very small)
- All 100 prompts loaded at startup (minimal JSON)
- Fuse.js search is instant (< 10ms for 100 prompts)
- No network requests (100% offline)
- Minimal memory footprint (single iframe-like component)

## Common Issues

### `plasmo build` fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Update plasmo: `npm install plasmo@latest`

### Extension doesn't load
- Make sure you're loading `build/chrome-mv3-prod/` not `build/`
- Enable Developer mode in chrome://extensions
- Check for console errors in DevTools

### Variables not substituting
- Check that prompt JSON has `variables` array
- Verify `{{variable_name}}` matches the array values
- Search.ts and variables.ts handle substitution

## Contributing

To add features:
1. Make changes to source files
2. `npm run dev` to test
3. `npm run build` to verify production build
4. Test on all supported platforms
5. Submit PR with testing notes

## License

MIT — feel free to modify and distribute
