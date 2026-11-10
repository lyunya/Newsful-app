// Rough topic guess from a headline. Patterns match whole words only, so
// "ai" can't fire on "said" or "bill" on "billion". First match wins.
export const TOPICS = [
  {
    id: 'politics',
    label: 'Politics',
    pattern:
      /\b(trump|biden|white house|congress|senate|senators?|democrats?|republicans?|gop|elections?|votes?|voters?|ballots?|campaign|governor|mayor|president|presidential|legislation|lawmakers?|tax bill)\b/i,
  },
  {
    id: 'law',
    label: 'Law & Justice',
    pattern:
      /\b(courts?|judges?|justice department|lawsuits?|sued|trial|charged|indicted|indictment|ruling|appeals|police|crime|prison|sentenced|attorney|verdict)\b/i,
  },
  {
    id: 'sports',
    label: 'Sports',
    pattern:
      /\b(world cup|mlb|nfl|nba|wnba|nhl|soccer|football|baseball|basketball|grand prix|tennis|cricket|olympics?|playoffs?|championship|quarterback)\b/i,
  },
  {
    id: 'world',
    label: 'World',
    pattern:
      /\b(iran|ukraine|russia|china|israel|gaza|europe|european|uk|britain|france|germany|india|mexico|nato|united nations|foreign|world)\b/i,
  },
  {
    id: 'health',
    label: 'Health',
    pattern:
      /\b(health|healthcare|nhs|doctors?|disease|alzheimer'?s?|cancer|vaccines?|pregnan\w*|hospitals?|medical|medicine|fitness|covid)\b/i,
  },
  {
    id: 'science',
    label: 'Science & Tech',
    pattern:
      /\b(ai|a\.i|artificial intelligence|nasa|space|science|scientists?|tech|technology|climate|heatwave|telescope|robots?|chatbots?)\b/i,
  },
  {
    id: 'culture',
    label: 'Culture',
    pattern:
      /\b(movies?|films?|music|album|concert|wedding|comic|comedy|celebrity|celebrities|hollywood|tv|television|netflix|oscars?|grammys?)\b/i,
  },
  {
    id: 'business',
    label: 'Business',
    pattern:
      /\b(business|markets?|stocks?|company|companies|economy|economic|inflation|tariffs?|trade|financial|wall street|earnings)\b/i,
  },
];

const GENERAL = { id: 'general', label: 'General' };

export function topicForTitle(title = '') {
  return TOPICS.find((topic) => topic.pattern.test(title)) ?? GENERAL;
}
