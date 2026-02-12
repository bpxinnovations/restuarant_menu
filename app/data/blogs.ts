export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  author: string;
  readTimeMinutes: number;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-ghanaian-dishes-to-try",
    title: "10 Best Ghanaian Dishes You Have to Try",
    excerpt:
      "From waakye to fufu and light soup, discover the must-try dishes that define Ghanaian cuisine and where to find them in Accra and Kumasi.",
    content: `
Ghanaian cuisine is rich, varied, and full of flavour. Whether you're new to West African food or a longtime fan, these ten dishes should be on your list. (Warning: after this you will have strong opinions about plantain. We don't make the rules.)

**1. Waakye** — Rice and beans cooked with sorghum leaves for a distinctive colour and taste. Often served with spaghetti, fried plantain, and your choice of protein. Perfect for breakfast or lunch.

**2. Fufu with Light Soup** — Pounded cassava and plantain (or yam) served with a light, tomato-based soup. Eat with your hands by pinching a small ball of fufu and dipping it into the soup.

**3. Jollof Rice** — The famous one-pot rice dish, spiced and often served at parties and gatherings. Ghanaian jollof has its own character—savoury, slightly smoky, and deeply satisfying.

**4. Banku and Tilapia** — Fermented corn and cassava dough with grilled tilapia, pepper sauce, and okro stew. A staple along the coast.

**5. Kelewele** — Spiced fried plantain cubes, sweet and spicy. Great as a snack or side.

**6. Kenkey and Fish** — Fermented corn dough wrapped in plantain leaves, steamed and served with fried fish and hot pepper sauce.

**7. Tuo Zaafi (TZ)** — Northern Ghana’s smooth, stretchy staple, often served with green leafy soup (ayoyo) and meat.

**8. Red Red** — Black-eyed peas stew with palm oil and fried plantain. Comforting and filling.

**9. Omo Tuo** — Rice balls served with groundnut (peanut) soup—creamy, nutty, and hearty.

**10. Hausa Koko and Koose** — Spicy millet porridge with deep-fried bean balls. A popular breakfast in the north and across the country.

Head to our [restaurant menus](/menus) to find spots in Accra, Kumasi, and beyond that serve these classics.
    `.trim(),
    imageUrl: "/images/food/Waakye.jpeg",
    imageAlt: "Waakye - rice and beans with plantain",
    publishedAt: "2025-02-01",
    author: "Ama Mensah",
    readTimeMinutes: 6,
    tags: ["Ghanaian cuisine", "Dishes", "Accra", "Kumasi"],
  },
  {
    slug: "fufu-and-soup-guide",
    title: "A Beginner's Guide to Fufu and Soup",
    excerpt:
      "How to eat fufu the right way, which soups to pair it with, and the best restaurants to try it in Ghana.",
    content: `
Fufu is one of West Africa’s most beloved staples. If you’re new to it, here’s a quick guide so you can enjoy it like a local. (Spoiler: the fufu will win the first few rounds. That's normal.)

**What is fufu?**  
Fufu is a smooth, stretchy dough made by pounding boiled starchy ingredients—usually cassava and plantain, or yam—until they’re soft and elastic. It’s served with soup and eaten by hand.

**How to eat fufu**  
Use your right hand (or left if that’s your dominant hand). Pinch a small piece of fufu, roll it gently, then dip it into the soup. Don’t chew too much—the idea is to swallow small, well-coated balls. It might feel odd at first, but you’ll get the hang of it.

**Popular soup pairings**  
- **Light soup** — Tomato-based, often with fish or meat.  
- **Groundnut soup** — Rich and nutty, great with chicken or beef.  
- **Palm nut soup** — Thick and hearty, a favourite for special occasions.  
- **Egusi** — Melon seed soup, thick and filling.

**Where to try it**  
Check our [restaurant listings](/menus) for places in Accra and Kumasi that serve fufu and soup. Many offer different soup options so you can find your favourite.
    `.trim(),
    imageUrl: "/images/food/Fufu+with+Light+Soup.jpeg",
    imageAlt: "Fufu with light soup",
    publishedAt: "2025-01-28",
    author: "Kofi Asante",
    readTimeMinutes: 4,
    tags: ["Fufu", "Soup", "Ghanaian cuisine", "How-to"],
  },
  {
    slug: "grilled-meats-and-street-food",
    title: "Grilled Meats & Street Food: Where to Go",
    excerpt:
      "The best spots for grilled meats, kebabs, and street food in Accra and Kumasi—what to order and what to expect.",
    content: `
Grilled meats and street food are at the heart of eating out in Ghana. Here’s a short guide to what to try and where to look.

**What you’ll find**  
- **Chicken / turkey** — Grilled over charcoal, often with a spicy rub or marinade.  
- **Beef and goat** — Kebabs and cuts grilled to order.  
- **Sausages** — Local and imported, often served with bread or kelewele.  
- **Kelewele** — Spiced fried plantain; the perfect side.  
- **Yam and plantain** — Grilled or fried, cheap and filling.

**Tips for ordering**  
- Ask for “medium” or “well done” if you have a preference.  
- Pepper sauce is usually on the side—add as much as you like.  
- Many spots are cash-only; have small notes handy.  
- Go at lunch or early evening for the freshest batches.

**Where to look**  
Busy streets, markets, and areas near offices and schools often have grill stands. For sit-down spots with full menus and hygiene standards, use our [restaurant and menu guide](/menus) to filter by location and cuisine.
    `.trim(),
    imageUrl: "/images/food/Grilled-meats-d32e115.jpg",
    imageAlt: "Grilled meats and kebabs",
    publishedAt: "2025-01-25",
    author: "Efua Boateng",
    readTimeMinutes: 5,
    tags: ["Street food", "Grilled meats", "Accra", "Kumasi"],
  },
  {
    slug: "local-food-nigeria-ghana-comparison",
    title: "Local Food: Similarities Between Ghana and Nigeria",
    excerpt:
      "Jollof, fufu, and more—how West African neighbours share dishes and put their own spin on them.",
    content: `
Ghana and Nigeria share a lot when it comes to food. Here’s a quick look at the overlap and what makes each country’s version special.

**Jollof**  
Both countries have iconic jollof. Nigerian jollof is often smokier (thanks to long cooking and sometimes firewood). Ghanaian jollof can be slightly sweeter and often includes more vegetables. The “jollof wars” are mostly in good fun—try both and pick your side.

**Fufu**  
Fufu exists in both countries. In Ghana you’ll often get cassava + plantain or yam. In Nigeria, pounded yam, eba (garri), and semo are also common. The soups differ too: Ghana has light soup, groundnut, palm nut; Nigeria has egusi, ogbono, and efo riro.

**Rice and beans**  
Waakye (Ghana) and waakye/beans and rice (Nigeria) are close cousins. Each region has its own spices and sides.

**Street snacks**  
Kelewele (Ghana) and dodo (Nigeria) are both fried plantain. Suya in Nigeria is similar to chichinga and other grilled meat sticks in Ghana—spicy, peanutty, and addictive.

Exploring both cuisines is a great way to appreciate West African food. Use our [menus](/menus) to find Ghanaian restaurants and dishes near you.
    `.trim(),
    imageUrl: "/images/food/Local-Food-in-Nigeria-1024x658-1.jpg",
    imageAlt: "Local West African food",
    publishedAt: "2025-01-20",
    author: "Ama Mensah",
    readTimeMinutes: 5,
    tags: ["West African", "Jollof", "Comparison", "Culture"],
  },
  {
    slug: "quick-bites-fast-food-ghana",
    title: "Quick Bites: Fast Food and Casual Dining in Ghana",
    excerpt:
      "When you need a quick meal—burgers, chicken, local fast food, and casual spots in Accra and beyond.",
    content: `
Sometimes you want a full local spread; other times you want something quick. Here’s a snapshot of fast and casual options in Ghana.

**International chains**  
Familiar brands are present in Accra and other cities—burgers, fried chicken, pizza. Good for a quick, predictable meal when you’re in a rush.

**Local fast food**  
Many Ghanaian spots do “fast” versions of local dishes: waakye in takeaway packs, jollof with chicken, rice and stew. You get the flavours without the long wait. Street-side and market stalls often offer the fastest (and cheapest) options.

**Casual sit-down**  
Restaurants that do grilled chicken, chips, and simple rice dishes fit the “quick bite” vibe. You can sit, order, and be done in under an hour. Check our [restaurant menus](/menus) for places that offer both full menus and quicker options.

**Tips**  
- Lunch hours (12–2) can be busy; ordering ahead helps.  
- Delivery and takeaway are common in bigger cities.  
- For the fastest service, stick to what’s ready—grills and one-plate specials.
    `.trim(),
    imageUrl: "/images/food/Fast-Food-Restaurants.jpg",
    imageAlt: "Fast food and casual dining",
    publishedAt: "2025-01-15",
    author: "Kofi Asante",
    readTimeMinutes: 4,
    tags: ["Fast food", "Casual dining", "Accra", "Quick bites"],
  },
  {
    slug: "restaurant-menu-tips-diners",
    title: "How to Use Restaurant Menus Like a Pro",
    excerpt:
      "Get the most out of menu browsing—portion sizes, sharing, dietary needs, and finding the best value.",
    content: `
Menus tell you more than just dish names and prices. Here’s how to read them like a pro and choose wisely.

**Portion sizes**  
Terms like “main”, “side”, and “share” give a hint. In many Ghanaian restaurants, soups and fufu are meant to be shared or are very filling—one order can be enough for two if you’re not huge eaters. When in doubt, ask: “Is this good for one or two?”

**Sharing**  
Soups, grilled meats, and rice dishes often work well for sharing. Order a few things and eat family-style so you can try more.

**Dietary needs**  
Look for vegetarian options (rice, beans, plantain, some soups). If you need halal or have allergies, call ahead or ask when you sit down. Our [restaurant list](/menus) lets you filter by cuisine and features so you can shortlist places that fit.

**Value**  
Lunch specials and “today’s dish” are often cheaper. Street food and local spots usually offer the best value; upscale places charge more for ambience and service. Compare a few menus on our site before you go.

**Final tip**  
Bookmark your favourite restaurants and check their menus before you visit—dishes and prices do change.
    `.trim(),
    imageUrl: "/images/food/Landing_image_Desktop.jpg",
    imageAlt: "Restaurant dining and menus",
    publishedAt: "2025-01-10",
    author: "Efua Boateng",
    readTimeMinutes: 4,
    tags: ["Tips", "Menus", "Dining", "Value"],
  },
  // ——— Food jokes & yawa ———
  {
    slug: "food-jokes-that-hit-different",
    title: "Food Jokes That Hit Different (No Cap)",
    excerpt:
      "Jollof that can't hear you, fufu that fights back, and other food jokes that only make sense after you've eaten.",
    content: `
We asked around. These are the food jokes that actually land at the table.

**Why did the jollof go to therapy?**  
It had too many issues. (We're not picking sides in the jollof wars. We're just saying.)

**What did the fufu say to the soup?**  
"Let's stick together." … Because that's literally what happens.

**Why does kelewele never get lost?**  
It always finds its way to the right mouth. No one says no to kelewele.

**Waakye seller:** "You want small?"  
**Also waakye seller:** *gives you enough to feed a whole compound*  
That's not a joke. That's just facts.

**Banku:** "I'm smooth."  
**Fufu:** "I'm smoother."  
**Omo tuo:** "I'm literally round. I win."

**Why did the plantain cross the road?**  
To become kelewele on the other side. (RIP ripe plantain. You were good.)

**"I'll just have a little soup."**  
*One hour later:* *empty bowl, no regrets*

If you've lived any of these, you're family. Go check our [menus](/menus) and get yourself something nice.
    `.trim(),
    imageUrl: "/images/food/Waakye.jpeg",
    imageAlt: "Waakye - the portion that was definitely 'small'",
    publishedAt: "2025-02-05",
    author: "Efua Boateng",
    readTimeMinutes: 3,
    tags: ["Jokes", "Fun", "Jollof", "Fufu"],
  },
  {
    slug: "food-yawa-we-all-know",
    title: "Food Yawa We've All Experienced",
    excerpt:
      "When the 'small' waakye could feed a village, when the pepper catches you off guard, and other relatable food drama.",
    content: `
Yawa is that moment when food does you dirty—but you'd do it again. Here's the food yawa we all know.

**The "small" portion**  
You order "small" waakye or "small" fufu. Aunty brings a bowl that could feed your whole office. You're not mad. You're just … impressed. And full for the next 12 hours.

**The pepper that wasn't playing**  
"Add small pepper." You add small. Your mouth is on fire. Your eyes are watering. You keep eating. No one can tell you to stop. That's your plate.

**The fufu that won't cooperate**  
You pinch. It slides. You dip. Soup goes everywhere. Your shirt has a new design. The table has a new design. The fufu is still winning. We've all been there.

**"I'm not that hungry"**  
You say it. You get one main. Then you taste your friend's. Next thing you're sharing and ordering more. Hunger was never the point. Good food was.

**The bill arrives**  
You ate like a king. The bill is actually reasonable. The real yawa? You have to leave and you're too full to move. Worth it.

**The takeaway that leaks**  
Black sack. Soup. Long journey. You know what happens. The bag has a new zip code. Your car seat has a new smell. Still ate the food. No regrets.

If this is your life, welcome. You're in good company. Find more good food on our [restaurant menus](/menus).
    `.trim(),
    imageUrl: "/images/food/Fufu+with+Light+Soup.jpeg",
    imageAlt: "Fufu and soup - the combo that always wins",
    publishedAt: "2025-02-04",
    author: "Kofi Asante",
    readTimeMinutes: 4,
    tags: ["Yawa", "Relatable", "Fun", "Ghanaian food"],
  },
  {
    slug: "jollof-wars-unbiased-take",
    title: "Jollof Wars: A Completely Unbiased Take (We Promise)",
    excerpt:
      "Ghana vs Nigeria vs Senegal vs … everyone. We take no sides. We just take seconds.",
    content: `
Let's talk about the jollof wars. As your trusted food blog, we are 100% neutral. Totally unbiased. No favouritism at all.

**Ghana jollof**  
Some say it's sweeter. Some say it has more veg. We say: have you tried it with shito? Because that's a whole new level. (Still neutral.)

**Nigerian jollof**  
The smokiness. The party vibes. The fact that it's always at the wedding. We're not saying it's the best. We're just saying we've never said no to a plate. (Neutral.)

**Senegal's thieboudienne**  
Okay, technically not "jollof" but it's in the family. Fish, veg, that rice. We're not comparing. We're just … appreciating. (Very neutral.)

**The real take**  
The only war we support is the one against bad jollof. Undercooked rice? Yawa. No depth of flavour? Yawa. No plantain on the side? We need to have a conversation.

So who wins? The one on your plate when you're hungry. Check our [menus](/menus) and let the best jollof win—at your table.
    `.trim(),
    imageUrl: "/images/food/Local-Food-in-Nigeria-1024x658-1.jpg",
    imageAlt: "Jollof and the great debate",
    publishedAt: "2025-02-03",
    author: "Ama Mensah",
    readTimeMinutes: 3,
    tags: ["Jollof", "Fun", "West African", "Debate"],
  },
  {
    slug: "signs-youre-a-ghanaian-foodie",
    title: "12 Signs You're a Ghanaian Foodie (No Denial)",
    excerpt:
      "You judge people by their fufu technique. You have a waakye day. You know exactly what 'small pepper' means. Sound familiar?",
    content: `
You might be a Ghanaian foodie if …

**1.** You have a dedicated "waakye day" and nothing can move it.

**2.** You judge someone's character by how they eat fufu. (Scoop and swallow. We're watching.)

**3.** "Small pepper" has a very specific meaning in your head—and it's never actually small.

**4.** You've argued about which region has the best groundnut soup. You had evidence.

**5.** You can tell good kelewele from "they tried" kelewele from one bite.

**6.** You've driven across town because someone said a spot has "the best" something. No regrets.

**7.** Your mood improves the moment you see banku and tilapia on the menu.

**8.** You've said "I'm full" and then finished someone else's leftovers. That's not greed. That's respect for food.

**9.** You know exactly which chop bar gives the biggest "small" portion—and you go there on purpose.

**10.** You've defended your favourite jollof in a group chat. With paragraphs.

**11.** Plantain (ripe, unripe, kelewele, dodo) is a whole food group for you.

**12.** You're already thinking about what you're eating next while you're eating. That's not rude. That's planning.

If you ticked more than half, welcome to the club. Now go [browse some menus](/menus) and treat yourself.
    `.trim(),
    imageUrl: "/images/food/Grilled-meats-d32e115.jpg",
    imageAlt: "Food worth driving across town for",
    publishedAt: "2025-02-02",
    author: "Efua Boateng",
    readTimeMinutes: 4,
    tags: ["Foodie", "Fun", "Ghanaian", "Relatable"],
  },
  {
    slug: "when-hunger-chooses-for-you",
    title: "When Hunger Chooses for You: Tales from the Table",
    excerpt:
      "You said one thing. Your stomach said another. The waiter heard your stomach. Here's what happened next.",
    content: `
We've all been there. You open the menu with a plan. Then the plan goes out the window.

**The "light lunch" that wasn't**  
You said salad. You meant salad. Then you saw "jollof with chicken and plantain" and your mouth said "that one" before your brain could object. No shame. Salad is for tomorrow.

**The "I'll share" that became "I'll have my own"**  
Sharing is caring. But then the food arrived and you remembered you don't share when it's this good. Sorry not sorry. Order another plate.

**The pepper that chose violence**  
You said "medium." The kitchen heard "make them remember today." You ate it anyway. You're still recovering. You'd do it again.

**The bill that surprised nobody**  
You knew. You knew when you added the extra kelewele. You knew when you got the big fufu. You knew. And you'd do it again.

**The nap that followed**  
Food coma is real. Ghanaian food coma is a whole experience. You're not lazy. You're digesting. Respect the process.

The moral? Let hunger and the menu work together. See what's on offer on our [restaurant menus](/menus) and let the day decide.
    `.trim(),
    imageUrl: "/images/food/Fast-Food-Restaurants.jpg",
    imageAlt: "When the eyes are bigger than the stomach (allegedly)",
    publishedAt: "2025-01-30",
    author: "Kofi Asante",
    readTimeMinutes: 3,
    tags: ["Fun", "Relatable", "Hunger", "Yawa"],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
