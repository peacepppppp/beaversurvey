import { Question } from '@/types/survey'

// Q2–Q21 (Q1 is the KKU gate handled in onboarding)
// Scene groups:
//   Scene 1 ตื่นเช้า    : indices 0–3  (Q2–Q5)
//   Scene 2 สร้างเขื่อน : indices 4–7  (Q6–Q9)
//   Scene 3 ช่วงพัก     : indices 8–11 (Q10–Q13)
//   Scene 4 บ่ายแก่ๆ   : indices 12–15 (Q14–Q17)
//   Scene 5 คืนนี้      : indices 16–19 (Q18–Q21) ← rain background

export const SCENE_GROUPS = [
  { name: 'ตื่นเช้า',     nameEn: 'Morning',          emoji: '🌅', indices: [0, 1, 2, 3] },
  { name: 'สร้างเขื่อน', nameEn: 'Building the Dam', emoji: '🏗️', indices: [4, 5, 6, 7] },
  { name: 'ช่วงพัก',      nameEn: 'Break Time',        emoji: '☕', indices: [8, 9, 10, 11] },
  { name: 'บ่ายแก่ๆ',    nameEn: 'Late Afternoon',    emoji: '🌦️', indices: [12, 13, 14, 15] },
  { name: 'คืนนี้',       nameEn: 'Tonight',           emoji: '🌧️', indices: [16, 17, 18, 19] },
]

export function getSceneForIndex(index: number) {
  return SCENE_GROUPS.find((g) => g.indices.includes(index)) ?? SCENE_GROUPS[0]
}

