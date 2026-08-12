import { NoteItem } from '../types';

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note_phys_01',
    title: 'Physics Formulas',
    type: 'formula',
    formulaSubject: 'Physics',
    category: 'Physics',
    content: `Kinematics Equations:
• v = u + at
• s = ut + ½at²
• v² = u² + 2as
• s = ((u + v) / 2) * t

Where:
• u = Initial velocity
• v = Final velocity
• a = Acceleration
• s = Displacement
• t = Time

Newton's Second Law:
F = ma

Force is directly proportional to mass and acceleration.`,
    isFavorite: true,
    inTrash: false,
    createdAt: '2026-08-12T22:34:00.000Z',
    updatedAt: '2026-08-12T22:34:00.000Z',
    tags: ['Physics', 'Mechanics', 'Kinematics']
  },
  {
    id: 'note_chem_01',
    title: 'Chemistry Notes',
    type: 'pdf',
    fileName: 'Organic_Chemistry_Summary.pdf',
    fileSize: 2450000,
    fileType: 'application/pdf',
    content: 'Comprehensive reference notes on Organic Reaction Mechanisms, Alkanes, Alkenes, and Aromatic Compounds.',
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-11T21:21:00.000Z',
    updatedAt: '2026-08-11T21:21:00.000Z',
    category: 'Chemistry',
    tags: ['Chemistry', 'Organic']
  },
  {
    id: 'note_math_01',
    title: 'Math Short Tricks',
    type: 'text',
    content: `# Mathematics Quick Tricks & Formulas

## Quadratic Formula
For $ax^2 + bx + c = 0$:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Derivatives Rules
1. Power Rule: d/dx(x^n) = n * x^(n-1)
2. Product Rule: d/dx(uv) = u'v + uv'
3. Quotient Rule: d/dx(u/v) = (u'v - uv') / v^2
4. Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)

## Trigonometry Identities
• sin²(x) + cos²(x) = 1
• 1 + tan²(x) = sec²(x)
• sin(2x) = 2sin(x)cos(x)
• cos(2x) = cos²(x) - sin²(x)`,
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-10T20:15:00.000Z',
    updatedAt: '2026-08-10T20:15:00.000Z',
    category: 'Mathematics',
    tags: ['Math', 'Calculus', 'Trigonometry']
  },
  {
    id: 'note_yt_01',
    title: "Newton's Laws Explained",
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    youtubeEmbedId: 'kKKM8Y-u7ds',
    content: 'An intuitive visual breakdown of inertia, F=ma, and action-reaction pairs in classical physics.',
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-10T19:45:00.000Z',
    updatedAt: '2026-08-10T19:45:00.000Z',
    category: 'Physics',
    tags: ['Physics', 'YouTube', 'Video']
  },
  {
    id: 'note_pdf_02',
    title: 'Organic Chemistry Guide',
    type: 'pdf',
    fileName: 'Organic_Chemistry_Reaction_Guide.pdf',
    fileSize: 3120000,
    fileType: 'application/pdf',
    content: 'Full summary guide for functional group conversions and SN1 vs SN2 reaction pathways.',
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-09T18:30:00.000Z',
    updatedAt: '2026-08-09T18:30:00.000Z',
    category: 'Chemistry',
    tags: ['Chemistry', 'PDF']
  },
  {
    id: 'note_vid_01',
    title: 'Projectile Motion Video',
    type: 'video',
    fileName: 'Projectile_Motion_Simulation.mp4',
    fileSize: 12400000,
    fileType: 'video/mp4',
    content: 'Slow-motion video experiment showing parabolic trajectory under gravitational acceleration.',
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-09T17:25:00.000Z',
    updatedAt: '2026-08-09T17:25:00.000Z',
    category: 'Physics',
    tags: ['Physics', 'Video']
  },
  {
    id: 'note_form_02',
    title: 'Important Integrals',
    type: 'formula',
    formulaSubject: 'Mathematics',
    category: 'Mathematics',
    content: `Standard Integration Formulas:
• ∫ x^n dx = (x^(n+1))/(n+1) + C (n ≠ -1)
• ∫ (1/x) dx = ln|x| + C
• ∫ e^x dx = e^x + C
• ∫ sin(x) dx = -cos(x) + C
• ∫ cos(x) dx = sin(x) + C
• ∫ sec²(x) dx = tan(x) + C
• ∫ (1 / √(1 - x²)) dx = arcsin(x) + C
• ∫ (1 / (1 + x²)) dx = arctan(x) + C`,
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-08T16:10:00.000Z',
    updatedAt: '2026-08-08T16:10:00.000Z',
    tags: ['Math', 'Integrals', 'Calculus']
  },
  {
    id: 'note_txt_02',
    title: 'CS Project Ideas',
    type: 'text',
    content: `# Computer Science Project Ideas

1. **Study OS Productivity App**:
   - Focus timer with pomodoro sound notifications.
   - Task manager with priority tags.
   - Built-in Notes, Formulas, PDF/Video storage.

2. **Algorithm Visualizer**:
   - Sorting algorithms (QuickSort, MergeSort).
   - Graph algorithms (Dijkstra, A* Search).

3. **Smart Expense Tracker**:
   - Local IndexedDB persistence.
   - Monthly category breakdown chart.`,
    isFavorite: false,
    inTrash: false,
    createdAt: '2026-08-08T15:40:00.000Z',
    updatedAt: '2026-08-08T15:40:00.000Z',
    category: 'Computer Science',
    tags: ['CS', 'Ideas']
  },
  {
    id: 'note_chem_form_01',
    title: 'Thermodynamics & Equilibrium Formulas',
    type: 'formula',
    formulaSubject: 'Chemistry',
    category: 'Chemistry',
    content: `Chemical Thermodynamics & Equilibrium:
• First Law: ΔU = q + w
• Enthalpy: H = U + PV
• Gibbs Free Energy: ΔG = ΔH - TΔS
• Standard Gibbs & Equilibrium: ΔG° = -RT ln(K)
• Nernst Equation: E = E° - (RT / nF) ln(Q)
• Ideal Gas Law: PV = nRT`,
    isFavorite: true,
    inTrash: false,
    createdAt: '2026-08-07T14:20:00.000Z',
    updatedAt: '2026-08-07T14:20:00.000Z',
    tags: ['Chemistry', 'Thermodynamics']
  },
  {
    id: 'note_yt_02',
    title: 'MIT Linear Algebra Intro',
    type: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZK3O402s1Oo',
    youtubeEmbedId: 'ZK3O402s1Oo',
    content: 'Prof. Gilbert Strang introduction to matrices, vectors, and linear systems.',
    isFavorite: true,
    inTrash: false,
    createdAt: '2026-08-06T12:00:00.000Z',
    updatedAt: '2026-08-06T12:00:00.000Z',
    category: 'Mathematics',
    tags: ['Math', 'Linear Algebra']
  },
  {
    id: 'note_trash_01',
    title: 'Old Draft Notes',
    type: 'text',
    content: 'Temporary notes to review before test.',
    isFavorite: false,
    inTrash: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    category: 'General'
  },
  {
    id: 'note_trash_02',
    title: 'Outdated Formula Sheet',
    type: 'formula',
    formulaSubject: 'Physics',
    content: 'Draft equations sheet',
    isFavorite: false,
    inTrash: true,
    createdAt: '2026-08-02T11:30:00.000Z',
    updatedAt: '2026-08-02T11:30:00.000Z'
  }
];
