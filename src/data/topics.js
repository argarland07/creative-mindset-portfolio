import { assetUrl } from '../utils/assetUrl';

export const initialTopics = [
  {
    id: 'first-day',
    number: 1,
    title: '1st Day of Class',
    subtitle: 'Stepping into the unknown & redefining what it means to be creative',
    phase: 'Chapter 01',
    image: assetUrl('/topics/topic-1-first-day.jpg'),
    accentColor: '#0078d7',
    story: 'Walking into class on day one, I had preconceived notions about what "creativity" meant—drawing talent, innate artistic genius, or sudden lightning bolts of inspiration. Instead, we were prompted with an open blackboard: What does creative inquiry mean to you? Sitting with people from entirely different backgrounds immediately challenged my comfort zone. It became clear that this course was not about technical perfection, but about cultivating genuine curiosity, unlearning fear of judgment, and embracing the creative process as a habit rather than an accident.',
    reflection: 'Creativity is not an exclusive club of artists; it is a way of seeing and actively engaging with the world around you. Day one set the intention: be open to being surprised by your own mind.',
    keyTakeaway: 'The creative journey begins the moment you give yourself permission to be a beginner again.',
    tags: ['First Impressions', 'Mindset Shift', 'Studio Culture', 'Beginner\'s Mind'],
    gameType: 'character-creation',
    gameConcept: 'Select Your Starting Stats',
    baselineStats: {
      creativeConfidence: 28,
      fearOfFailure: 86,
      uncertaintyTolerance: 34
    },
    dayOneJournal: {
      title: 'Day 1 Baseline Journal: The Imposter in Room 204',
      timestamp: 'First Class Session • Studio Hall',
      entry: 'Walking into studio today, I had a physical knot in my stomach. The blackboard had no formulas or deadlines—just open, provocative prompts: "What does creative inquiry mean to you? How do ideas take shape?" I looked around at thirty unfamiliar faces and immediately felt like an imposter. In my standard business and analytical classes, success was linear: memorize the formula, follow the rubric, get the grade. Here, ambiguity was the explicit assignment. My default reflex was to shrink into the third row, take diligent notes, and avoid saying anything "foolish." When the professor asked us to pair up and pitch the weirdest idea we could imagine in 60 seconds, my mind froze. That moment exposed my baseline: I wasn\'t lacking imagination—I was paralyzed by the fear of being seen as wrong. My Day 1 quest was clear: unlearn perfectionism and build tolerance for messy beginnings.'
    }
  },
  {
    id: 'business-ai',
    number: 2,
    title: 'Exploring Creativity, Business, and AI',
    subtitle: 'The intersection of human imagination, commercial value, and emerging intelligence',
    phase: 'Chapter 02',
    image: assetUrl('/topics/topic-2-business-ai.jpg'),
    accentColor: '#68217a',
    story: 'As we dived into the interplay between creative instincts, real-world business models, and generative AI tools, the conversation shifted from theoretical wondering to practical reality. Can AI replace the human creative spark, or does it serve as an infinite brainstorming amplifier? We examined how businesses differentiate themselves when generative technology lowers the barrier of production. The real competitive moat isn\'t just prompt engineering—it is empathy, authentic lived experience, and asking questions that an algorithm wouldn\'t think to ask.',
    reflection: 'AI can generate millions of permutations in seconds, but human discernment, cultural context, and emotional resonance are what turn raw output into meaningful creative work.',
    keyTakeaway: 'Technology scales capability, but human taste and empathy define meaning and value.',
    tags: ['Artificial Intelligence', 'Creative Strategy', 'Business Models', 'Curation & Taste']
  },
  {
    id: 'mentor-interview',
    number: 3,
    title: 'Mentor Interview',
    subtitle: 'Gaining wisdom through another creator\'s setbacks, breakthroughs, and philosophy',
    phase: 'Chapter 03',
    image: assetUrl('/topics/topic-3-mentor-interview.jpg'),
    accentColor: '#d83b01',
    story: 'Sitting down with my mentor over coffee was one of the most grounding experiences of this semester. I came in with structured questions about career trajectories and polished project triumphs, but the conversation quickly shifted to the quiet struggles: creative burnout, managing self-doubt, navigating feedback, and having the courage to abandon work that isn\'t working. Hearing someone whose work I admire talk openly about their failures and how resilience shaped their creative voice was liberating.',
    reflection: 'Success in creative pursuits is rarely linear. It is built on a willingness to stay with problems longer than most people and having mentors who remind you why you started.',
    keyTakeaway: 'The best creative advice isn\'t about the craft—it\'s about how to protect your curiosity when things get difficult.',
    tags: ['Mentorship', 'Vulnerability', 'Career Insights', 'Long-term Growth'],
    mentorName: 'Linda Garland',
    mentorTitle: 'Executive Creative Mentor'
  },
  {
    id: 'rube-goldberg',
    number: 4,
    title: 'Rube Goldberg',
    subtitle: 'Complex chain reactions, physical experimentation, and learning through failure',
    phase: 'Chapter 04',
    image: assetUrl('/topics/topic-4-rube-goldberg.jpg'),
    accentColor: '#e81123',
    story: 'Building our Rube Goldberg machine was pure chaotic joy. The objective was deceptively simple—trigger a final action through a ridiculous sequence of dominoes, marbles, gravity chutes, and pulleys. In practice, it was a masterclass in iteration. Step 3 would work 10 times in a row, only to fail the moment Step 4 was linked. We had to embrace micro-adjustments, test relentlessly, and laugh when a marble rolled off the table for the twentieth time. When the entire sequence finally ran without a hitch, the room exploded in celebration.',
    reflection: 'Collaborative play is one of the most powerful engines of creative problem-solving. Failure wasn\'t a setback; each failed run gave us immediate physical data on how to improve.',
    keyTakeaway: 'When you treat iteration as play rather than performance, frustration turns into momentum.',
    tags: ['Hands-on Making', 'Chain Reactions', 'Teamwork', 'Iterative Testing']
  },
  {
    id: 'night-photos',
    number: 5,
    title: 'Joyous Exploration - taking photos at night',
    subtitle: 'Reframing familiar streets through darkness, neon glows, and patient observation',
    phase: 'Chapter 05',
    image: assetUrl('/topics/topic-5-night-photography.jpg'),
    accentColor: '#008272',
    story: 'Heading out into the city after hours with a camera completely inverted my perception of time and space. Places that feel mundane or rushed during daylight became cinematic canvases bathed in amber streetlamps, neon signage reflections in rain puddles, and deep shadows. Without the noise and bustle of daily errands, I was forced to slow down, look up, and notice the textures of the city that usually slip by unnoticed. It was an exercise in pure joyous exploration without a predetermined destination or commercial goal.',
    reflection: 'Creativity often requires altering your physical constraints—shifting time of day, changing your pace, or looking at familiar surroundings through an entirely different lens.',
    keyTakeaway: 'The world is full of magic when you stop rushing through it and start truly observing.',
    tags: ['Night Photography', 'Slow Observation', 'Light & Shadow', 'Solo Adventure']
  },
  {
    id: 'social-curiosity',
    number: 6,
    title: 'Social Curiosity - talking to strangers',
    subtitle: 'Overcoming social friction to uncover the hidden stories around us',
    phase: 'Chapter 06',
    image: assetUrl('/topics/topic-6-social-curiosity.jpg'),
    accentColor: '#107c10',
    story: 'Approaching a stranger on the street with intentional curiosity was undeniably terrifying at first. Our culture defaults to headphones, averted eyes, and looking down at our phones. Taking that first step to ask genuine questions about someone\'s craft, their day, or their history shattered that invisible wall. The conversation turned into a warm, deeply human encounter. I realized that almost everyone is carrying an extraordinary story, waiting for someone to be curious enough to listen.',
    reflection: 'Social curiosity is a creative muscle. Breaking past the fear of awkwardness opened up an endless reservoir of empathy, unexpected viewpoints, and human connection.',
    keyTakeaway: 'Curiosity is an act of courage; behind everyday people are worlds of untold stories.',
    tags: ['Social Bravery', 'Deep Listening', 'Empathy', 'Spontaneous Connection']
  },
  {
    id: 'goosechase',
    number: 7,
    title: 'Goosechase',
    subtitle: 'A high-energy campus quest blending gamification, quick thinking, and collective wit',
    phase: 'Chapter 07',
    image: assetUrl('/topics/topic-7-goosechase.jpg'),
    accentColor: '#ffb900',
    story: 'The Goosechase challenge threw us into a time-pressured, scavenger-style race across campus. Teams were deciphering cryptic riddles, executing unconventional photo prompts, interviewing staff members, and reenacting iconic moments under tight deadlines. There was no time to overthink or second-guess—you had to commit to the bit, trust your teammates\' instincts, and move fast. The playful competitive spirit pushed us to explore campus corners we didn\'t even know existed.',
    reflection: 'Imposing playful time constraints forces your brain to bypass analytical hesitation and tap into spontaneous lateral thinking and instinctive collaboration.',
    keyTakeaway: 'Constraints and playfulness kill perfectionism faster than any lecture ever could.',
    tags: ['Scavenger Hunt', 'Spontaneity', 'Lateral Thinking', 'Gamified Creativity']
  },
  {
    id: 'ten-days',
    number: 8,
    title: '10 days of creativity',
    subtitle: 'Building a consistent daily creative habit through small, deliberate micro-acts',
    phase: 'Chapter 08',
    image: assetUrl('/topics/topic-8-10-days.jpg'),
    accentColor: '#b4009e',
    story: 'The 10 Days of Creativity challenge was the crucible that tied the entire semester together. Every single day for ten consecutive days, we committed to a creative act—whether sketching a stranger\'s silhouette, writing a flash poem, composing a 10-second sound bite, or remixing everyday objects. Some days the output was vibrant and exciting; other days it felt forced and clumsy. But showing up regardless created a rhythm. By Day 10, creativity stopped being an elusive muse and became a reliable daily muscle.',
    reflection: 'Daily consistency matters infinitely more than waiting for rare lightning strikes of motivation. Showing up every day proves to yourself that you are a practicing creator.',
    keyTakeaway: 'Creativity isn\'t a talent you wait for; it\'s a muscle you build one small daily act at a time.',
    tags: ['Daily Practice', 'Creative Habits', 'Micro-Acts', 'Semester Culmination']
  }
];
