import { assetUrl } from '../utils/assetUrl';

export const initialTopics = [
  {
    id: 'first-day',
    number: 1,
    title: '1st Day of Class',
    subtitle: 'Stepping into the unknown & redefining what it means to be creative',
    image: assetUrl('/topics/topic-1-first-day.jpg'),
    accentColor: '#0078d7',
    story: 'Walking into class on day one, I had preconceived notions about what "creativity" meant—drawing talent, innate artistic genius, or sudden lightning bolts of inspiration. Instead, we were prompted with an open blackboard: What does creative inquiry mean to you? Sitting with people from entirely different backgrounds immediately challenged my comfort zone. It became clear that this course was not about technical perfection, but about cultivating genuine curiosity, unlearning fear of judgment, and embracing the creative process as a habit rather than an accident.',
    reflection: 'In the past, I never considered myself a highly creative person. I identified three important metrics that we have worked on in this class, and rated myself on where I started. My creative confidence was okay, about a 5. Sometimes I was proud of my creative efforts, and other times I was not confident in them. My Fear of Failure was definitely high (and still is). I was afraid of not completing a goal or a task, and how that would hurt me. My Uncertainty Tolerance was actually fairly high. I worked through many assignments in school where I did not have as much direction as I would have liked, and I learned to adapt and use my creative skills.',
    keyTakeaway: 'The creative journey begins the moment you give yourself permission to be a beginner again.',
    tags: ['First Impressions', 'Mindset Shift', 'Studio Culture', 'Beginner\'s Mind'],
    gameType: 'character-creation',
    gameConcept: 'Select Your Starting Stats',
    baselineStats: {
      creativeConfidence: 6,
      fearOfFailure: 8,
      uncertaintyTolerance: 6
    },
    dayOneJournal: {
      title: 'Day 1 Baseline Journal: The Imposter in Room 204',
      timestamp: 'First Class Session • Studio Hall',
      entry: 'Walking into studio today, I had a physical knot in my stomach. The blackboard had no formulas or deadlines—just open, provocative prompts: "What does creative inquiry mean to you? How do ideas take shape?" I looked around at thirty unfamiliar faces and immediately felt like an imposter. In my standard business and analytical classes, success was linear: memorize the formula, follow the rubric, get the grade. Here, ambiguity was the explicit assignment. My default reflex was to shrink into the third row, take diligent notes, and avoid saying anything "foolish." When the professor asked us to pair up and pitch the weirdest idea we could imagine in 60 seconds, my mind froze. That moment exposed my baseline: I wasn\'t lacking imagination—I was paralyzed by the fear of being seen as wrong. My Day 1 quest was clear: unlearn perfectionism and build tolerance for messy beginnings.'
    }
  },
  {
    id: 'mentor-interview',
    number: 2,
    title: 'Mentor Interview',
    subtitle: 'Gaining wisdom through another creator\'s setbacks, breakthroughs, and philosophy',
    image: assetUrl('/topics/topic-3-mentor-interview.jpg'),
    accentColor: '#d83b01',
    story: 'Sitting down with my mentor over coffee was one of the most grounding experiences of this semester. I came in with structured questions about career trajectories and polished project triumphs, but the conversation quickly shifted to the quiet struggles: creative burnout, managing self-doubt, navigating feedback, and having the courage to abandon work that isn\'t working. Hearing someone whose work I admire talk openly about their failures and how resilience shaped their creative voice was liberating.',
    reflection: 'Success in creative pursuits is rarely linear. It is built on a willingness to stay with problems longer than most people and having mentors who remind you why you started.',
    keyTakeaway: 'The best creative advice isn\'t about the craft—it\'s about how to protect your curiosity when things get difficult.',
    tags: ['Mentorship', 'Vulnerability', 'Career Insights', 'Long-term Growth'],
    mentorName: 'Linda Garland',
    mentorTitle: "Andrew's mom, former marketing employee at P&G"
  },
  {
    id: 'rube-goldberg',
    number: 3,
    title: 'Rube Goldberg',
    subtitle: 'Complex chain reactions, physical experimentation, and learning through failure',
    image: assetUrl('/topics/topic-4-rube-goldberg.jpg'),
    accentColor: '#e81123',
    story: 'Building our Rube Goldberg machine was pure chaotic joy. The objective was deceptively simple—trigger a final action through a ridiculous sequence of dominoes, marbles, gravity chutes, and pulleys. In practice, it was a masterclass in iteration. Step 3 would work 10 times in a row, only to fail the moment Step 4 was linked. We had to embrace micro-adjustments, test relentlessly, and laugh when a marble rolled off the table for the twentieth time. When the entire sequence finally ran without a hitch, the room exploded in celebration.',
    reflection: "The Rube Goldberg project taught me a few things about creativity. A more direct concept I learned was about simply trying and failing repeatedly. We had many different attempts, and when things weren't working out we had to adapt and try something new. We truly had to get creative with how we used our materials to achieve the goal.\n\nAnother important point I leaned about creativity on this project had to do with the video editing I did. I am pretty pleased with the product of my work as someone who has little experience with video editing, but I had more trouble making a video that connected with viewers. My video was very straightforward, and did not have the fun, creative elements that videos from other groups had. I want to use creativity to be more experimental and thoughtful about the videos I put together in the future.",
    keyTakeaway: 'When you treat iteration as play rather than performance, frustration turns into momentum.',
    tags: ['Hands-on Making', 'Chain Reactions', 'Teamwork', 'Iterative Testing'],
    videoUrl: assetUrl('/topics/rube-goldberg-run.mp4')
  },
  {
    id: 'night-photos',
    number: 4,
    title: 'Joyous Exploration - taking photos at night',
    subtitle: 'Reframing familiar streets through darkness, neon glows, and patient observation',
    image: assetUrl('/topics/night-shots/pearson-hall-lanterns.jpg'),
    accentColor: '#008272',
    story: 'Heading out into the city after hours with a camera completely inverted my perception of time and space. Places that feel mundane or rushed during daylight became cinematic canvases bathed in amber streetlamps, neon signage reflections in rain puddles, and deep shadows. Without the noise and bustle of daily errands, I was forced to slow down, look up, and notice the textures of the city that usually slip by unnoticed. It was an exercise in pure joyous exploration without a predetermined destination or commercial goal.',
    reflection: 'Creativity often requires altering your physical constraints—shifting time of day, changing your pace, or looking at familiar surroundings through an entirely different lens.',
    keyTakeaway: 'The world is full of magic when you stop rushing through it and start truly observing.',
    tags: ['Night Photography', 'Slow Observation', 'Light & Shadow', 'Solo Adventure']
  },
  {
    id: 'social-curiosity',
    number: 5,
    title: 'Social Curiosity - talking to strangers',
    subtitle: 'Overcoming social friction to uncover the hidden stories around us',
    image: assetUrl('/topics/strangers/stranger-colten.jpg'),
    accentColor: '#107c10',
    story: 'Approaching a stranger on the street with intentional curiosity was undeniably terrifying at first. Our culture defaults to headphones, averted eyes, and looking down at our phones. Taking that first step to ask genuine questions about someone\'s craft, their day, or their history shattered that invisible wall. The conversation turned into a warm, deeply human encounter. I realized that almost everyone is carrying an extraordinary story, waiting for someone to be curious enough to listen.',
    reflection: 'Social curiosity is a creative muscle. Breaking past the fear of awkwardness opened up an endless reservoir of empathy, unexpected viewpoints, and human connection.',
    keyTakeaway: 'Curiosity is an act of courage; behind everyday people are worlds of untold stories.',
    tags: ['Social Bravery', 'Deep Listening', 'Empathy', 'Spontaneous Connection']
  }
];