export const QUESTIONS: Question[] = [
  // ══════════════════════════════════════════════════
  // SCENE 1: ตื่นเช้า (Q2–Q5)
  // ══════════════════════════════════════════════════
  {
    id: 2,
    scene: 'ตื่นเช้า',
    sceneEn: 'Morning',
    sceneName: 'ตื่นเช้า',
    sceneNameEn: 'Morning',
    sceneEmoji: '🌅',
    timeOfDay: 'morning',
    question: 'เช้าของวันแรก ฝนเริ่มโปรยปราย อาณานิคมคึกคัก บีเวอร์ตัวแรกที่เดินมาหาคุณบอกว่า "เขื่อนต้องเสร็จใน 7 วันนะ!" คุณรู้สึกยังไง?',
    choices: [
      {
        id: '2a',
        text: 'โอเค งานเยอะแต่มันท้าทายดี',
        emoji: '💪',
        scores: { occupational: 3, physical: 2 },
      },
      {
        id: '2b',
        text: 'อยากรู้ก่อนว่าใครทำอะไรบ้าง แบ่งงานดีกว่า',
        emoji: '📋',
        scores: { social: 3, occupational: 2 },
      },
      {
        id: '2c',
        text: 'ขอกาแฟก่อนนะ ตื่นมายังไม่ทันได้คิดเลย',
        emoji: '☕',
        scores: { physical: 2, emotional: 2 },
      },
      {
        id: '2d',
        text: 'เริ่มนับในใจแล้วว่าถ้าทำวันละเท่านี้ จะเสร็จทันไหม',
        emoji: '🧮',
        scores: { intellectual: 3, financial: 2 },
      },
    ],
  },
  {
    id: 3,
    scene: 'ตื่นเช้า',
    sceneEn: 'Morning',
    sceneName: 'ตื่นเช้า',
    sceneNameEn: 'Morning',
    sceneEmoji: '🌅',
    timeOfDay: 'morning',
    question: 'มีบีเวอร์ใหม่ที่ยังไม่รู้จักใครเลยมาถามว่า "ขอร่วมทีมด้วยได้ไหม?" คุณจะ...',
    choices: [
      {
        id: '3a',
        text: 'ยินดีเลย! มาเลย พวกเรายินดีต้อนรับ',
        emoji: '🤗',
        scores: { social: 4 },
      },
      {
        id: '3b',
        text: 'ได้ แต่ขอถามก่อนว่าถนัดทำอะไร',
        emoji: '🤔',
        scores: { occupational: 2, intellectual: 2 },
      },
      {
        id: '3c',
        text: 'โอเค แต่คนเยอะขึ้นอาจต้องปรับแผนใหม่',
        emoji: '📐',
        scores: { intellectual: 3, social: 1 },
      },
      {
        id: '3d',
        text: 'แน่นอน ยิ่งเยอะยิ่งดี งานเสร็จเร็ว',
        emoji: '🙌',
        scores: { social: 3, physical: 2 },
      },
    ],
  },
  {
    id: 4,
    scene: 'ตื่นเช้า',
    sceneEn: 'Morning',
    sceneName: 'ตื่นเช้า',
    sceneNameEn: 'Morning',
    sceneEmoji: '🌅',
    timeOfDay: 'morning',
    question: 'ก่อนเริ่มงาน คุณอยากทำอะไรก่อน?',
    choices: [
      {
        id: '4a',
        text: 'วางแผนและแบ่งงานให้ชัดเจน',
        emoji: '📝',
        scores: { intellectual: 3, occupational: 3 },
      },
      {
        id: '4b',
        text: 'เดินดูพื้นที่ก่อนว่าสภาพเป็นยังไง',
        emoji: '🚶',
        scores: { environmental: 3, physical: 2 },
      },
      {
        id: '4c',
        text: 'คุยกับทีมให้รู้จักกันก่อน บรรยากาศดีงานก็ดี',
        emoji: '🔥',
        scores: { social: 4, emotional: 2 },
      },
      {
        id: '4d',
        text: 'นั่งสงบใจแป๊บนึง ให้ตัวเองพร้อมก่อน',
        emoji: '🧘',
        scores: { spiritual: 4, emotional: 2 },
      },
    ],
  },
  {
    id: 5,
    scene: 'ตื่นเช้า',
    sceneEn: 'Morning',
    sceneName: 'ตื่นเช้า',
    sceneNameEn: 'Morning',
    sceneEmoji: '🌅',
    timeOfDay: 'morning',
    question: 'มีบีเวอร์อาวุโสบอกว่า "เขื่อนปีที่แล้วพัง เพราะคนไม่ฟังกัน" คุณคิดอะไร?',
    choices: [
      {
        id: '5a',
        text: 'น่ากังวล ต้องวางระบบสื่อสารให้ดีเลย',
        emoji: '📡',
        scores: { intellectual: 3, occupational: 2 },
      },
      {
        id: '5b',
        text: 'เข้าใจเลย คนในทีมสำคัญมาก',
        emoji: '💛',
        scores: { social: 3, emotional: 3 },
      },
      {
        id: '5c',
        text: 'ก็จริง แต่ถ้าทุกคนตั้งใจทำงาน น่าจะผ่านได้',
        emoji: '🪵',
        scores: { occupational: 3, physical: 2 },
      },
      {
        id: '5d',
        text: 'ฟังแล้วรู้สึกกดดันขึ้นมานิดนึง',
        emoji: '😶',
        scores: { emotional: 3, burnout: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // SCENE 2: เริ่มสร้างเขื่อน (Q6–Q9)
  // ══════════════════════════════════════════════════
  {
    id: 6,
    scene: 'สร้างเขื่อน',
    sceneEn: 'Building the Dam',
    sceneName: 'สร้างเขื่อน',
    sceneNameEn: 'Building the Dam',
    sceneEmoji: '🏗️',
    timeOfDay: 'midday',
    question: 'งานเริ่มแล้ว! คุณเลือกรับผิดชอบส่วนไหน?',
    choices: [
      {
        id: '6a',
        text: 'หาไม้และวัสดุ — ชอบงานที่ได้ขยับร่างกาย',
        emoji: '🌲',
        scores: { physical: 4, environmental: 2 },
      },
      {
        id: '6b',
        text: 'ออกแบบโครงสร้างเขื่อน — ชอบวางแผน',
        emoji: '📐',
        scores: { intellectual: 4, occupational: 2 },
      },
      {
        id: '6c',
        text: 'ประสานงานทีม — ให้ทุกคนทำงานได้ลื่น',
        emoji: '🤝',
        scores: { social: 4, occupational: 2 },
      },
      {
        id: '6d',
        text: 'ดูแลงบประมาณ — ไม่อยากให้วัสดุหมดก่อนเสร็จ',
        emoji: '🪙',
        scores: { financial: 4, intellectual: 2 },
      },
    ],
  },
  {
    id: 7,
    scene: 'สร้างเขื่อน',
    sceneEn: 'Building the Dam',
    sceneName: 'สร้างเขื่อน',
    sceneNameEn: 'Building the Dam',
    sceneEmoji: '🏗️',
    timeOfDay: 'midday',
    question: 'ทำงานไปสักพัก บีเวอร์ในทีมเริ่มเถียงกันเรื่องวิธีสร้าง คุณจะทำยังไง?',
    choices: [
      {
        id: '7a',
        text: 'ขอเป็นคนกลาง ให้ทุกคนพูดแล้วหาทางกลาง',
        emoji: '🕊️',
        scores: { social: 3, emotional: 3 },
      },
      {
        id: '7b',
        text: 'เสนอให้ทดลองสั้นๆ แล้วดูผลจริง',
        emoji: '🔬',
        scores: { intellectual: 3, physical: 2 },
      },
      {
        id: '7c',
        text: 'ถามว่าใครมีข้อมูลสนับสนุนบ้าง ตัดสินด้วยข้อมูล',
        emoji: '📊',
        scores: { intellectual: 4, occupational: 2 },
      },
      {
        id: '7d',
        text: 'รอให้เงียบก่อน แล้วค่อยพูด',
        emoji: '🌙',
        scores: { emotional: 2, spiritual: 2 },
      },
    ],
  },
  {
    id: 8,
    scene: 'สร้างเขื่อน',
    sceneEn: 'Building the Dam',
    sceneName: 'สร้างเขื่อน',
    sceneNameEn: 'Building the Dam',
    sceneEmoji: '🏗️',
    timeOfDay: 'midday',
    question: 'ฝนเริ่มตกหนักขึ้น วัสดุบางส่วนเปียก ทีมเริ่มหมดแรง คุณเลือกทำอะไร?',
    choices: [
      {
        id: '8a',
        text: 'หยุดพักก่อน สุขภาพสำคัญกว่า',
        emoji: '🛑',
        scores: { physical: 3, emotional: 3 },
      },
      {
        id: '8b',
        text: 'หาทางป้องกันวัสดุที่เหลือก่อน แก้ปัญหาที่หน้า',
        emoji: '🛡️',
        scores: { occupational: 3, intellectual: 3 },
      },
      {
        id: '8c',
        text: 'ให้กำลังใจทีม บอกว่าเราทำได้',
        emoji: '📣',
        scores: { social: 4, emotional: 2 },
      },
      {
        id: '8d',
        text: 'รู้สึกเครียดแต่ก็ยังทำต่อ ไม่อยากให้ทีมเห็น',
        emoji: '😶',
        scores: { occupational: 3, burnout: 2 },
      },
    ],
  },
  {
    id: 9,
    scene: 'สร้างเขื่อน',
    sceneEn: 'Building the Dam',
    sceneName: 'สร้างเขื่อน',
    sceneNameEn: 'Building the Dam',
    sceneEmoji: '🏗️',
    timeOfDay: 'midday',
    question: 'บีเวอร์คนหนึ่งบอกว่า "ขอลาก่อนได้ไหม ไม่สบาย" คุณรู้สึกยังไง?',
    choices: [
      {
        id: '9a',
        text: 'เป็นห่วง ถามว่าต้องการอะไรไหม',
        emoji: '❤️',
        scores: { emotional: 4, social: 3 },
      },
      {
        id: '9b',
        text: 'โอเค แต่ก็ต้องปรับแผนกันหน่อย',
        emoji: '📋',
        scores: { occupational: 3, intellectual: 2 },
      },
      {
        id: '9c',
        text: 'เข้าใจ ร่างกายสำคัญ ไปพักได้เลย',
        emoji: '🌿',
        scores: { physical: 3, emotional: 3 },
      },
      {
        id: '9d',
        text: 'โอเค แต่ในใจก็กังวลว่างานจะช้า',
        emoji: '😟',
        scores: { occupational: 2, burnout: 1, emotional: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // SCENE 3: ช่วงพัก (Q10–Q13)
  // ══════════════════════════════════════════════════
  {
    id: 10,
    scene: 'ช่วงพัก',
    sceneEn: 'Break Time',
    sceneName: 'ช่วงพัก',
    sceneNameEn: 'Break Time',
    sceneEmoji: '☕',
    timeOfDay: 'afternoon',
    question: 'พักกลางวัน! คุณเลือกทำอะไรในเวลาว่าง 1 ชั่วโมง?',
    choices: [
      {
        id: '10a',
        text: 'นอนหลับพักผ่อนเลย เอาแรงไว้บ่าย',
        emoji: '😴',
        scores: { physical: 4 },
      },
      {
        id: '10b',
        text: 'คุยเล่นกับทีม ได้รู้จักกันมากขึ้น',
        emoji: '🔥',
        scores: { social: 4 },
      },
      {
        id: '10c',
        text: 'ดูแผนงานที่เหลือ ลองคิดว่าจะปรับอะไรได้บ้าง',
        emoji: '🧠',
        scores: { intellectual: 3, occupational: 2 },
      },
      {
        id: '10d',
        text: 'นั่งฟังเสียงฝน ใจเย็นๆ คนเดียวสักพัก',
        emoji: '🌧️',
        scores: { spiritual: 4, emotional: 2 },
      },
    ],
  },
  {
    id: 11,
    scene: 'ช่วงพัก',
    sceneEn: 'Break Time',
    sceneName: 'ช่วงพัก',
    sceneNameEn: 'Break Time',
    sceneEmoji: '☕',
    timeOfDay: 'afternoon',
    question: 'มีบีเวอร์เดินมาบอกว่า "คุณทำงานเก่งมากเลยนะ" คุณตอบยังไง?',
    choices: [
      {
        id: '11a',
        text: 'ขอบคุณ! ทีมทุกคนช่วยกันด้วยนะ',
        emoji: '🌟',
        scores: { social: 3, emotional: 2 },
      },
      {
        id: '11b',
        text: 'ขอบคุณครับ/ค่ะ ยังมีอีกเยอะเลยที่ต้องทำ',
        emoji: '💪',
        scores: { occupational: 3 },
      },
      {
        id: '11c',
        text: 'จริงๆ เพื่อนๆ ช่วยเยอะมากนะ ถ้าไม่มีทีมก็ทำไม่ได้',
        emoji: '🫂',
        scores: { social: 4, emotional: 2 },
      },
      {
        id: '11d',
        text: 'ยิ้มและขอบคุณ แต่ข้างในรู้สึกเขินนิดนึง',
        emoji: '😊',
        scores: { emotional: 3, spiritual: 2 },
      },
    ],
  },
  {
    id: 12,
    scene: 'ช่วงพัก',
    sceneEn: 'Break Time',
    sceneName: 'ช่วงพัก',
    sceneNameEn: 'Break Time',
    sceneEmoji: '☕',
    timeOfDay: 'afternoon',
    question: 'ช่วงพักมีบีเวอร์ชวนเล่นเกม คุณจะ...',
    choices: [
      {
        id: '12a',
        text: 'เข้าร่วมทันที สนุกดี',
        emoji: '🎮',
        scores: { social: 4, physical: 2 },
      },
      {
        id: '12b',
        text: 'ร่วมด้วย แต่ในใจยังคิดเรื่องงานอยู่',
        emoji: '😅',
        scores: { occupational: 2, burnout: 1, social: 2 },
      },
      {
        id: '12c',
        text: 'ขอนั่งดูก่อน ไม่ค่อยอยากเล่นตอนนี้',
        emoji: '👀',
        scores: { intellectual: 2, spiritual: 2 },
      },
      {
        id: '12d',
        text: 'ขอโทษนะ ขอนอนดีกว่า เหนื่อยมาก',
        emoji: '💤',
        scores: { physical: 3, emotional: 2 },
      },
    ],
  },
  {
    id: 13,
    scene: 'ช่วงพัก',
    sceneEn: 'Break Time',
    sceneName: 'ช่วงพัก',
    sceneNameEn: 'Break Time',
    sceneEmoji: '☕',
    timeOfDay: 'afternoon',
    question: 'มีบีเวอร์ถามว่า "ถ้าให้เลือก จะสร้างเขื่อนสวยหรือเขื่อนแข็งแรง?" คุณตอบว่า...',
    choices: [
      {
        id: '13a',
        text: 'แข็งแรงก่อนเลย สวยทีหลังได้',
        emoji: '🪵',
        scores: { occupational: 3, physical: 2 },
      },
      {
        id: '13b',
        text: 'สวยด้วยแข็งแรงด้วย ต้องหาทางทำให้ได้ทั้งคู่',
        emoji: '✨',
        scores: { intellectual: 3, environmental: 2 },
      },
      {
        id: '13c',
        text: 'แล้วแต่ว่าใครจะมาอยู่ในนั้น คงต้องถามคนใช้ก่อน',
        emoji: '🤔',
        scores: { social: 3, emotional: 2 },
      },
      {
        id: '13d',
        text: 'เขื่อนที่ดีต้องเข้ากับธรรมชาติรอบข้างด้วย',
        emoji: '🌿',
        scores: { environmental: 4, spiritual: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // SCENE 4: บ่ายแก่ๆ (Q14–Q17)
  // ══════════════════════════════════════════════════
  {
    id: 14,
    scene: 'บ่ายแก่ๆ',
    sceneEn: 'Late Afternoon',
    sceneName: 'บ่ายแก่ๆ',
    sceneNameEn: 'Late Afternoon',
    sceneEmoji: '🌦️',
    timeOfDay: 'evening',
    question: 'บ่ายแล้ว ฝนตกหนักขึ้น งานช้ากว่าแผน ทุกคนเริ่มเหนื่อย คุณรู้สึกยังไง?',
    choices: [
      {
        id: '14a',
        text: 'กังวลแต่ก็ยังมีแรง ต้องสู้ต่อ',
        emoji: '💪',
        scores: { occupational: 3, physical: 2 },
      },
      {
        id: '14b',
        text: 'เหนื่อยมากแต่ไม่บอกใคร ทำต่อดีกว่า',
        emoji: '😶',
        scores: { occupational: 3, burnout: 3, emotional: -1 },
      },
      {
        id: '14c',
        text: 'อยากให้ทุกคนหยุดพักและ recharge ใหม่',
        emoji: '🫂',
        scores: { emotional: 3, social: 3 },
      },
      {
        id: '14d',
        text: 'แผนต้องปรับ ลองคิดวิธีใหม่ดู',
        emoji: '🧠',
        scores: { intellectual: 4, occupational: 2 },
      },
    ],
  },
  {
    id: 15,
    scene: 'บ่ายแก่ๆ',
    sceneEn: 'Late Afternoon',
    sceneName: 'บ่ายแก่ๆ',
    sceneNameEn: 'Late Afternoon',
    sceneEmoji: '🌦️',
    timeOfDay: 'evening',
    question: 'พบว่าวัสดุสร้างเขื่อนใกล้หมดแล้ว แต่ยังสร้างไม่เสร็จ คุณทำอะไร?',
    choices: [
      {
        id: '15a',
        text: 'รีบออกไปหาวัสดุเพิ่มทันที',
        emoji: '🌲',
        scores: { physical: 3, occupational: 3 },
      },
      {
        id: '15b',
        text: 'คิดว่ามีวิธีใช้ของที่มีให้คุ้มค่าขึ้นไหม',
        emoji: '♻️',
        scores: { intellectual: 4, financial: 3 },
      },
      {
        id: '15c',
        text: 'ประชุมทีมก่อน ตัดสินใจร่วมกัน',
        emoji: '🤝',
        scores: { social: 3, occupational: 2 },
      },
      {
        id: '15d',
        text: 'ลองคิดว่าถ้าลดขนาดเขื่อนลงนิดนึงจะได้ไหม',
        emoji: '📐',
        scores: { financial: 3, intellectual: 3 },
      },
    ],
  },
  {
    id: 16,
    scene: 'บ่ายแก่ๆ',
    sceneEn: 'Late Afternoon',
    sceneName: 'บ่ายแก่ๆ',
    sceneNameEn: 'Late Afternoon',
    sceneEmoji: '🌦️',
    timeOfDay: 'evening',
    question: 'มีบีเวอร์ตัวเล็กในทีมดูหมดแรงและเริ่มร้องไห้เงียบๆ คุณ...',
    choices: [
      {
        id: '16a',
        text: 'เดินไปนั่งข้างๆ โดยไม่พูดอะไร แค่อยู่ด้วย',
        emoji: '🫂',
        scores: { emotional: 4, social: 3 },
      },
      {
        id: '16b',
        text: 'ถามว่าเป็นอะไรและต้องการอะไร',
        emoji: '❤️',
        scores: { emotional: 3, social: 4 },
      },
      {
        id: '16c',
        text: 'บอกว่าเราทำได้ อีกนิดเดียวเสร็จแล้ว',
        emoji: '📣',
        scores: { social: 3, occupational: 2 },
      },
      {
        id: '16d',
        text: 'ชวนมากินขนมด้วยกัน บางทีน้ำตาลช่วยได้',
        emoji: '🍪',
        scores: { social: 3, physical: 2 },
      },
    ],
  },
  {
    id: 17,
    scene: 'บ่ายแก่ๆ',
    sceneEn: 'Late Afternoon',
    sceneName: 'บ่ายแก่ๆ',
    sceneNameEn: 'Late Afternoon',
    sceneEmoji: '🌦️',
    timeOfDay: 'evening',
    question: 'หัวหน้าทีมบอกให้ทำงานต่ออีก 2 ชั่วโมงโดยไม่มีพัก คุณ...',
    choices: [
      {
        id: '17a',
        text: 'โอเค ทำได้ เขื่อนต้องเสร็จ',
        emoji: '🦾',
        scores: { occupational: 4, burnout: 3 },
      },
      {
        id: '17b',
        text: 'โอเค แต่ขอให้แน่ใจว่าทุกคนโอเคก่อน',
        emoji: '💛',
        scores: { social: 3, emotional: 3 },
      },
      {
        id: '17c',
        text: 'ขอเสนอให้พัก 15 นาทีก่อน แล้วค่อยสู้ต่อ',
        emoji: '⏰',
        scores: { physical: 3, emotional: 3 },
      },
      {
        id: '17d',
        text: 'ทำได้แต่ในใจก็เริ่มรู้สึกว่ามันมากเกินไปแล้ว',
        emoji: '😮‍💨',
        scores: { occupational: 3, burnout: 4 },
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // SCENE 5: คืนนี้ (Q18–Q21) ← rain background
  // ══════════════════════════════════════════════════
  {
    id: 18,
    scene: 'คืนนี้',
    sceneEn: 'Tonight',
    sceneName: 'คืนนี้',
    sceneNameEn: 'Tonight',
    sceneEmoji: '🌧️',
    timeOfDay: 'night',
    question: 'คืนนี้ฝนตกหนัก คุณกลับมาที่ห้องนอน มองออกไปข้างนอก คุณนึกถึงอะไร?',
    choices: [
      {
        id: '18a',
        text: 'วันพรุ่งนี้จะทำอะไรบ้าง วางแผนในหัวแล้ว',
        emoji: '📋',
        scores: { occupational: 3, intellectual: 3 },
      },
      {
        id: '18b',
        text: 'ทีมวันนี้ทำได้ดีมาก อยากขอบคุณพวกเขา',
        emoji: '🫂',
        scores: { social: 4, emotional: 3 },
      },
      {
        id: '18c',
        text: 'รู้สึกสงบดี เสียงฝนฟังแล้วผ่อนคลาย',
        emoji: '🌧️',
        scores: { spiritual: 4, environmental: 3 },
      },
      {
        id: '18d',
        text: 'ยังเป็นห่วงงานอยู่ ไม่แน่ใจว่าจะทันไหม',
        emoji: '😟',
        scores: { occupational: 2, burnout: 2, emotional: 2 },
      },
    ],
  },
  {
    id: 19,
    scene: 'คืนนี้',
    sceneEn: 'Tonight',
    sceneName: 'คืนนี้',
    sceneNameEn: 'Tonight',
    sceneEmoji: '🌧️',
    timeOfDay: 'night',
    question: 'ก่อนนอน คุณเลือกทำอะไร?',
    choices: [
      {
        id: '19a',
        text: 'เปิดเพลงเบาๆ แล้วนอน',
        emoji: '🎵',
        scores: { emotional: 3, spiritual: 3 },
      },
      {
        id: '19b',
        text: 'เขียน journal สั้นๆ ว่าวันนี้เป็นยังไง',
        emoji: '📖',
        scores: { emotional: 4, intellectual: 2 },
      },
      {
        id: '19c',
        text: 'คุยกับเพื่อนบีเวอร์เล็กน้อยก่อนนอน',
        emoji: '🔥',
        scores: { social: 4 },
      },
      {
        id: '19d',
        text: 'ดูแผนงานพรุ่งนี้อีกรอบแล้วค่อยนอน',
        emoji: '📱',
        scores: { occupational: 3, intellectual: 2, burnout: 1 },
      },
    ],
  },
  {
    id: 20,
    scene: 'คืนนี้',
    sceneEn: 'Tonight',
    sceneName: 'คืนนี้',
    sceneNameEn: 'Tonight',
    sceneEmoji: '🌧️',
    timeOfDay: 'night',
    question: 'ถ้าวันนี้คุณเป็นส่วนหนึ่งของเขื่อน คุณอยากเป็นส่วนไหน?',
    choices: [
      {
        id: '20a',
        text: 'รากฐาน — มองไม่เห็นแต่สำคัญที่สุด',
        emoji: '🪨',
        scores: { occupational: 3, physical: 2 },
      },
      {
        id: '20b',
        text: 'ประตูระบายน้ำ — ทำให้ทุกอย่างไหลลื่น',
        emoji: '🌊',
        scores: { social: 4, intellectual: 2 },
      },
      {
        id: '20c',
        text: 'หน้าต่างที่มองออกไปข้างนอก — เชื่อมโลกสองใบ',
        emoji: '🌌',
        scores: { spiritual: 3, environmental: 3 },
      },
      {
        id: '20d',
        text: 'ส่วนที่สวยที่สุด — เพราะเขื่อนควรทำให้คนยิ้มได้ด้วย',
        emoji: '🌸',
        scores: { emotional: 4, environmental: 2 },
      },
    ],
  },
  {
    id: 21,
    scene: 'คืนนี้',
    sceneEn: 'Tonight',
    sceneName: 'คืนนี้',
    sceneNameEn: 'Tonight',
    sceneEmoji: '🌧️',
    timeOfDay: 'night',
    question: 'ถ้าให้บอกว่าทำไมบีเวอร์ถึงสร้างเขื่อน คุณจะตอบว่า...',
    choices: [
      {
        id: '21a',
        text: 'เพราะมันคือหน้าที่และมันต้องทำ',
        emoji: '🪵',
        scores: { occupational: 4 },
      },
      {
        id: '21b',
        text: 'เพราะอยู่ด้วยกันมันปลอดภัยกว่า',
        emoji: '🫂',
        scores: { social: 4, emotional: 2 },
      },
      {
        id: '21c',
        text: 'เพราะมันคือการสร้างบางอย่างที่ยั่งยืน',
        emoji: '🏛️',
        scores: { intellectual: 3, financial: 3 },
      },
      {
        id: '21d',
        text: 'เพราะตอนฝนตก ทุกคนต้องการที่หลบ',
        emoji: '🌧️',
        scores: { emotional: 4, spiritual: 2 },
      },
    ],
  },
]
