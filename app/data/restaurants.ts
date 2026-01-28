export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string;
  imageUrl: string;
  location: string;
  rating: number;
  menu: MenuItem[];
}

// Local images from /public/images/restuarants/
const restaurantImages = [
  "/images/restuarants/1000s.jpg",
  "/images/restuarants/aesthetic-rest-hero.jpeg",
  "/images/restuarants/GoodtimeHotel_52.jpeg",
  "/images/restuarants/restaurant-decoration.jpg",
  "/images/restuarants/the-feast-restaurant_dba580db.jpeg",
] as const;

function getRestaurantImageUrl(index: number): string {
  return restaurantImages[index % restaurantImages.length];
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Ike's Cafe and Grill",
    cuisine: "Ghanaian",
    description: "Traditional Ghanaian dishes in a cultural setting at the Ghana National Cultural Centre",
    image: "🍛",
    imageUrl: getRestaurantImageUrl(0),
    location: "Ghana National Cultural Centre, Kumasi",
    rating: 4.7,
    menu: [
      {
        id: "m1",
        name: "Jollof Rice with Grilled Chicken",
        description: "Fragrant tomato-based rice with perfectly grilled chicken and fried plantain",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m2",
        name: "Banku and Tilapia",
        description: "Fermented corn and cassava dough with grilled tilapia fish and hot pepper sauce",
        price: 55.00,
        category: "Main Dishes"
      },
      {
        id: "m3",
        name: "Fufu with Light Soup",
        description: "Pounded cassava and plantain with chicken light soup",
        price: 50.00,
        category: "Soups & Stews"
      },
      {
        id: "m4",
        name: "Kelewele",
        description: "Spicy fried plantains with ginger and spices",
        price: 20.00,
        category: "Sides"
      },
      {
        id: "m5",
        name: "Grilled Suya",
        description: "Spiced beef skewers grilled to perfection",
        price: 40.00,
        category: "Grilled"
      },
      { id: "m1d1", name: "Fresh Palm Wine", description: "Local palm wine", price: 15.00, category: "Drinks" },
      { id: "m1d2", name: "Ginger Beer", description: "House-made spicy ginger beer", price: 12.00, category: "Drinks" }
    ]
  },
  {
    id: "2",
    name: "Casa Restaurant",
    cuisine: "Ghanaian",
    description: "Authentic local cuisine with a modern twist",
    image: "🍲",
    imageUrl: getRestaurantImageUrl(1),
    location: "Ofori Kuragu Ave, Kumasi",
    rating: 4.6,
    menu: [
      {
        id: "m6",
        name: "Waakye Special",
        description: "Rice and beans cooked together, served with spaghetti, gari, meat stew, and salad",
        price: 40.00,
        category: "Main Dishes"
      },
      {
        id: "m7",
        name: "Red Red",
        description: "Black-eyed peas stew with fried plantains and gari",
        price: 30.00,
        category: "Vegetarian"
      },
      {
        id: "m8",
        name: "Rice Balls with Peanut Butter Soup",
        description: "Rice balls served with rich peanut butter soup and goat meat",
        price: 45.00,
        category: "Soups & Stews"
      },
      {
        id: "m9",
        name: "Kontomire Stew",
        description: "Cocoyam leaves stew with palm oil, served with boiled eggs and plantain",
        price: 35.00,
        category: "Soups & Stews"
      },
      {
        id: "m10",
        name: "Ghanaian Salad",
        description: "Fresh mixed salad with cabbage, carrots, and local vegetables",
        price: 20.00,
        category: "Sides"
      },
      { id: "m2d1", name: "Sobolo", description: "Hibiscus drink, refreshed and iced", price: 10.00, category: "Drinks" },
      { id: "m2d2", name: "Pineapple Fizz", description: "Fresh pineapple with soda", price: 14.00, category: "Drinks" }
    ]
  },
  {
    id: "3",
    name: "AMBE",
    cuisine: "Ghanaian",
    description: "Traditional Ghanaian restaurant serving authentic local dishes",
    image: "🥘",
    imageUrl: getRestaurantImageUrl(2),
    location: "Adiembra Rd, Kumasi",
    rating: 4.8,
    menu: [
      {
        id: "m11",
        name: "Fufu with Groundnut Soup",
        description: "Pounded fufu served with rich groundnut soup and goat meat",
        price: 50.00,
        category: "Soups & Stews"
      },
      {
        id: "m12",
        name: "Fufu with Palm Nut Soup",
        description: "Traditional palm nut soup with fufu and fish or meat",
        price: 55.00,
        category: "Soups & Stews"
      },
      {
        id: "m13",
        name: "Ampesi",
        description: "Boiled yam, plantain, and cocoyam with kontomire stew",
        price: 40.00,
        category: "Main Dishes"
      },
      {
        id: "m14",
        name: "Kenkey and Fish",
        description: "Fermented corn dough with fried fish, pepper sauce, and vegetables",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m15",
        name: "Omo Tuo",
        description: "Rice balls with groundnut soup or palm nut soup",
        price: 40.00,
        category: "Soups & Stews"
      },
      { id: "m3d1", name: "Lemon Grass Tea", description: "Hot or iced lemon grass infusion", price: 8.00, category: "Drinks" },
      { id: "m3d2", name: "Bissap", description: "Hibiscus and ginger refreshment", price: 10.00, category: "Drinks" }
    ]
  },
  {
    id: "4",
    name: "Daloo Fine Dining and Cafe",
    cuisine: "Ghanaian",
    description: "Fine dining experience with exquisite Ghanaian cuisine",
    image: "🍽️",
    imageUrl: getRestaurantImageUrl(3),
    location: "Ahinsan / Lake Rd, Kumasi",
    rating: 4.9,
    menu: [
      {
        id: "m16",
        name: "Premium Jollof Rice",
        description: "Special recipe jollof rice with grilled chicken, fried plantain, and coleslaw",
        price: 55.00,
        category: "Main Dishes"
      },
      {
        id: "m17",
        name: "Grilled Tilapia Platter",
        description: "Whole grilled tilapia with banku, hot pepper sauce, and fresh vegetables",
        price: 65.00,
        category: "Grilled"
      },
      {
        id: "m18",
        name: "Chicken Light Soup with Fufu",
        description: "Fresh chicken light soup with pounded fufu",
        price: 60.00,
        category: "Soups & Stews"
      },
      {
        id: "m19",
        name: "Beef Stew with Rice",
        description: "Rich beef stew served with steamed rice and fried plantain",
        price: 50.00,
        category: "Main Dishes"
      },
      {
        id: "m20",
        name: "Fresh Palm Nut Soup",
        description: "Traditional palm nut soup with fufu, fish, and vegetables",
        price: 58.00,
        category: "Soups & Stews"
      },
      {
        id: "m21",
        name: "Kelewele Platter",
        description: "Spicy fried plantains with roasted peanuts",
        price: 25.00,
        category: "Sides"
      },
      { id: "m4d1", name: "Mango Lassi", description: "Smooth mango and yogurt drink", price: 16.00, category: "Drinks" },
      { id: "m4d2", name: "Sparkling Water", description: "Local still or sparkling", price: 6.00, category: "Drinks" }
    ]
  },
  {
    id: "5",
    name: "Le Petit Oiseau",
    cuisine: "Ghanaian Fusion",
    description: "Contemporary Ghanaian cuisine with international influences",
    image: "🦜",
    imageUrl: getRestaurantImageUrl(4),
    location: "Ring Rd East, Accra",
    rating: 4.7,
    menu: [
      {
        id: "m22",
        name: "Jollof Risotto",
        description: "Fusion jollof rice in risotto style with grilled chicken",
        price: 58.00,
        category: "Main Dishes"
      },
      {
        id: "m23",
        name: "Grilled Suya Skewers",
        description: "Premium beef suya skewers with spiced peanut sauce",
        price: 55.00,
        category: "Grilled"
      },
      {
        id: "m24",
        name: "Tilapia with Banku",
        description: "Grilled tilapia served with banku and pepper sauce",
        price: 62.00,
        category: "Main Dishes"
      },
      {
        id: "m25",
        name: "Palm Nut Soup Bowl",
        description: "Modern presentation of palm nut soup with fufu",
        price: 60.00,
        category: "Soups & Stews"
      },
      {
        id: "m26",
        name: "Kelewele Spring Rolls",
        description: "Creative twist on kelewele in spring roll form",
        price: 35.00,
        category: "Appetizers"
      },
      { id: "m5d1", name: "Passion Fruit Mojito", description: "Non-alcoholic passion and mint", price: 18.00, category: "Drinks" },
      { id: "m5d2", name: "Iced Coffee", description: "Cold brew with milk option", price: 14.00, category: "Drinks" }
    ]
  },
  {
    id: "6",
    name: "Treehouse Restaurant",
    cuisine: "Ghanaian",
    description: "Unique dining experience with traditional Ghanaian flavors",
    image: "🌳",
    imageUrl: getRestaurantImageUrl(0),
    location: "West Light Industrial Area, Nyaniba, Accra",
    rating: 4.8,
    menu: [
      {
        id: "m27",
        name: "Jollof Rice Deluxe",
        description: "Premium jollof rice with choice of chicken, beef, or fish",
        price: 50.00,
        category: "Main Dishes"
      },
      {
        id: "m28",
        name: "Banku and Okro Stew",
        description: "Fermented banku with fresh okro stew and fish",
        price: 48.00,
        category: "Main Dishes"
      },
      {
        id: "m29",
        name: "Groundnut Soup with Fufu",
        description: "Rich groundnut soup with fufu and meat",
        price: 52.00,
        category: "Soups & Stews"
      },
      {
        id: "m30",
        name: "Fried Rice with Chicken",
        description: "Ghanaian-style fried rice with grilled chicken",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m31",
        name: "Waakye with Beef",
        description: "Traditional waakye with beef stew and all accompaniments",
        price: 42.00,
        category: "Main Dishes"
      },
      { id: "m6d1", name: "Club Beer", description: "Local lager, bottled", price: 12.00, category: "Drinks" },
      { id: "m6d2", name: "Coconut Water", description: "Fresh chilled coconut", price: 10.00, category: "Drinks" }
    ]
  },
  {
    id: "7",
    name: "No 5 Bar & Restaurant",
    cuisine: "Ghanaian",
    description: "Casual dining with great food and drinks",
    image: "🍻",
    imageUrl: getRestaurantImageUrl(1),
    location: "Lesley Opoku-Ware Dr, Kumasi",
    rating: 4.6,
    menu: [
      {
        id: "m32",
        name: "Grilled Chicken and Jollof",
        description: "Succulent grilled chicken with jollof rice and salad",
        price: 48.00,
        category: "Main Dishes"
      },
      {
        id: "m33",
        name: "Chichinga Platter",
        description: "Ghanaian beef kebabs with spicy peanut sauce",
        price: 45.00,
        category: "Grilled"
      },
      {
        id: "m34",
        name: "Fried Rice with Shrimp",
        description: "Ghanaian fried rice with fresh shrimp and vegetables",
        price: 50.00,
        category: "Main Dishes"
      },
      {
        id: "m35",
        name: "Pepper Soup",
        description: "Spicy pepper soup with fish or meat",
        price: 38.00,
        category: "Soups & Stews"
      },
      {
        id: "m36",
        name: "Kelewele",
        description: "Spicy fried plantains, perfect side dish",
        price: 22.00,
        category: "Sides"
      },
      {
        id: "m37",
        name: "Fried Yam and Eggs",
        description: "Crispy fried yam with scrambled eggs",
        price: 35.00,
        category: "Breakfast"
      },
      { id: "m7d1", name: "Star Beer", description: "Chilled local beer", price: 11.00, category: "Drinks" },
      { id: "m7d2", name: "Tropical Juice", description: "Pineapple, mango, or passion", price: 13.00, category: "Drinks" }
    ]
  },
  {
    id: "8",
    name: "THE MIX RESTAURANT ACCRA",
    cuisine: "Ghanaian",
    description: "Mix of traditional and modern Ghanaian dishes",
    image: "🎯",
    imageUrl: getRestaurantImageUrl(2),
    location: "Okodan Rd, Accra",
    rating: 4.7,
    menu: [
      {
        id: "m38",
        name: "Mixed Grill Platter",
        description: "Combination of grilled chicken, tilapia, and beef suya",
        price: 65.00,
        category: "Grilled"
      },
      {
        id: "m39",
        name: "Jollof Rice with Mixed Meats",
        description: "Jollof rice with chicken, beef, and fried plantain",
        price: 52.00,
        category: "Main Dishes"
      },
      {
        id: "m40",
        name: "Fufu with Fish Light Soup",
        description: "Pounded fufu with fresh fish light soup",
        price: 55.00,
        category: "Soups & Stews"
      },
      {
        id: "m41",
        name: "Waakye Combo",
        description: "Waakye with fried egg, meat stew, gari, and salad",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m42",
        name: "Banku and Tilapia",
        description: "Fresh banku with grilled tilapia and pepper sauce",
        price: 53.00,
        category: "Main Dishes"
      },
      { id: "m8d1", name: "Pito", description: "Traditional fermented sorghum drink", price: 9.00, category: "Drinks" },
      { id: "m8d2", name: "Lemonade", description: "Fresh squeezed lemonade", price: 10.00, category: "Drinks" }
    ]
  },
  {
    id: "9",
    name: "Tribeca Ghana",
    cuisine: "Ghanaian",
    description: "Contemporary Ghanaian restaurant with urban vibes",
    image: "🏙️",
    imageUrl: getRestaurantImageUrl(3),
    location: "Noi Fetreke St, Accra",
    rating: 4.8,
    menu: [
      {
        id: "m43",
        name: "Signature Jollof",
        description: "House special jollof rice recipe with grilled chicken",
        price: 55.00,
        category: "Main Dishes"
      },
      {
        id: "m44",
        name: "Grilled Tilapia Special",
        description: "Premium grilled tilapia with banku and fresh vegetables",
        price: 68.00,
        category: "Grilled"
      },
      {
        id: "m45",
        name: "Groundnut Soup Bowl",
        description: "Rich groundnut soup with fufu and your choice of meat",
        price: 58.00,
        category: "Soups & Stews"
      },
      {
        id: "m46",
        name: "Chicken and Chips",
        description: "Ghanaian-style fried chicken with french fries",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m47",
        name: "Red Red Deluxe",
        description: "Black-eyed peas stew with fried plantains and avocado",
        price: 38.00,
        category: "Vegetarian"
      },
      {
        id: "m48",
        name: "Suya Platter",
        description: "Premium beef suya with onions, tomatoes, and spices",
        price: 50.00,
        category: "Grilled"
      },
      { id: "m9d1", name: "Fresh Lime Soda", description: "Lime, sugar, and soda", price: 11.00, category: "Drinks" },
      { id: "m9d2", name: "Watermelon Juice", description: "Chilled fresh watermelon", price: 12.00, category: "Drinks" }
    ]
  },
  {
    id: "10",
    name: "The Buka Restaurant, Osu",
    cuisine: "Ghanaian",
    description: "Authentic chop bar experience in the heart of Osu",
    image: "🍲",
    imageUrl: getRestaurantImageUrl(4),
    location: "10th St, Osu, Accra",
    rating: 4.9,
    menu: [
      {
        id: "m49",
        name: "Traditional Fufu",
        description: "Pounded fufu with your choice of soup (light, groundnut, or palm nut)",
        price: 50.00,
        category: "Soups & Stews"
      },
      {
        id: "m50",
        name: "Waakye Special",
        description: "Classic waakye with all traditional accompaniments",
        price: 38.00,
        category: "Main Dishes"
      },
      {
        id: "m51",
        name: "Banku and Okro",
        description: "Fresh banku with okro stew and fish",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m52",
        name: "Kenkey and Fried Fish",
        description: "Fermented kenkey with whole fried fish and pepper sauce",
        price: 48.00,
        category: "Main Dishes"
      },
      {
        id: "m53",
        name: "Kontomire with Plantain",
        description: "Cocoyam leaves stew with boiled eggs and fried plantain",
        price: 35.00,
        category: "Soups & Stews"
      },
      {
        id: "m54",
        name: "Jollof Rice",
        description: "Traditional jollof rice with chicken or beef",
        price: 42.00,
        category: "Main Dishes"
      },
      { id: "m10d1", name: "Asana", description: "Sweet fermented corn drink", price: 8.00, category: "Drinks" },
      { id: "m10d2", name: "Mint Lemonade", description: "Fresh mint and lemon", price: 10.00, category: "Drinks" }
    ]
  },
  {
    id: "11",
    name: "Super-Mc Restaurant - Bomso Branch",
    cuisine: "Ghanaian",
    description: "Popular local restaurant serving classic Ghanaian meals",
    image: "🍛",
    imageUrl: getRestaurantImageUrl(0),
    location: "JK Acheampong Ave, Kumasi",
    rating: 4.7,
    menu: [
      {
        id: "m55",
        name: "Jollof Rice with Chicken",
        description: "Classic jollof rice with grilled chicken and fried plantain",
        price: 43.00,
        category: "Main Dishes"
      },
      {
        id: "m56",
        name: "Fried Rice",
        description: "Ghanaian fried rice with chicken and vegetables",
        price: 40.00,
        category: "Main Dishes"
      },
      {
        id: "m57",
        name: "Beef Stew with Rice",
        description: "Rich beef stew served with steamed rice",
        price: 45.00,
        category: "Main Dishes"
      },
      {
        id: "m58",
        name: "Banku and Tilapia",
        description: "Fresh banku with grilled tilapia and pepper sauce",
        price: 48.00,
        category: "Main Dishes"
      },
      {
        id: "m59",
        name: "Waakye",
        description: "Traditional waakye with meat stew and all sides",
        price: 35.00,
        category: "Main Dishes"
      },
      {
        id: "m60",
        name: "Gari and Beans",
        description: "Soaked gari with beans stew, palm oil, and fried egg",
        price: 28.00,
        category: "Main Dishes"
      },
      { id: "m11d1", name: "Maltina", description: "Non-alcoholic malt drink", price: 7.00, category: "Drinks" },
      { id: "m11d2", name: "Zobo", description: "Spiced hibiscus drink", price: 9.00, category: "Drinks" }
    ]
  },
  {
    id: "12",
    name: "Casa Nostra Restaurant",
    cuisine: "Ghanaian",
    description: "Local dining spot with authentic Ghanaian home cooking",
    image: "🏠",
    imageUrl: getRestaurantImageUrl(1),
    location: "Kumasi",
    rating: 4.6,
    menu: [
      {
        id: "m61",
        name: "Home-Style Jollof",
        description: "Traditional home-cooked jollof rice with chicken",
        price: 40.00,
        category: "Main Dishes"
      },
      {
        id: "m62",
        name: "Fufu with Light Soup",
        description: "Homemade fufu with chicken light soup",
        price: 45.00,
        category: "Soups & Stews"
      },
      {
        id: "m63",
        name: "Groundnut Soup",
        description: "Family recipe groundnut soup with fufu",
        price: 48.00,
        category: "Soups & Stews"
      },
      {
        id: "m64",
        name: "Red Red",
        description: "Black-eyed peas stew with fried plantains",
        price: 32.00,
        category: "Vegetarian"
      },
      {
        id: "m65",
        name: "Omo Tuo",
        description: "Rice balls with groundnut soup",
        price: 38.00,
        category: "Soups & Stews"
      },
      {
        id: "m66",
        name: "Kontomire Stew",
        description: "Fresh cocoyam leaves stew with plantain",
        price: 33.00,
        category: "Soups & Stews"
      },
      { id: "m12d1", name: "Ginger Tea", description: "Hot ginger and lemon", price: 8.00, category: "Drinks" },
      { id: "m12d2", name: "Orange Fanta", description: "Chilled soft drink", price: 6.00, category: "Drinks" }
    ]
  }
];
