export const initialProjects = [
  {
    id: 'cosmic-loom',
    title: 'Cosmic Loom: Generative Algorithmic Tapestry',
    shortTitle: 'Cosmic Loom',
    category: 'Creative Coding',
    categoryKey: 'code',
    tagline: 'Translating chaotic mathematical attractors into luminous woven celestial fibers.',
    year: '2026',
    image: '/projects/project1.jpg',
    tags: ['WebGL', 'GLSL Shaders', 'Strange Attractors', 'Procedural Art'],
    colorAccent: '#c084fc',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    summary: 'Cosmic Loom is an algorithmic investigation into how mathematical chaos and fractal geometry can mirror organic woven textiles. By calculating high-frequency particle trajectories in real time, the piece weaves dynamic, radiant constellations that shift in response to ambient user motion.',
    walkthroughScript: 'Welcome to Cosmic Loom. For this piece, I wanted to explore how pure mathematics can evoke the warmth and intimacy of tactile weaving. I programmed strange attractor differential equations with custom GLSL fragments, rendering over 25,000 light threads simultaneously. It challenges the common belief that computer algorithms are inherently cold or rigid.',
    keyQuestions: 'How can pure mathematical computation evoke organic human tactile memory?',
    creativeProcess: {
      inspiration: 'Inspired by ancient Incan Quipu knot recording systems juxtaposed with astrophysical nebula photography from deep space telescopes.',
      challenges: 'Balancing GPU compute shader performance while maintaining soft, atmospheric light dispersion across 60 frames per second.',
      takeaway: 'Achieved a breakthrough in procedural harmonic resonance; demonstrated how algorithmic craft can feel alive and poetic.'
    },
    stats: [
      { label: 'Particles', value: '25,000+' },
      { label: 'Framerate', value: '60 FPS' },
      { label: 'Equations', value: 'Lorenz & Rossler' }
    ],
    interactiveType: 'particles'
  },
  {
    id: 'chronicles-deep',
    title: 'Chronicles of the Abyssal Sanctuary',
    shortTitle: 'Abyssal Sanctuary',
    category: 'Speculative Narrative',
    categoryKey: 'narrative',
    tagline: 'An interactive underwater speculative world built around symbiotic bioluminescence.',
    year: '2026',
    image: '/projects/project2.jpg',
    tags: ['Worldbuilding', 'Interactive Fiction', 'Environmental Design', 'Concept Art'],
    colorAccent: '#2dd4bf',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
    summary: 'Set in an oceanic trench 8,000 meters below sea level in the year 2340, this speculative world explores human-cephalopod symbiosis. Cities are grown from bio-photonic coral networks, powered entirely by chemical luminescent gardens and deep hydrothermal vents.',
    walkthroughScript: 'This is Chronicles of the Abyssal Sanctuary, my speculative fiction and environmental worldbuilding piece. In class, we discussed climate adaptation and post-terrestrial architecture. I envisioned a subterranean oceanic haven where light is the primary currency and living organisms are the architectural infrastructure.',
    keyQuestions: 'What does community look like when living organisms provide both structure and consciousness?',
    creativeProcess: {
      inspiration: 'Benthopelagic fauna, siphonophores, hydrothermal vent ecosystems, and Donna Haraway\'s concept of multispecies kinship.',
      challenges: 'Constructing believable ecological mechanics that respect deep-sea pressure physics while creating poetic visual storytelling.',
      takeaway: 'Expanded my worldbuilding practice into interactive non-linear lore nodes where visitors uncover the civilization\'s archives.'
    },
    stats: [
      { label: 'Depth Level', value: '-8,200m' },
      { label: 'Lore Entries', value: '18 Chapters' },
      { label: 'Species Logged', value: '42 Variants' }
    ],
    interactiveType: 'bubbles'
  },
  {
    id: 'aura-soundscape',
    title: 'Aura: Resonant Kinetic Sound Sculpture',
    shortTitle: 'Aura Soundscape',
    category: 'Audiovisual Installation',
    categoryKey: 'audio',
    tagline: 'Translating sub-bass frequencies and vocal timbre into suspended luminous geometry.',
    year: '2026',
    image: '/projects/project3.jpg',
    tags: ['WebAudio API', 'Spatial Audio', 'Light Sculpture', 'Physical Computing'],
    colorAccent: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    summary: 'Aura is an acoustic installation proposal that materializes sound waves into suspended, glowing concentric halos. Using fast Fourier transform (FFT) analysis, harmonics produce standing wave light patterns, giving visitors an intuitive physical perception of acoustic spatial resonance.',
    walkthroughScript: 'Next is Aura, a spatial sound and light sculpture. Have you ever wondered what harmony actually looks like in 3D space? Aura breaks down incoming audio into granular frequency bands, turning chord progressions into pulsating kinetic light ribbons. During our class critiques, testing sound reactivity in real-time brought this piece to life.',
    keyQuestions: 'Can visualizing the microscopic geometry of sound deepen emotional intimacy with music?',
    creativeProcess: {
      inspiration: 'Cymatics experiments with Chladni plates, sacred geometry in acoustic amphitheaters, and minimalist light art by James Turrell.',
      challenges: 'Synchronizing low-latency audio feature extraction with smooth bezier ribbon physics without visual jitter.',
      takeaway: 'Discovered that micro-tonal shifts in human voice create the most mesmerizing ripple geometry in the light rings.'
    },
    stats: [
      { label: 'Frequency Range', value: '20Hz - 20kHz' },
      { label: 'FFT Bins', value: '1024 Bands' },
      { label: 'Latency', value: '< 8ms' }
    ],
    interactiveType: 'equalizer'
  },
  {
    id: 'kinetic-bloom',
    title: 'Kinetic Bloom: Parametric Origami Metamaterials',
    shortTitle: 'Kinetic Bloom',
    category: 'Kinetic Architecture',
    categoryKey: 'kinetic',
    tagline: 'Self-actuating responsive tessellations that breathe with ambient environmental flux.',
    year: '2026',
    image: '/projects/project4.jpg',
    tags: ['Parametric Design', 'Origami Engineering', 'Kinetic Art', 'Sensory Materials'],
    colorAccent: '#fb7185',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    summary: 'Kinetic Bloom investigates mechanical metamaterials through the lens of Miura-ori and waterbomb origami tessellations. Constructed from memory-alloy joints and reflective titanium-sheened petals, the sculpture dilates and contracts according to room temperature and human proximity.',
    walkthroughScript: 'Lastly, here is Kinetic Bloom. This project bridges digital parametric computation with physical origami folding. I created a cellular tessellation where every individual facet influences its neighbors like mechanical dominoes. It breathes and morphs organically as visitors walk toward it, blurring the line between machine and organism.',
    keyQuestions: 'How can inanimate mechanical structures exhibit lifelike autonomous behavior without visible motors?',
    creativeProcess: {
      inspiration: 'Biological blooming mechanisms of morning glories combined with aerospace deployable solar arrays.',
      challenges: 'Calculating the exact geometric folding constraints to prevent structural binding across compound 3D joints.',
      takeaway: 'Prototyped 14 physical iteration models before arriving at this frictionless harmonic deployment linkage.'
    },
    stats: [
      { label: 'Origami Facets', value: '192 Panels' },
      { label: 'Degrees of Freedom', value: 'Continuous' },
      { label: 'Material', value: 'Dichroic Mylar' }
    ],
    interactiveType: 'origami'
  }
];

export const categories = [
  { id: 'all', label: 'All Explorations' },
  { id: 'code', label: 'Creative Coding' },
  { id: 'narrative', label: 'Speculative Narrative' },
  { id: 'audio', label: 'Audiovisual' },
  { id: 'kinetic', label: 'Kinetic Design' }
];
