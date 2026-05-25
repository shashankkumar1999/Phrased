import type { PlasmoCSConfig } from "plasmo"
import { useState, useMemo, useRef, useEffect } from "react"
import promptsData from "../lib/prompts.json"
import { createSearchIndex, searchPrompts } from "../lib/search"
import { substituteVariables, formatVarName } from "../lib/variables"
import { detectPlatform, injectIntoChat } from "../lib/inject"
import type { Prompt, Category, VariableValues } from "../types"

// Inject on all websites — inject button only appears on supported AI platforms
export const config: PlasmoCSConfig = {
  matches: ["https://*/*", "http://*/*"],
  css: ["../styles/sidebar.css"]
}

// Mount to document.body with error handling for strict CSP contexts
export const getMountPoint = async () => {
  // Add a small delay to ensure page is fully loaded
  await new Promise(r => setTimeout(r, 150))

  try {
    // Try body first (safer for React apps like ChatGPT)
    const el = document.createElement("div")
    el.id = "phrased-root"
    document.body.appendChild(el)
    return el
  } catch (err) {
    // Fallback to html if body fails
    const el = document.createElement("div")
    el.id = "phrased-root"
    document.documentElement.appendChild(el)
    return el
  }
}

const CATEGORIES: Category[] = [
  "Career: Resume & Applications",
  "Career: Interviews",
  "Career: Job Search",
  "Career: On the Job",
  "Career: Transitions",
  "Workplace: Email Basics",
  "Workplace: Meetings & Updates",
  "Workplace: Management",
  "Workplace: Negotiations",
  "Workplace: Relationships",
  "Workplace: Communications",
  "Technical: Code Help",
  "Technical: Code Writing",
  "Technical: Learning",
  "Technical: Architecture",
  "Content: Marketing",
  "Content: Blog",
  "Content: Web",
  "Content: Email",
  "Content: Video",
  "Content: Social Media",
  "Content: Strategy",
  "Analysis: Business",
  "Analysis: Decision Making",
  "Analysis: Problem Solving",
  "Analysis: Critical Thinking",
  "Analysis: Organization",
  "Analysis: Strategic",
  "Analysis: Risk Management",
  "Analysis: Data",
  "Analysis: Research",
  "Analysis: Learning",
  "Planning: Launch",
  "Sales: Techniques",
]

const prompts = promptsData as Prompt[]

// ─── Variable Panel ───────────────────────────────────────────────────────────

// Dark theme SVG logo
const PHRASED_LOGO = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
    <path d="M7 12.5h10v1H7z" fill="currentColor"/>
    <path d="M7 9.5h6v1H7z" fill="currentColor"/>
    <path d="M7 15.5h8v1H7z" fill="currentColor"/>
  </svg>
)

