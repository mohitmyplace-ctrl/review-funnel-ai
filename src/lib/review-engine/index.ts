import type { StarRating, ReviewPersona, VenueCategory } from '@/types';

interface TemplateContext {
  venueName?: string;
  venueCategory?: VenueCategory;
  tags: string[];
}

type PersonaTemplates = Record<ReviewPersona, string[]>;
type StarTemplates = Record<StarRating, PersonaTemplates>;

const STAR_EMPHASIS: Record<StarRating, string[]> = {
  1: ['service was poor', 'wait time was too long', 'food was cold', 'staff was unhelpful', 'place was not clean'],
  2: ['experience fell short', 'food was average at best', 'service needs improvement', 'not what we expected'],
  3: ['decent but nothing special', 'some things were good, others not so much', 'had its ups and downs', 'solid but room to grow'],
  4: ['really good overall', 'stood out for the right reasons', 'would go back', 'hit most of the marks'],
  5: ['absolutely brilliant', 'exceeded every expectation', 'one of the best', 'outstanding from start to finish'],
};

const TEMPLATES: StarTemplates = {
  1: {
    casual: [
      'Honestly not worth it. {emphasis}. Skip this one.',
      'Not going back. {emphasis} and nobody seemed to care.',
      'Disappointed. {emphasis} — expected better.',
    ],
    enthusiastic: [
      'Really struggled here. {emphasis} which is a shame because the potential was there.',
      'Hard to recommend. {emphasis} and that ruined the whole experience.',
    ],
    measured: [
      'The visit did not meet basic expectations. {emphasis}. Significant improvement is needed.',
      'Unfortunately, {emphasis}. Until that changes, I cannot recommend this place.',
    ],
    descriptive: [
      'From the moment we arrived, it was clear something was off. {emphasis} throughout our visit.',
      'The experience was consistently below par. {emphasis} and nothing was done to address it.',
    ],
    brief: [
      'Not good. {emphasis}.',
      'Below expectations. {emphasis}. Would not return.',
    ],
  },
  2: {
    casual: [
      'Meh. {emphasis}. There are better options nearby.',
      'Not terrible but not great either. {emphasis} — could do better.',
      'Felt underwhelmed. {emphasis}. Maybe on a different day it would be fine.',
    ],
    enthusiastic: [
      'Was really hoping for more. {emphasis} and that made the whole visit feel flat.',
      'Gave it a fair shot but {emphasis}. Still some work to do here.',
    ],
    measured: [
      'The experience had some positives, however {emphasis} which brought things down considerably.',
      'A few things worked, but {emphasis}. Not ready to recommend just yet.',
    ],
    descriptive: [
      'The place had promise but {emphasis}. With some attention to the basics this could improve.',
      'Mixed visit overall. Some moments were fine, but {emphasis} left a lasting impression.',
    ],
    brief: [
      'Has potential, but {emphasis}.',
      'Not quite there yet. {emphasis}.',
    ],
  },
  3: {
    casual: [
      'Pretty average visit. {emphasis}. Fine for a quick stop but nothing to rave about.',
      'Decent enough. {emphasis}. Would probably go back if nothing else was nearby.',
      'Middle of the road. {emphasis} — not bad, not great.',
    ],
    enthusiastic: [
      'Had a reasonable time! {emphasis} but there were moments where it really shone.',
      'Decent visit overall. {emphasis}, which is a shame because the good parts were genuinely good.',
    ],
    measured: [
      'A balanced experience. {emphasis}. The positives and negatives roughly cancel out.',
      'Neither impressed nor disappointed. {emphasis}. A solid, if unremarkable, option.',
    ],
    descriptive: [
      'The visit was a mixed bag. {emphasis}, but there were clear areas where the team did well.',
      'Consistent in some ways, inconsistent in others. {emphasis} — worth a try with adjusted expectations.',
    ],
    brief: [
      'Average. {emphasis}.',
      'Okay overall. {emphasis}. Not memorable but not bad.',
    ],
  },
  4: {
    casual: [
      'Really good time! {emphasis}. Minor things could be tweaked but overall solid.',
      'Had a great visit. {emphasis} — will definitely be back.',
      'Impressed on most counts. {emphasis}. One or two small things held it back from five stars.',
    ],
    enthusiastic: [
      'Loved it! {emphasis} and the energy was great throughout.',
      'Great experience! {emphasis} — so close to perfect.',
    ],
    measured: [
      'A strong visit with most things done right. {emphasis}. Would recommend without hesitation.',
      'High quality across the board. {emphasis}. Worth the visit.',
    ],
    descriptive: [
      'From the moment we walked in, things felt well run. {emphasis} and the attention to detail was clear.',
      'A polished experience. {emphasis} — the kind of place that makes you glad you tried it.',
    ],
    brief: [
      'Very good. {emphasis}.',
      'Solid four stars. {emphasis}. Worth returning.',
    ],
  },
  5: {
    casual: [
      'Absolutely loved it. {emphasis} — go here, seriously.',
      'One of my favourite spots now. {emphasis}. Cannot fault a thing.',
      'Blew me away. {emphasis}. Will be back again and again.',
    ],
    enthusiastic: [
      'Outstanding! {emphasis} and the whole team really went above and beyond.',
      'Best experience in a long time! {emphasis} — everything clicked perfectly.',
    ],
    measured: [
      'Exceptional from start to finish. {emphasis}. Rarely does a place deliver at this level consistently.',
      'Everything worked exactly as it should. {emphasis}. Sets the standard for others in this category.',
    ],
    descriptive: [
      'Every detail was considered. {emphasis} and you could feel the pride they take in their work.',
      'The kind of place that reminds you why you bother trying new spots. {emphasis} throughout.',
    ],
    brief: [
      'Exceptional. {emphasis}.',
      'Flawless visit. {emphasis}. Five stars, no question.',
    ],
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildEmphasis(starRating: StarRating, tags: string[], ctx: TemplateContext): string {
  const baseEmphasis = pickRandom(STAR_EMPHASIS[starRating]);

  if (tags.length === 0) return baseEmphasis;

  const tagPhrases: Record<string, Record<StarRating, string>> = {
    food: {
      1: 'the food was a real letdown',
      2: 'the food was inconsistent',
      3: 'the food was decent',
      4: 'the food was really good',
      5: 'the food was genuinely excellent',
    },
    service: {
      1: 'the service was frustratingly slow',
      2: 'the service could use some polish',
      3: 'service was okay, nothing special',
      4: 'service was attentive and friendly',
      5: 'the service was warm and professional',
    },
    ambience: {
      1: 'the atmosphere felt off',
      2: 'the vibe was a bit flat',
      3: 'the ambience was pleasant enough',
      4: 'the atmosphere was really nice',
      5: 'the atmosphere was exactly right',
    },
    value: {
      1: 'it simply was not worth the price',
      2: 'the value for money was questionable',
      3: 'fair value for what you get',
      4: 'well priced for the quality',
      5: 'exceptional value at every level',
    },
    cleanliness: {
      1: 'cleanliness was a concern',
      2: 'could have been cleaner',
      3: 'reasonably clean and tidy',
      4: 'clean and well maintained',
      5: 'spotlessly clean throughout',
    },
    speed: {
      1: 'wait times were unreasonable',
      2: 'things moved slower than expected',
      3: 'timing was acceptable',
      4: 'things moved at a good pace',
      5: 'fast and efficient from start to finish',
    },
  };

  const selectedTags = tags.filter(t => tagPhrases[t]);
  if (selectedTags.length === 0) return baseEmphasis;

  const tag = pickRandom(selectedTags);
  return tagPhrases[tag][starRating];
}

export function generateReviewDraft(
  starRating: StarRating,
  tags: string[],
  ctx: TemplateContext = { tags: [] }
): { draft: string; persona: ReviewPersona } {
  const personas: ReviewPersona[] = ['casual', 'enthusiastic', 'measured', 'descriptive', 'brief'];
  const persona = pickRandom(personas);

  const personaTemplates = TEMPLATES[starRating][persona];
  const template = pickRandom(personaTemplates);

  const emphasis = buildEmphasis(starRating, tags, ctx);

  let draft = template.replace('{emphasis}', emphasis);

  if (ctx.venueName) {
    const nameInsertionChance = Math.random() > 0.5;
    if (nameInsertionChance && starRating >= 4) {
      draft = draft.replace(/\.$/, ` — ${ctx.venueName} is worth every visit.`);
    } else if (nameInsertionChance && starRating <= 2) {
      draft = draft.replace(/\.$/, `. ${ctx.venueName} has some catching up to do.`);
    }
  }

  return { draft, persona };
}

export const AVAILABLE_TAGS: Record<string, string> = {
  food: 'Food',
  service: 'Service',
  ambience: 'Ambience',
  value: 'Value',
  cleanliness: 'Cleanliness',
  speed: 'Speed',
};

export const STAR_LABELS: Record<StarRating, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};
