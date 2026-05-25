# "Try Inject" Feature — Using Phrased on Any AI Platform

## Overview

Phrased now includes a **"Try Inject" button** that appears when you visit an unsupported AI platform. This allows you to attempt injection on any website with a chat interface, even if Phrased doesn't officially support it.

## When Does "Try Inject" Appear?

The **"Try Inject"** button appears in the category pills section when:
- You're on a website that Phrased doesn't officially recognize
- The platform detection identifies your site as "unknown"
- Examples: Canva AI, custom AI tools, experimental platforms, etc.

**It does NOT appear on officially supported platforms** (Claude, ChatGPT, Gemini, Perplexity) — those use their own optimized injection methods.

## How to Use

### Basic Usage
1. Open Phrased on any unsupported AI platform
2. Click the **"Try Inject"** button (appears in the pill buttons row)
3. The button turns orange when enabled
4. Header shows "Try Inject Mode"
5. The **"Send to chat"** button now appears in the variable panel
6. Fill in your variables and click "Send to chat"

### What Happens
When you click "Send to chat" in Try Inject Mode:
1. Phrased searches for an input element (contenteditable, textarea, or text input)
2. It finds the first visible input it can access
3. It inserts your prompt text
4. It dispatches appropriate events so the platform recognizes the input

### Success Cases
Try Inject works best with:
- ✅ Websites with `contenteditable` editors (rich text)
- ✅ Websites with `<textarea>` elements
- ✅ Websites with `<input type="text">` fields
- ✅ Most chat interfaces
- ✅ Most AI platforms with visible text inputs

### When It Might Fail
Try Inject may not work on:
- ❌ Websites using custom UI frameworks (Vue, Svelte with complex bindings)
- ❌ Websites with heavy DOM obfuscation
- ❌ WebAssembly-based inputs
- ❌ Websites that require specific click sequences
- ❌ Blocked extensions (if the website specifically blocks extension access)

## Fallback: Copy Mode

If "Send to chat" doesn't work:
1. Use the **"Copy prompt"** button instead (always works)
2. The text is copied to your clipboard
3. Manually paste it into the chat (`Ctrl+V` or `Cmd+V`)
4. This works on literally any website

## Examples of Unsupported Platforms

Phrased is optimized for:
- Claude.ai ✅
- ChatGPT ✅
- Gemini ✅
- Perplexity ✅

But you can try injection on:
- Canva AI
- Hugging Face Chat
- Custom chatbot implementations
- Emerging AI platforms
- Your own AI tools
- Any site with a chat input

## Technical Details

### Injection Strategy (Unknown Platforms)

When you click "Send to chat" on an unsupported platform, Phrased tries in this order:

1. **Contenteditable elements** — looks for visible `[contenteditable="true"]` divs
   - Used by: Claude, Gemini, many modern web apps
   - Method: `document.execCommand('insertText')`

2. **Textarea elements** — looks for visible `<textarea>` elements
   - Used by: ChatGPT, Perplexity, many legacy forms
   - Method: Sets `.value` and dispatches `input` + `change` events

3. **Text input elements** — looks for visible `<input type="text">` fields
   - Used by: Simple forms, basic chat interfaces
   - Method: Sets `.value` and dispatches `input` + `change` events

### Visibility Detection

Phrased only injects into **visible** elements:
- Checks `offsetParent !== null` to ensure the element is actually displayed
- Prevents injecting into hidden inputs or debug fields
- Improves success rate by targeting the user-facing input

### Event Dispatching

After inserting text, Phrased dispatches:
- `input` event (so JavaScript listeners detect the change)
- `change` event (for form elements)
- `blur` event (for platforms that update on unfocus)

## Troubleshooting

### "Send to chat" does nothing
- Try **Copy** instead and paste manually
- The website might not have an accessible text input
- The platform might block extension access

### Text appears but platform doesn't process it
- Reload the page and try again
- The platform might require a specific interaction (Enter key)
- Try manually pressing Enter after injection

### Injection works but text isn't formatted correctly
- Some platforms expect specific formatting
- Try the **Copy** button and paste manually instead
- The website might have custom input validation

### "Try Inject" button doesn't appear
- You're on an officially supported platform (Claude, ChatGPT, Gemini, Perplexity)
- Reload the page — platform detection happens on page load
- Phrased correctly identified your platform

## Tips for Best Results

1. **Reload the page first** — Phrased detects platforms on page load
2. **Click in the chat area first** — Some platforms require the input to be focused
3. **Use Copy if Inject fails** — Copy always works, inject is best-effort
4. **Check visibility** — Make sure the input field is visible on screen
5. **Try simple prompts first** — Test with a prompt that has no variables

## Privacy & Security

- Try Inject uses the same privacy model as regular injection
- No data is sent to Phrased servers
- Nothing is logged or tracked
- It's completely local to your browser

## Platform Optimization

For officially supported platforms, Phrased uses:
- **Claude**: Optimized ProseMirror injection
- **ChatGPT**: Multiple selector fallbacks
- **Gemini**: Quill editor + rich-textarea detection
- **Perplexity**: Visible textarea detection

These are more reliable than the generic Try Inject because we know the exact DOM structure.

## Future Support

If you find a platform where Try Inject works consistently, let us know! We might add official support for it:
- Email: helpkeepit@gmail.com
- Include: Platform name, URL, and whether injection worked

## Examples

### Example 1: Canva AI
1. Go to Canva AI
2. Phrased shows "unknown platform"
3. Click **"Try Inject"** (button appears in category pills)
4. Select a prompt and fill variables
5. Click **"Send to chat"**
6. If it works: prompt appears in Canva's chat
7. If it doesn't: use **Copy** and paste manually

### Example 2: Custom Chatbot
1. Go to your custom AI chatbot
2. Click **"Try Inject"**
3. If the chatbot has a visible `<textarea>`:
   - Injection likely works
4. If it doesn't work:
   - Use **Copy** instead
   - Phrased still works, just requires manual pasting

### Example 3: Unsupported AI Platform
1. Go to a new AI platform (e.g., Anthropic's new Claude Chat, OpenAI's new interface)
2. No "Try Inject" button appears initially
3. Use **Copy** to copy prompts
4. Once we add official support, "Try Inject" won't be needed

## Summary

**Try Inject** = Best-effort injection on any platform
**Copy** = Always works, universal fallback

Use **Try Inject** to see if injection works on your platform. If it doesn't, **Copy** always works by pasting manually.

---

**Want official support for your platform?** Let us know at helpkeepit@gmail.com with the platform name and URL!
