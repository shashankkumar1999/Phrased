# Phrased Extension — Testing Guide

## Build & Installation

### Installation Steps

1. **Download the extension**:
   - The packaged file is at `build/chrome-mv3-prod.zip`
   
2. **Extract the zip**:
   - Extract to a folder (e.g., `phrased-extension`)

3. **Load into Chrome**:
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the extracted `build/chrome-mv3-prod/` folder
   - The Phrased extension should now appear in your extensions

4. **Verify Installation**:
   - You should see the orange "Phrased" tab on the right edge of any website
   - Visit one of the supported platforms to enable inject functionality

## Testing Checklist

### UI/UX Testing
- [ ] Dark theme renders correctly on all platforms
- [ ] Orange header with logo is visible and stylish
- [ ] Tab button shows "Phrased" when closed, "✕" when open
- [ ] Sidebar animates smoothly when opening/closing
- [ ] Search input is responsive and shows orange focus border
- [ ] Category pills highlight in orange when selected
- [ ] Prompt cards show correct hover states (dark background)
- [ ] Variable inputs have proper styling (dark with orange border on focus)
- [ ] Preview shows substituted variables with orange highlighting
- [ ] Copy and Send buttons show proper states (orange, green on success)

### Search & Navigation
- [ ] Search works with fuzzy matching (try: "email", "debug", "resume")
- [ ] Search results update in real-time
- [ ] Clear button (✕) appears and clears search
- [ ] Category filter buttons work correctly
- [ ] "All" button resets category filter
- [ ] Result count updates correctly
- [ ] Clicking a prompt expands it and shows variable panel

### Variable System
- [ ] Variables render correctly in variable input section
- [ ] Variable labels show proper formatting (Title Case)
- [ ] Input/textarea styling matches variable type
- [ ] Filled variables show green dot indicator
- [ ] Preview shows substituted values with orange background
- [ ] Unfilled variables show orange placeholders in preview
- [ ] "Clear all" button clears all variable values
- [ ] Focus trap prevents jumping to host page chat input
- [ ] Tab key cycles through variables within sidebar

### Copy & Inject Testing

#### Claude
- [ ] Platform detected correctly (shows "Claude · inject + copy")
- [ ] Variables can be typed without focus jumping to chat
- [ ] Copy button copies full substituted prompt
- [ ] Send button injects prompt into Claude's chat
- [ ] Chat shows injected text correctly
- [ ] No typing interference when filling variables

#### ChatGPT
- [ ] Platform detected correctly (shows "ChatGPT · inject + copy")
- [ ] Extension loads and doesn't disappear
- [ ] Copy button works
- [ ] Send button injects into ChatGPT's textarea
- [ ] ChatGPT recognizes injected text

#### Gemini
- [ ] Platform detected correctly (shows "Gemini · inject + copy")
- [ ] Copy button works
- [ ] Send button injects into Gemini's editor
- [ ] Gemini shows injected text correctly

#### Perplexity
- [ ] Platform detected correctly (shows "Perplexity · inject + copy")
- [ ] Copy button works
- [ ] Send button injects into Perplexity's search
- [ ] Perplexity processes injected prompt

#### Copy-Paste Mode (Unknown Platforms)
- [ ] Shows "Copy-paste mode · works everywhere"
- [ ] Send button is hidden
- [ ] Copy button still works for manual pasting

### Cross-Browser Testing
- [ ] Works on Chrome (all platforms)
- [ ] Works on Chrome-based browsers (Edge, Brave)
- [ ] Extension icon is visible in extension bar
- [ ] No console errors on any platform

### Performance
- [ ] Search completes instantly (fuse.js fuzzy)
- [ ] Sidebar opens/closes without lag
- [ ] No memory leaks when opening/closing repeatedly
- [ ] Bundle size under 200KB (currently 0.15 MB)

### Edge Cases
- [ ] Very long prompt text scrolls properly in preview
- [ ] Empty search returns no results gracefully
- [ ] Sidebar can be toggled rapidly without issues
- [ ] Multiple refreshes don't break extension
- [ ] Extension works with dark mode web pages (good contrast)

## Test Scenarios

### Scenario 1: Claude Email Writing
1. Go to Claude.ai
2. Open Phrased sidebar
3. Search for "email"
4. Select "Cold Outreach Email"
5. Fill in: Recipient, Company, Product, Value Proposition
6. Check preview shows all substitutions
7. Click "Send to chat"
8. Verify email appears in Claude chat
9. Claude should be able to use the email immediately

### Scenario 2: ChatGPT Code Debugging
1. Go to ChatGPT
2. Open Phrased sidebar
3. Search for "debug"
4. Select "Debug Error Message"
5. Fill in: Error Message, Code Context
6. Click "Send to chat"
7. ChatGPT should debug your error

### Scenario 3: Gemini Market Analysis
1. Go to Gemini
2. Search for "analysis" or "SWOT"
3. Select a prompt
4. Fill variables
5. Send to chat

### Scenario 4: Perplexity Research
1. Go to Perplexity
2. Search for "research"
3. Select research prompt
4. Fill variables
5. Send to search
6. Should perform analysis

### Scenario 5: Unknown Platform (Copy-Paste)
1. Visit a site without direct chat injection (e.g., Hugging Face)
2. Open Phrased
3. Select a prompt and fill variables
4. Copy to clipboard
5. Manually paste into chat
6. Should work correctly

## Debug Checklist

If issues occur:

- [ ] Open Chrome DevTools (F12) and check Console for errors
- [ ] Check if sidebar loads at all (red "Phrased" tab visible)
- [ ] Verify platform detection: open console and type `window.location.hostname`
- [ ] Check if chat input exists: use DevTools inspector to find the input element
- [ ] Try copy button first (simpler than inject)
- [ ] Check if variables are being substituted (preview should show them)
- [ ] Test on fresh browser session (no conflicting extensions)

## Known Limitations

- Extension works on Claude.ai, ChatGPT, Gemini, Perplexity, and any site via copy-paste
- Some dynamic websites may require slight delays for element detection
- Shadow DOM elements may not be accessible on some sites
- Variable substitution is text-based (doesn't understand semantic placeholders)

## Deployment Checklist

Before shipping:
- [ ] All tests pass
- [ ] No console errors
- [ ] Dark theme matches design spec
- [ ] Logo appears correctly in header
- [ ] All 100 prompts load successfully
- [ ] Privacy policy accurate
- [ ] No data collection enabled
- [ ] Extension icon visible and clickable
- [ ] Zero network requests (all local)
