// Demo data generator for LifeStream
import { db } from './db';
import { createDefaultProfile, POINTS } from './gamification';

const DEMO_MEMORIES = [
  {
    title: "Sunrise at Kungsleden Trail",
    description: "Woke up at 4 AM to catch the sunrise over the Swedish mountains. The sky turned from deep purple to brilliant orange. Absolutely breathtaking experience that I'll never forget.",
    eventDateTime: new Date(Date.now() - 1 * 86400000).getTime(),
    locationName: "Kungsleden, Sweden",
    latitude: 67.9,
    longitude: 18.5,
    mood: "excited" as const,
    tags: ["nature", "hiking", "sunrise", "sweden"],
    isAchievement: true,
    reactions: ["🔥", "❤️", "😍"],
  },
  {
    title: "Coffee with Old Friends",
    description: "Met up with my college friends after 5 years. We spent hours reminiscing about old times, laughing at stupid memories, and making plans for the future.",
    eventDateTime: new Date(Date.now() - 2 * 86400000).getTime(),
    locationName: "Stockholm",
    latitude: 59.33,
    longitude: 18.07,
    mood: "happy" as const,
    tags: ["friends", "coffee", "nostalgia"],
    isAchievement: false,
    reactions: ["❤️", "😊"],
  },
  {
    title: "First Day at New Job",
    description: "Started my new position today. The team is amazing, the office has a great view, and I'm already excited about the projects ahead.",
    eventDateTime: new Date(Date.now() - 3 * 86400000).getTime(),
    locationName: "Gothenburg",
    latitude: 57.71,
    longitude: 11.97,
    mood: "excited" as const,
    tags: ["work", "career", "new beginnings"],
    isAchievement: true,
    reactions: ["🎉", "💪", "👏"],
  },
  {
    title: "Midnight Walk in the Rain",
    description: "Couldn't sleep so I went for a walk. The city was empty, the rain was gentle, and the streetlights created perfect reflections on the wet pavement. Sometimes the best moments are the unplanned ones.",
    eventDateTime: new Date(Date.now() - 4 * 86400000).getTime(),
    locationName: "Malmö",
    latitude: 55.60,
    longitude: 13.00,
    mood: "peaceful" as const,
    tags: ["night", "rain", "solitude", "peace"],
    isAchievement: false,
    reactions: ["🌙", "✨"],
  },
  {
    title: "Homemade Pasta Success!",
    description: "After 3 failed attempts, I finally made the perfect pasta from scratch! The texture was amazing and it tasted incredible with my grandmother's sauce recipe.",
    eventDateTime: new Date(Date.now() - 5 * 86400000).getTime(),
    locationName: "Home Kitchen",
    mood: "happy" as const,
    tags: ["cooking", "food", "achievement", "family recipe"],
    isAchievement: true,
    reactions: ["😋", "🍝", "❤️"],
  },
  {
    title: "Northern Lights Experience",
    description: "Drove 3 hours north just to see the aurora borealis. When the green lights started dancing across the sky, I forgot about everything else. Pure magic.",
    eventDateTime: new Date(Date.now() - 7 * 86400000).getTime(),
    locationName: "Abisko, Sweden",
    latitude: 68.35,
    longitude: 18.83,
    mood: "excited" as const,
    tags: ["aurora", "nature", "bucket list", "sweden"],
    isAchievement: true,
    reactions: ["🌟", "💚", "😍", "🤯"],
  },
  {
    title: "Weekend Hike with Dog",
    description: "Took Max (my golden retriever) on a 10km hike through the forest. He loved every minute of it - rolling in leaves, splashing in streams, chasing squirrels.",
    eventDateTime: new Date(Date.now() - 8 * 86400000).getTime(),
    locationName: "Tyresta National Park",
    latitude: 59.18,
    longitude: 18.30,
    mood: "happy" as const,
    tags: ["dog", "hiking", "nature", "weekend"],
    isAchievement: false,
    reactions: ["🐕", "❤️", "🌲"],
  },
  {
    title: "Published My First Article",
    description: "After months of writing and editing, my first professional article was published. It's about sustainable technology in Nordic countries. Hard work pays off!",
    eventDateTime: new Date(Date.now() - 10 * 86400000).getTime(),
    locationName: "Stockholm",
    latitude: 59.33,
    longitude: 18.07,
    mood: "excited" as const,
    tags: ["writing", "career", "achievement", "published"],
    isAchievement: true,
    reactions: ["🎉", "📝", "💪", "👏"],
  },
  {
    title: "Rainy Day Reading",
    description: "Spent the entire Sunday reading by the window while it rained outside. Finished 'The Midnight Library' and it completely changed my perspective on life choices.",
    eventDateTime: new Date(Date.now() - 12 * 86400000).getTime(),
    locationName: "Home",
    mood: "reflective" as const,
    tags: ["reading", "books", "rainy day", "reflection"],
    isAchievement: false,
    reactions: ["📖", "☕"],
  },
  {
    title: "Birthday Celebration!",
    description: "Turned 25 today! Had a surprise party with all my favorite people. The cake was amazing, the decorations were perfect, and I felt truly loved.",
    eventDateTime: new Date(Date.now() - 15 * 86400000).getTime(),
    locationName: "Restaurant Zen, Stockholm",
    latitude: 59.32,
    longitude: 18.05,
    mood: "happy" as const,
    tags: ["birthday", "celebration", "friends", "family"],
    isAchievement: true,
    reactions: ["🎂", "🎉", "❤️", "🥳", "✨"],
  },
  {
    title: "Morning Yoga at the Park",
    description: "Started doing yoga in the park every morning. Today was especially peaceful - birds singing, gentle breeze, perfect stretch. My body and mind thank me.",
    eventDateTime: new Date(Date.now() - 1 * 86400000).getTime(),
    locationName: "Djurgården, Stockholm",
    latitude: 59.33,
    longitude: 18.10,
    mood: "peaceful" as const,
    tags: ["yoga", "health", "morning", "nature"],
    isAchievement: false,
    reactions: ["🧘", "🌿"],
  },
  {
    title: "Learned to Code!",
    description: "After 3 months of daily practice, I can now build full-stack applications. Created my first web app today. The journey of a thousand miles begins with a single step.",
    eventDateTime: new Date(Date.now() - 20 * 86400000).getTime(),
    locationName: "Home Office",
    mood: "excited" as const,
    tags: ["coding", "learning", "achievement", "technology"],
    isAchievement: true,
    reactions: ["💻", "🎉", "🚀", "💪"],
  },
];

