export function parseVariables(body: string): string[] {
  const matches = body.match(/\{\{(\w+)\}\}/g) || []
  const names = matches.map(m => m.replace(/\{\{|\}\}/g, ''))
  return [...new Set(names)]
}

export function substituteVariables(
  body: string,
  values: Record<string, string>
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (match, name) => {
    const val = values[name]
    return val && val.trim() !== '' ? val : match
  })
}

export function formatVarName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
