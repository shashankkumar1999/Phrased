import type { Platform } from '../types'

export function detectPlatform(): Platform {
  const host = window.location.hostname
  if (host.includes('claude.ai')) return 'claude'
  if (host.includes('chat.openai.com') || host.includes('chatgpt.com')) return 'chatgpt'
  if (host.includes('gemini.google.com')) return 'gemini'
  if (host.includes('perplexity.ai')) return 'perplexity'
  return 'unknown'
}

export async function injectIntoChat(text: string): Promise<boolean> {
  const platform = detectPlatform()
  let element: HTMLElement | null = null

  try {
    switch (platform) {
      case 'chatgpt': {
        // Try multiple selectors for ChatGPT - DOM structure varies
        element = document.querySelector('#prompt-textarea') ||
                  document.querySelector('textarea[data-id="root"]') ||
                  document.querySelector('textarea')
        break
      }
      case 'claude': {
        // ProseMirror editor with specific class pattern
        const editorDiv = document.querySelector('[contenteditable="true"]')
        if (editorDiv) {
          element = editorDiv
        }
        break
      }
      case 'gemini': {
        // Gemini uses Quill editor or rich-textarea
        element = document.querySelector('.ql-editor') ||
                  document.querySelector('rich-textarea [contenteditable="true"]') ||
                  document.querySelector('[contenteditable="true"]')
        break
      }
      case 'perplexity': {
        // Perplexity uses textarea, be more specific
        const textareas = document.querySelectorAll('textarea')
        for (const ta of textareas) {
          if (ta.offsetParent !== null) { // visible textarea
            element = ta
            break
          }
        }
        break
      }
      case 'unknown': {
        // Try generic injection for unsupported platforms
        // Search for contenteditable or textarea in order of likelihood
        const contentEditables = document.querySelectorAll('[contenteditable="true"]')
        for (const el of contentEditables) {
          if (el.offsetParent !== null) { // visible
            element = el as HTMLElement
            break
          }
        }

        // Fallback to any visible textarea
        if (!element) {
          const textareas = document.querySelectorAll('textarea')
          for (const ta of textareas) {
            if (ta.offsetParent !== null) { // visible
              element = ta as HTMLElement
              break
            }
          }
        }

        // Last resort: look for input[type="text"]
        if (!element) {
          const inputs = document.querySelectorAll('input[type="text"]')
          for (const input of inputs) {
            if (input.offsetParent !== null) { // visible
              element = input as HTMLElement
              break
            }
          }
        }
        break
      }

      default:
        return false
    }

    if (!element) return false

    try {
      // Delay slightly to avoid race conditions
      await new Promise(r => setTimeout(r, 50))

      element.focus()

      if (element.getAttribute('contenteditable') === 'true') {
        // contenteditable element (Claude, Gemini)
        const selection = window.getSelection()
        if (selection) {
          selection.selectAllChildren(element)
          selection.collapseToEnd()
        }
        document.execCommand('insertText', false, text)
        element.dispatchEvent(new Event('input', { bubbles: true }))
        element.dispatchEvent(new Event('change', { bubbles: true }))
        return true
      }

      if (element instanceof HTMLTextAreaElement) {
        // textarea element (ChatGPT, Perplexity)
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(element, text)
          element.dispatchEvent(new Event('input', { bubbles: true }))
          element.dispatchEvent(new Event('change', { bubbles: true }))
          // Some platforms need more events
          element.dispatchEvent(new Event('blur', { bubbles: true }))
          return true
        }
      }

      return false
    } catch {
      return false
    }
  } catch {
    return false
  }
}