export async function seedDemoData() {
  // Check if already seeded
  const existing = await db.memories.count();
  if (existing > 0) return false;

  // Create profile
  const profile = createDefaultProfile();
  profile.displayName = "Alex Johnson";
  profile.username = "alex_j";
  profile.points = 350;
  profile.level = 4;
  profile.streak = 12;
  profile.lastActiveDate = new Date().toISOString().split('T')[0];
  profile.badges = ['first_memory', 'memories_10', 'streak_3', 'streak_7', 'first_photo', 'first_achievement'];
  profile.totalMemories = 12;
  profile.totalPhotos = 8;
  profile.totalVoices = 2;
  profile.totalAchievements = 5;
  profile.joinedAt = Date.now() - 30 * 86400000;

  await db.profile.add(profile);

  // Add demo memories
  for (const memory of DEMO_MEMORIES) {
    await db.memories.add({
      ...memory,
      createdAt: memory.eventDateTime - 3600000,
      updatedAt: memory.eventDateTime,
      locationName: memory.locationName,
      latitude: memory.latitude,
      longitude: memory.longitude,
      category: undefined,
      pinned: false,
      favorite: Math.random() > 0.7,
      attachments: [],
    });
  }

  // Add points log
  for (let i = 0; i < 30; i++) {
    await db.pointsLog.add({
      action: 'create_memory',
      points: 10,
      timestamp: Date.now() - i * 86400000,
      memoryId: i + 1,
    });
  }

  return true;
}
