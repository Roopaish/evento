export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const eventTags = {
  "Music and Performing Arts": [
    "Concert",
    "Live Music",
    "Music Festival",
    "Opera",
    "Symphony",
    "Jazz",
    "Blues",
    "Rock",
    "Pop",
    "Classical",
    "Dance",
    "Ballet",
    "Theatre",
    "Comedy Show",
    "Stand-Up Comedy",
    "Musical",
    "Performance Art",
  ],
  "Art and Culture": [
    "Art Exhibition",
    "Art Gallery",
    "Museum",
    "Photography",
    "Sculpture",
    "Painting",
    "Modern Art",
    "Historical Exhibit",
    "Cultural Festival",
    "Literature",
    "Poetry Reading",
    "Book Launch",
    "Writing Workshop",
  ],
  "Sports and Recreation": [
    "Football",
    "Basketball",
    "Baseball",
    "Soccer",
    "Tennis",
    "Cricket",
    "Hockey",
    "Golf",
    "Marathon",
    "Running",
    "Cycling",
    "Swimming",
    "Yoga",
    "Fitness Class",
    "Hiking",
    "Climbing",
    "Skating",
    "Skiing",
  ],
  "Food and Drink": [
    "Food Festival",
    "Wine Tasting",
    "Beer Festival",
    "Cooking Class",
    "Baking Class",
    "Food Market",
    "Restaurant Week",
    "Gourmet Dinner",
    "Farmers Market",
    "Food Truck",
    "Brewery Tour",
    "Winery Tour",
  ],
  "Technology and Science": [
    "Tech Conference",
    "Startup Pitch",
    "Hackathon",
    "Coding Workshop",
    "AI Conference",
    "Robotics",
    "Space Exploration",
    "Science Fair",
    "Innovation Summit",
    "Blockchain",
    "Cybersecurity",
    "Software Development",
  ],
  "Business and Networking": [
    "Business Conference",
    "Networking Event",
    "Startup Meetup",
    "Trade Show",
    "Industry Panel",
    "Business Seminar",
    "Leadership Summit",
    "Sales Workshop",
    "Marketing Workshop",
    "Entrepreneurship",
  ],
  "Education and Learning": [
    "Workshop",
    "Seminar",
    "Lecture",
    "Online Course",
    "Webinar",
    "Training",
    "Career Fair",
    "Education Expo",
    "Language Class",
    "Personal Development",
  ],
  "Community and Social": [
    "Charity Event",
    "Fundraiser",
    "Community Gathering",
    "Volunteer Event",
    "Meetup",
    "Support Group",
    "Club Meeting",
    "Social Gathering",
    "Networking",
  ],
  "Health and Wellness": [
    "Health Fair",
    "Medical Conference",
    "Mental Health Workshop",
    "Wellness Retreat",
    "Meditation",
    "Mindfulness",
    "Nutrition Workshop",
    "Fitness Expo",
    "Health Screening",
  ],
  "Family and Kids": [
    "Family Fun Day",
    "Kids Workshop",
    "Children's Theatre",
    "Petting Zoo",
    "Circus",
    "Magic Show",
    "Storytelling",
    "Craft Workshop",
    "Parade",
  ],
  "Travel and Adventure": [
    "Travel Expo",
    "Adventure Tour",
    "Sightseeing",
    "Camping",
    "Road Trip",
    "Eco-tourism",
    "Safari",
    "Cultural Tour",
    "Cruise",
    "Expedition",
  ],
}

export const eventTagsList = Object.keys(eventTags).reduce((acc, key) => {
  return acc.concat(eventTags[key as keyof typeof eventTags])
}, [] as string[])

export const eventCategories = Object.keys(eventTags)

export const WEBSITE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
export const URL_PREFIX = WEBSITE_URL.split("//")[0]!
export const URL_ORIGIN = WEBSITE_URL.split("//")[1]!
