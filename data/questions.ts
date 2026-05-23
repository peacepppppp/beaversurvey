import { Question } from '@/types/survey'

const DIM_ORDER = ['social','occupational','intellectual','environmental','spiritual','financial','emotional','physical']

export const SCENE_GROUPS = [
  { name: 'Quiz', nameEn: 'Quiz', emoji: '🦫', indices: Array.from({ length: 12 }, (_, i) => i) },
]

export function getSceneForIndex(index: number) {
  return SCENE_GROUPS[0]
}

// 12 concise questions. Each choice maps to exactly one wellness dimension and scores +1.
export const QUESTIONS: Question[] = Array.from({ length: 12 }, (_, i) => {
  const id = i + 1
  const dims = [
    DIM_ORDER[i % DIM_ORDER.length],
    DIM_ORDER[(i + 1) % DIM_ORDER.length],
    DIM_ORDER[(i + 2) % DIM_ORDER.length],
    DIM_ORDER[(i + 3) % DIM_ORDER.length],
  ]

  const labels: Record<string,string> = {
    social: 'Connect with others',
    occupational: 'Get things done / work',
    intellectual: 'Learn / think / create',
    environmental: 'Nature / place / setting',
    spiritual: 'Reflect / meaning',
    financial: 'Money / stability',
    emotional: 'Feelings / care',
    physical: 'Move / rest / body',
  }

  return {
    id,
    scene: 'Quiz',
    sceneEn: 'Quiz',
    sceneName: 'Quiz',
    sceneNameEn: 'Quiz',
    sceneEmoji: '🦫',
    timeOfDay: 'midday',
    question: `Question ${id}: Which of these describes you most right now?`,
    choices: [
      { id: `${id}a`, text: labels[dims[0]] ?? dims[0], emoji: '1️⃣', scores: { [dims[0]]: 1 } as any },
      { id: `${id}b`, text: labels[dims[1]] ?? dims[1], emoji: '2️⃣', scores: { [dims[1]]: 1 } as any },
      { id: `${id}c`, text: labels[dims[2]] ?? dims[2], emoji: '3️⃣', scores: { [dims[2]]: 1 } as any },
      { id: `${id}d`, text: labels[dims[3]] ?? dims[3], emoji: '4️⃣', scores: { [dims[3]]: 1 } as any },
    ],
  }
})