function VariablePanel({
  prompt,
  values,
  onChange,
  onClear,
  onCopy,
  onInject,
  copiedState,
  injectedState,
  injectFailed,
  showInject,
}: {
  prompt: Prompt
  values: VariableValues
  onChange: (name: string, val: string) => void
  onClear: () => void
  onCopy: () => void
  onInject: () => void
  copiedState: boolean
  injectedState: boolean
  injectFailed: boolean
  showInject: boolean
}) {
  // Prevent focus from escaping to host page (fixes Claude focus jump issue)
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Tab') {
      e.preventDefault()
      const form = (e.currentTarget as HTMLElement).closest('form') || (e.currentTarget as HTMLElement).parentElement
      if (!form) return
      const focusableElements = Array.from(
        form.querySelectorAll('input, textarea, button')
      ) as HTMLElement[]
      const currentIndex = focusableElements.indexOf(e.currentTarget as HTMLElement)
      const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1
      const nextElement = focusableElements[nextIndex % focusableElements.length]
      nextElement?.focus()
    }
  }
  const previewBody = useMemo(() => {
    return prompt.body.split(/(\{\{\w+\}\})/).map((part, i) => {
      const match = part.match(/\{\{(\w+)\}\}/)
      if (!match) return <span key={i}>{part}</span>
      const name = match[1]
      const val = values[name]
      if (val && val.trim() !== "") {
        return (
          <span
            key={i}
            style={{
              background: "#ff8c42",
              color: "#0f0f1e",
              borderRadius: 3,
              padding: "0 3px",
              fontWeight: 500,
            }}
          >
            {val}
          </span>
        )
      }
      return (
        <span key={i} style={{ color: "#ffa500", fontStyle: "italic", opacity: 0.7 }}>
          {part}
        </span>
      )
    })
  }, [prompt.body, values])

  const isLongVar = (name: string) =>
    [
      "content", "text", "notes", "snippet", "description", "feedback",
      "achievements", "background", "code", "pseudocode", "data", "body",
      "excerpt", "quote", "summary", "reason", "message", "context",
    ].some((k) => name.includes(k))

  const filledCount = prompt.variables.filter(
    (v) => values[v] && values[v].trim() !== ""
  ).length

  return (
    <div
      style={{
        background: "#1a1a2e",
        borderRadius: 10,
        border: "1px solid #2a2a3e",
        padding: "14px",
        marginBottom: 8,
        marginTop: 2,
      }}
    >
      {prompt.variables.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#ff8c42",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Variables — {filledCount}/{prompt.variables.length} filled
            </div>
            <button
              onClick={onClear}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                color: "#808090",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Clear all
            </button>
          </div>

          {prompt.variables.map((name) => (
            <div key={name} style={{ marginBottom: 8 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#e0e0e0",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      values[name] && values[name].trim() !== ""
                        ? "#10b981"
                        : "#444454",
                    flexShrink: 0,
                  }}
                />
                {formatVarName(name)}
              </label>
              {isLongVar(name) ? (
                <textarea
                  rows={3}
                  placeholder={`Enter ${formatVarName(name).toLowerCase()}…`}
                  value={values[name] || ""}
                  onChange={(e) => onChange(name, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1.5px solid #2a2a3e",
                    borderRadius: 6,
                    fontSize: 12,
                    background: "#0f0f1e",
                    color: "#ffffff",
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#ff8c42"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a3e"
                  }}
                  onKeyDown={handleInputKeyDown as any}
                />
              ) : (
                <input
                  type="text"
                  placeholder={`Enter ${formatVarName(name).toLowerCase()}…`}
                  value={values[name] || ""}
                  onChange={(e) => onChange(name, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1.5px solid #2a2a3e",
                    borderRadius: 6,
                    fontSize: 12,
                    background: "#0f0f1e",
                    color: "#ffffff",
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#ff8c42"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a3e"
                  }}
                  onKeyDown={handleInputKeyDown as any}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#a0a0b0",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}
        >
          Preview
        </div>
        <div
          style={{
            background: "#0f0f1e",
            border: "1px solid #2a2a3e",
            borderRadius: 6,
            padding: "10px 12px",
            fontSize: 12,
            color: "#c0c0c0",
            lineHeight: 1.65,
            maxHeight: 160,
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {previewBody}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onCopy}
          style={{
            flex: 1,
            padding: "9px 12px",
            background: copiedState
              ? "#10b981"
              : "#ff8c42",
            color: copiedState ? "white" : "#0f0f1e",
            border: "none",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
            boxShadow: copiedState ? "none" : "0 2px 8px rgba(255,140,66,0.35)",
          }}
        >
          {copiedState ? "✓ Copied!" : "Copy prompt"}
        </button>

        {showInject && (
          <button
            onClick={onInject}
            style={{
              flex: 1,
              padding: "9px 12px",
              background: injectedState
                ? "#10b981"
                : injectFailed
                ? "#3a2a2a"
                : "#1a1a2e",
              color: injectedState
                ? "white"
                : injectFailed
                ? "#ff6b6b"
                : "#ff8c42",
              border: `1.5px solid ${
                injectedState
                  ? "#10b981"
                  : injectFailed
                  ? "#ff6b6b"
                  : "#ff8c42"
              }`,
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {injectedState
              ? "✓ Sent to chat!"
              : injectFailed
              ? "Copy instead ↑"
              : "Send to chat ↑"}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function PhrasedSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [variableValues, setVariableValues] = useState<VariableValues>({})
  const [copiedState, setCopiedState] = useState(false)
  const [injectedState, setInjectedState] = useState(false)
  const [injectFailed, setInjectFailed] = useState(false)
  const [forceOtherAI, setForceOtherAI] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const platform = detectPlatform()
  const fuseIndex = useMemo(() => createSearchIndex(prompts), [])

  // Search results: both categories and prompts matching the query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null

    const matchedPrompts = searchPrompts(fuseIndex, searchQuery, prompts)
    const matchedCategories = CATEGORIES.filter(cat =>
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return { categories: matchedCategories, prompts: matchedPrompts }
  }, [searchQuery, fuseIndex])

  // Prompts for the selected category (in stage 2)
  const categoryPrompts = useMemo(() => {
    if (!activeCategory) return []
    return prompts.filter(p => p.category === activeCategory)
  }, [activeCategory])

  // Check if on main platform and listen for show-sidebar message
  useEffect(() => {
    try {
      // Note: ChatGPT excluded due to CSP/security restrictions
      // Users can use copy-paste mode via "Use on this page" button
      const mainPlatforms = ['claude', 'gemini', 'perplexity']
      const isMainPlatform = mainPlatforms.includes(platform)
      setShouldRender(isMainPlatform)

      const handleMessage = (message: any) => {
        try {
          if (message.action === 'show-sidebar') {
            setShouldRender(true)
            setIsOpen(true)
          }
        } catch (e) {
          console.error('[Phrased] Error handling message:', e)
        }
      }

      chrome.runtime.onMessage.addListener(handleMessage)
      return () => chrome.runtime.onMessage.removeListener(handleMessage)
    } catch (e) {
      console.error('[Phrased] Error in useEffect:', e)
    }
  }, [platform])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 80)
    }
  }, [isOpen])

  const handleSelectPrompt = (prompt: Prompt) => {
    if (selectedPrompt?.id === prompt.id) {
      setSelectedPrompt(null)
      setVariableValues({})
    } else {
      setSelectedPrompt(prompt)
      setVariableValues({})
    }
  }

  const handleCopy = async () => {
    if (!selectedPrompt) return
    const text = substituteVariables(selectedPrompt.body, variableValues)
    await navigator.clipboard.writeText(text)
    setCopiedState(true)
    setTimeout(() => setCopiedState(false), 2000)
  }

  const handleInject = async () => {
    if (!selectedPrompt) return
    const text = substituteVariables(selectedPrompt.body, variableValues)
    const success = await injectIntoChat(text)
    if (success) {
      setInjectedState(true)
      setTimeout(() => setInjectedState(false), 2000)
    } else {
      setInjectFailed(true)
      setTimeout(() => setInjectFailed(false), 3000)
    }
  }

  const categoryShortName = (cat: Category) => cat.split(" & ")[0]

  const platformLabel =
    forceOtherAI && platform === "unknown"
      ? "Try Inject Mode"
      : platform === "claude"
      ? "Claude"
      : platform === "chatgpt"
      ? "ChatGPT"
      : platform === "gemini"
      ? "Gemini"
      : platform === "perplexity"
      ? "Perplexity"
      : null

  // Root: always fixed full-height, flex row, pointer-events:none so it never
  // blocks page interactions when the sidebar is closed.
  // Tab button + panel are the only pointer-events:auto children.
  // Mounted into <html> (not <body>) via getMountPoint above, which prevents
  // position:fixed from being broken by body-level CSS transforms.
  // Don't render on non-main platforms unless explicitly shown

  if (!shouldRender) return null

  return (
    <div
      id="phrased-sidebar-root"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        pointerEvents: "none",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* ── Tab button — always visible at right edge ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        style={{
          pointerEvents: "auto",
          alignSelf: "center",
          background: isOpen
            ? "#ff8c42"
            : "linear-gradient(180deg, #ff8c42 0%, #ffa500 100%)",
          color: isOpen ? "#0f0f1e" : "white",
          border: "none",
          borderRadius: isOpen ? "8px 0 0 8px" : "8px 0 0 8px",
          padding: "16px 9px",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          writingMode: "vertical-rl",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          boxShadow: isOpen
            ? "none"
            : "-3px 0 16px rgba(255,140,66,0.45)",
          flexShrink: 0,
          transition: "background 0.15s, box-shadow 0.15s, color 0.15s",
          userSelect: "none",
        }}
        title={isOpen ? "Close Phrased" : "Open Phrased prompt library"}
      >
        {isOpen ? "✕" : "Phrased"}
      </button>

      {/* ── Sidebar panel ── */}
      {isOpen && (
        <div
          style={{
            width: 340,
            height: "100vh",
            alignSelf: "stretch",
            background: "#0f0f1e",
            boxShadow: "-12px 0 48px rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            pointerEvents: "auto",
            borderLeft: "1px solid #2a2a3e",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #ff8c42 0%, #ffa500 100%)",
              padding: "14px 16px 12px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#0f0f1e", display: "flex", alignItems: "center" }}>
                  {PHRASED_LOGO}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 17,
                      color: "#0f0f1e",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Phrased
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(15,15,30,0.7)",
                      marginTop: 1,
                    }}
                  >
                    {platformLabel
                      ? `${platformLabel} · inject + copy`
                      : "Copy-paste mode · works everywhere"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div
            style={{
              padding: "12px 12px",
              background: "#0f0f1e",
              flexShrink: 0,
              borderBottom: "1px solid #1a1a2e",
            }}
          >
            <div style={{ position: "relative", display: "flex" }}>
              <svg
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#808090",
                  pointerEvents: "none",
                }}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search categories or prompts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 38px",
                  border: "1.5px solid #2a2a3e",
                  borderRadius: 8,
                  fontSize: 13,
                  background: "#1a1a2e",
                  color: "#ffffff",
                  outline: "none",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff8c42"
                  e.currentTarget.style.background = "#252535"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a3e"
                  e.currentTarget.style.background = "#1a1a2e"
                }}
                onKeyDown={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedPrompt(null)
                  }}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#808090",
                    fontSize: 16,
                    padding: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Content: Categories, Search Results, or Prompts */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              padding: "0 8px 16px",
            }}
          >
            {/* VIEW: Unified Search Results */}
            {searchQuery && searchResults ? (
              <>
                {/* Search Result Categories */}
                {searchResults.categories.length > 0 && (
                  <>
                    <div
                      style={{
                        padding: "12px 8px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ff8c42",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Categories
                    </div>
                    {searchResults.categories.map((cat) => {
                      const count = prompts.filter(p => p.category === cat).length
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat)
                            setSearchQuery("")
                            setSelectedPrompt(null)
                          }}
                          style={{
                            padding: "12px",
                            background: "#1a1a2e",
                            border: "1.5px solid #2a2a3e",
                            borderRadius: 8,
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            textAlign: "left",
                            marginBottom: 6,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#ff8c42"
                            e.currentTarget.style.background = "#252535"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#2a2a3e"
                            e.currentTarget.style.background = "#1a1a2e"
                          }}
                        >
                          <span>{cat}</span>
                          <span style={{ fontSize: 11, color: "#808090" }}>{count}</span>
                        </button>
                      )
                    })}
                  </>
                )}

                {/* Search Result Prompts */}
                {searchResults.prompts.length > 0 && (
                  <>
                    {searchResults.categories.length > 0 && (
                      <div style={{ height: 1, background: "#1a1a2e", margin: "12px 0", flexShrink: 0 }} />
                    )}
                    <div
                      style={{
                        padding: "12px 8px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ff8c42",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Prompts
                    </div>
                    {searchResults.prompts.map((prompt) => (
                      <div key={prompt.id}>
                        <div
                          onClick={() => {
                            setSelectedPrompt(prompt)
                            setActiveCategory(prompt.category as Category)
                          }}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            marginBottom: 6,
                            background:
                              selectedPrompt?.id === prompt.id ? "rgba(255,140,66,0.1)" : "transparent",
                            border:
                              selectedPrompt?.id === prompt.id
                                ? "1.5px solid #ff8c42"
                                : "1.5px solid transparent",
                            transition: "background 0.1s, border-color 0.1s",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPrompt?.id !== prompt.id) {
                              ;(e.currentTarget as HTMLElement).style.background = "#1a1a2e"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPrompt?.id !== prompt.id) {
                              ;(e.currentTarget as HTMLElement).style.background = "transparent"
                            }
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#ffffff", marginBottom: 4 }}>
                            {prompt.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#808090", marginBottom: 4 }}>
                            {prompt.category}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#a0a0b0",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {prompt.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* No results */}
                {searchResults.categories.length === 0 && searchResults.prompts.length === 0 && (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: "#808090",
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#e0e0e0", marginBottom: 6 }}>
                      No results found
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                      Try searching for "email", "debug", "resume", or a category name
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* VIEW: Category Grid (when no search) */}
                {!activeCategory ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      padding: "12px 0",
                    }}
                  >
                    {CATEGORIES.map((cat) => {
                      const count = prompts.filter(p => p.category === cat).length
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat)
                            setSelectedPrompt(null)
                          }}
                          style={{
                            padding: "12px",
                            background: "#1a1a2e",
                            border: "1.5px solid #2a2a3e",
                            borderRadius: 10,
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#ff8c42"
                            e.currentTarget.style.background = "#252535"
                            e.currentTarget.style.transform = "translateY(-2px)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#2a2a3e"
                            e.currentTarget.style.background = "#1a1a2e"
                            e.currentTarget.style.transform = "translateY(0)"
                          }}
                        >
                          <span style={{ fontWeight: 600, color: "#ff8c42" }}>{cat}</span>
                          <span style={{ fontSize: 11, color: "#808090" }}>{count} prompt{count !== 1 ? 's' : ''}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <>
                    {/* VIEW: Prompts in Category */}
                    <div
                      style={{
                        padding: "12px 8px 0",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <button
                        onClick={() => {
                          setActiveCategory(null)
                          setSelectedPrompt(null)
                        }}
                        style={{
                          padding: "9px 10px",
                          border: "1.5px solid #2a2a3e",
                          borderRadius: 8,
                          background: "#1a1a2e",
                          color: "#ff8c42",
                          cursor: "pointer",
                          fontSize: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          width: 36,
                          height: 36,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff8c42"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#2a2a3e"
                        }}
                        title="Back to categories"
                      >
                        ←
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffff" }}>
                          {activeCategory}
                        </div>
                        <div style={{ fontSize: 11, color: "#808090" }}>
                          {categoryPrompts.length} prompt{categoryPrompts.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Prompt list for this category */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                      {categoryPrompts.length === 0 ? (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#808090" }}>
                          <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                          No prompts in this category
                        </div>
                      ) : (
                        categoryPrompts.map((prompt) => (
                          <div key={prompt.id}>
                            <div
                              onClick={() => handleSelectPrompt(prompt)}
                              style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                cursor: "pointer",
                                marginBottom: 6,
                                background:
                                  selectedPrompt?.id === prompt.id ? "rgba(255,140,66,0.1)" : "transparent",
                                border:
                                  selectedPrompt?.id === prompt.id
                                    ? "1.5px solid #ff8c42"
                                    : "1.5px solid transparent",
                                transition: "background 0.1s, border-color 0.1s",
                              }}
                              onMouseEnter={(e) => {
                                if (selectedPrompt?.id !== prompt.id) {
                                  ;(e.currentTarget as HTMLElement).style.background = "#1a1a2e"
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedPrompt?.id !== prompt.id) {
                                  ;(e.currentTarget as HTMLElement).style.background = "transparent"
                                }
                              }}
                            >
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#ffffff", marginBottom: 2 }}>
                                {prompt.title}
                              </div>
                              <div style={{ fontSize: 11, color: "#808090", marginBottom: 4 }}>
                                {prompt.variables.length} var{prompt.variables.length !== 1 ? 's' : ''}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#a0a0b0",
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {prompt.description}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Variable Panel - shown when a prompt is selected */}
          {selectedPrompt && (
            <div
              style={{
                borderTop: "1px solid #2a2a3e",
                padding: "12px 12px",
                background: "#0f0f1e",
                flexShrink: 0,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <VariablePanel
                prompt={selectedPrompt}
                values={variableValues}
                onChange={(name, val) =>
                  setVariableValues((prev) => ({ ...prev, [name]: val }))
                }
                onClear={() => setVariableValues({})}
                onCopy={handleCopy}
                onInject={handleInject}
                copiedState={copiedState}
                injectedState={injectedState}
                injectFailed={injectFailed}
                showInject={platformLabel !== null}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
