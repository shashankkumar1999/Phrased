import Fuse from 'fuse.js'
import type { Prompt } from '../types'

export function createSearchIndex(prompts: Prompt[]): Fuse<Prompt> {
  return new Fuse(prompts, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'tags', weight: 2 },
      { name: 'description', weight: 1.5 },
      { name: 'category', weight: 1 },
      { name: 'variables', weight: 1 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  })
}

export function searchPrompts(
  index: Fuse<Prompt>,
  query: string,
  prompts: Prompt[]
): Prompt[] {
  if (!query || query.trim() === '') return prompts
  return index.search(query).map(result => result.item)
}
