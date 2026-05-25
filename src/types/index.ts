export type Category =
  | 'Writing & Email'
  | 'Coding & Technical'
  | 'Career & Job Search'
  | 'Analysis & Research'
  | 'Marketing & Content'

export interface Prompt {
  id: string
  title: string
  category: Category
  description: string
  body: string
  variables: string[]
  tags: string[]
}

export interface VariableValues {
  [key: string]: string
}

export type Platform =
  | 'claude'
  | 'chatgpt'
  | 'gemini'
  | 'perplexity'
  | 'unknown'
