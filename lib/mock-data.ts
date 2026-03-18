/* ── Types ─── */

export interface User {
  id: string
  name: string
  avatar: string
  role: "youth" | "organization"
  level: number
  levelTitle: string
  xp: number
  xpToNextLevel: number
  trustScore: number
  hoursLogged: number
  tasksCompleted: number
  badgesEarned: number
  skills: string[]
  causes: string[]
  bio: string
  joinedDate: string
}

export interface Opportunity {
  id: string
  title: string
  organization: string
  orgAvatar: string
  description: string
  category: string
  location: string
  date: string
  timeCommitment: string
  xpReward: number
  spotsLeft: number
  totalSpots: number
  tags: string[]
  featured: boolean
  urgent: boolean
}

export interface ActivityItem {
  id: string
  type: "xp_earned" | "task_completed" | "badge_earned" | "level_up" | "signup"
  title: string
  description: string
  xp?: number
  timestamp: string
  icon: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  xp: number
  level: number
  levelTitle: string
}

export interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
  category: string
}

/* ── Mock User ─── */

export const mockUser: User = {
  id: "u1",
  name: "Cathy Luo",
  avatar: "/images/cathy-luo.jpg",
  role: "youth",
  level: 3,
  levelTitle: "Community Builder",
  xp: 1250,
  xpToNextLevel: 2000,
  trustScore: 87,
  hoursLogged: 42,
  tasksCompleted: 18,
  badgesEarned: 7,
  skills: ["Event Planning", "Social Media", "Photography", "Public Speaking"],
  causes: ["Climate Action", "Education", "Community Building"],
  bio: "Vancouver local passionate about making a difference. Love coffee, hiking, and building community!",
  joinedDate: "2025-09-15",
}

/* ── Mock Opportunities ─── */

export const mockOpportunities: Opportunity[] = [
  {
    id: "op1",
    title: "Habitat Restoration Day",
    organization: "Nature Vancouver",
    orgAvatar: "",
    description: "Help restore native plant habitat at New Brighton Park. We'll remove invasive species, plant native seedlings, and monitor shoreline health alongside experienced ecologists.",
    category: "Environment",
    location: "New Brighton Park, Vancouver",
    date: "2026-04-12",
    timeCommitment: "4 hours",
    xpReward: 175,
    spotsLeft: 6,
    totalSpots: 20,
    tags: ["Outdoors", "Restoration", "Beginner-Friendly"],
    featured: true,
    urgent: false,
  },
  {
    id: "op2",
    title: "Britannia Bulk Buy Food Club",
    organization: "Vancouver Neighbourhood Food Networks",
    orgAvatar: "",
    description: "Help run the Britannia Community bulk buy food program. Volunteers help sort, pack, and distribute affordable food boxes to neighbours in need — no experience required.",
    category: "Food",
    location: "Britannia Community Centre, Vancouver",
    date: "2026-04-05",
    timeCommitment: "3 hours",
    xpReward: 140,
    spotsLeft: 4,
    totalSpots: 12,
    tags: ["Food Security", "Community", "Beginner-Friendly"],
    featured: true,
    urgent: false,
  },
  {
    id: "op3",
    title: "Community Garden Planting Day",
    organization: "Green Roots Collective",
    orgAvatar: "",
    description:
      "Get your hands dirty and help plant spring vegetables at our community garden. Great way to learn about sustainable food!",
    category: "Environment",
    location: "Strathcona, Vancouver",
    date: "2026-03-22",
    timeCommitment: "4 hours",
    xpReward: 175,
    spotsLeft: 12,
    totalSpots: 30,
    tags: ["Outdoors", "Hands-On", "Beginner-Friendly"],
    featured: false,
    urgent: false,
  },
  {
    id: "op4",
    title: "Senior Center Social Afternoon",
    organization: "Sunshine Seniors Society",
    orgAvatar: "",
    description:
      "Spend an afternoon chatting, playing games, and bringing joy to seniors. Your presence makes all the difference.",
    category: "Community",
    location: "Kitsilano Community Centre",
    date: "2026-03-18",
    timeCommitment: "3 hours",
    xpReward: 125,
    spotsLeft: 6,
    totalSpots: 15,
    tags: ["Social", "Seniors", "Beginner-Friendly"],
    featured: false,
    urgent: false,
  },
  {
    id: "op5",
    title: "Data Wall Workshop Mentor",
    organization: "Tau Ceti Volunteer",
    orgAvatar: "",
    description: "Guide youth through hands-on data visualization workshops. You'll help participants build their own 'data walls' — physical or digital displays telling stories from their community.",
    category: "Education",
    location: "Vancouver (hybrid)",
    date: "2026-04-19",
    timeCommitment: "2 hours/week",
    xpReward: 210,
    spotsLeft: 2,
    totalSpots: 8,
    tags: ["Tech", "Mentoring", "Data"],
    featured: true,
    urgent: true,
  },
  {
    id: "op6",
    title: "Food Bank Sorting & Distribution",
    organization: "Greater Vancouver Food Bank",
    orgAvatar: "",
    description:
      "Sort donated food items and help distribute them to families in need. Fast-paced and rewarding!",
    category: "Community",
    location: "East Hastings, Vancouver",
    date: "2026-03-16",
    timeCommitment: "4 hours",
    xpReward: 175,
    spotsLeft: 5,
    totalSpots: 20,
    tags: ["Physical", "High Impact", "Urgent"],
    featured: false,
    urgent: true,
  },
  {
    id: "op7",
    title: "Trail Restoration on Grouse Mountain",
    organization: "BC Parks Foundation",
    orgAvatar: "",
    description:
      "Help maintain and restore hiking trails. Great exercise and a chance to give back to nature!",
    category: "Environment",
    location: "Grouse Mountain, North Van",
    date: "2026-04-05",
    timeCommitment: "6 hours",
    xpReward: 300,
    spotsLeft: 10,
    totalSpots: 15,
    tags: ["Outdoors", "Physical", "Adventure"],
    featured: false,
    urgent: false,
  },
  {
    id: "op8",
    title: "Newcomer Welcome Event Volunteer",
    organization: "Welcome BC",
    orgAvatar: "",
    description:
      "Help welcome new immigrants at a community social event. Multilingual volunteers especially valued!",
    category: "Community",
    location: "Metrotown, Burnaby",
    date: "2026-03-25",
    timeCommitment: "4 hours",
    xpReward: 200,
    spotsLeft: 8,
    totalSpots: 20,
    tags: ["Social", "Multilingual", "Cultural"],
    featured: false,
    urgent: false,
  },
]

/* ── Mock Activity Feed ─── */

export const mockActivity: ActivityItem[] = [
  {
    id: "a1",
    type: "xp_earned",
    title: "Earned 150 XP",
    description: "Beach Cleanup at English Bay",
    xp: 150,
    timestamp: "2 hours ago",
    icon: "Sparkles",
  },
  {
    id: "a2",
    type: "badge_earned",
    title: "New Badge: Ocean Protector",
    description: "Completed 3 environmental tasks",
    timestamp: "2 hours ago",
    icon: "Award",
  },
  {
    id: "a3",
    type: "task_completed",
    title: "Task Completed",
    description: "Youth Coding Workshop - Week 4",
    xp: 200,
    timestamp: "1 day ago",
    icon: "CheckCircle",
  },
  {
    id: "a4",
    type: "level_up",
    title: "Level Up! Now Level 3",
    description: "Community Builder unlocked",
    timestamp: "3 days ago",
    icon: "TrendingUp",
  },
  {
    id: "a5",
    type: "xp_earned",
    title: "Earned 125 XP",
    description: "Senior Center Social Afternoon",
    xp: 125,
    timestamp: "5 days ago",
    icon: "Sparkles",
  },
]

/* ── Mock Leaderboard ─── */

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "u2", name: "Alex Rivera", avatar: "", xp: 3400, level: 5, levelTitle: "Impact Leader" },
  { rank: 2, userId: "u3", name: "Priya Sharma", avatar: "", xp: 2900, level: 4, levelTitle: "Changemaker" },
  { rank: 3, userId: "u4", name: "Liam Nguyen", avatar: "", xp: 2100, level: 4, levelTitle: "Changemaker" },
  { rank: 4, userId: "u1", name: "Cathy Luo", avatar: "", xp: 1250, level: 3, levelTitle: "Community Builder" },
  { rank: 5, userId: "u5", name: "Sophia Park", avatar: "", xp: 1100, level: 3, levelTitle: "Community Builder" },
]

/* ── Mock Badges ─── */

export const mockBadges: BadgeData[] = [
  { id: "b1", name: "First Steps", description: "Complete your first task", icon: "Footprints", earned: true, earnedDate: "2025-09-20", category: "Milestone" },
  { id: "b2", name: "Ocean Protector", description: "Complete 3 environmental tasks", icon: "Waves", earned: true, earnedDate: "2026-03-02", category: "Environment" },
  { id: "b3", name: "Helping Hand", description: "Log 10 volunteer hours", icon: "HandHeart", earned: true, earnedDate: "2025-11-10", category: "Milestone" },
  { id: "b4", name: "Social Butterfly", description: "Attend 5 community events", icon: "Users", earned: true, earnedDate: "2025-12-05", category: "Community" },
  { id: "b5", name: "Tech Mentor", description: "Mentor in 3 tech workshops", icon: "Code", earned: true, earnedDate: "2026-02-15", category: "Education" },
  { id: "b6", name: "Early Bird", description: "Sign up within first week of launch", icon: "Sunrise", earned: true, earnedDate: "2025-09-15", category: "Special" },
  { id: "b7", name: "Team Player", description: "Complete 5 group activities", icon: "UsersRound", earned: true, earnedDate: "2026-01-20", category: "Social" },
  { id: "b8", name: "Marathon Runner", description: "Log 100 volunteer hours", icon: "Timer", earned: false, category: "Milestone" },
  { id: "b9", name: "Green Thumb", description: "Complete 5 garden/nature tasks", icon: "Sprout", earned: false, category: "Environment" },
  { id: "b10", name: "Impact Leader", description: "Reach Level 5", icon: "Crown", earned: false, category: "Milestone" },
]

/* ── Weekly XP Chart Data ─── */

export const weeklyXpData = [
  { day: "Mon", xp: 45, hours: 1.5 },
  { day: "Tue", xp: 0, hours: 0 },
  { day: "Wed", xp: 120, hours: 3 },
  { day: "Thu", xp: 80, hours: 2 },
  { day: "Fri", xp: 0, hours: 0 },
  { day: "Sat", xp: 200, hours: 4.5 },
  { day: "Sun", xp: 150, hours: 3 },
]

/* ── Monthly Impact Data ─── */

export const monthlyImpactData = [
  { month: "Oct", hours: 8, tasks: 3, xp: 400 },
  { month: "Nov", hours: 12, tasks: 5, xp: 650 },
  { month: "Dec", hours: 6, tasks: 2, xp: 300 },
  { month: "Jan", hours: 15, tasks: 6, xp: 800 },
  { month: "Feb", hours: 18, tasks: 7, xp: 950 },
  { month: "Mar", hours: 10, tasks: 4, xp: 600 },
]

/* ── Skill Breakdown Data ─── */

export const skillBreakdownData = [
  { name: "Environment", value: 35, color: "#7EC8A0" },
  { name: "Education", value: 25, color: "#8BB8E0" },
  { name: "Community", value: 20, color: "#C9A882" },
  { name: "Arts", value: 12, color: "#E8B86D" },
  { name: "Tech", value: 8, color: "#3D2C23" },
]

/* ── Streak Data ─── */

export const streakData = {
  current: 5,
  best: 12,
  thisWeek: [true, false, true, true, true, true, false], // Mon-Sun
}

/* ── Application Tracking ─── */

export interface Application {
  id: string
  opportunityId: string
  opportunityTitle: string
  organization: string
  status: "pending" | "accepted" | "waitlisted" | "completed" | "upcoming"
  appliedDate: string
  eventDate: string
  xpReward: number
  category: string
  note?: string
}

export const mockApplications: Application[] = [
  {
    id: "app1",
    opportunityId: "op1",
    opportunityTitle: "Beach Cleanup at English Bay",
    organization: "Ocean Guardians BC",
    status: "accepted",
    appliedDate: "2026-02-28",
    eventDate: "2026-03-15",
    xpReward: 150,
    category: "Environment",
    note: "Confirmed! Meet at lifeguard station at 9am.",
  },
  {
    id: "app2",
    opportunityId: "op2",
    opportunityTitle: "Youth Coding Workshop Mentor",
    organization: "TechBridge Vancouver",
    status: "upcoming",
    appliedDate: "2026-02-20",
    eventDate: "2026-03-20",
    xpReward: 200,
    category: "Education",
    note: "Week 5 of 8. Teaching Python basics.",
  },
  {
    id: "app3",
    opportunityId: "op5",
    opportunityTitle: "Mural Painting Project",
    organization: "Arts for All Vancouver",
    status: "pending",
    appliedDate: "2026-03-01",
    eventDate: "2026-04-01",
    xpReward: 250,
    category: "Arts & Culture",
  },
  {
    id: "app4",
    opportunityId: "op8",
    opportunityTitle: "Newcomer Welcome Event",
    organization: "Welcome BC",
    status: "waitlisted",
    appliedDate: "2026-02-25",
    eventDate: "2026-03-25",
    xpReward: 200,
    category: "Community",
    note: "You are #2 on the waitlist.",
  },
  {
    id: "app5",
    opportunityId: "op4",
    opportunityTitle: "Senior Center Social Afternoon",
    organization: "Sunshine Seniors Society",
    status: "completed",
    appliedDate: "2026-02-10",
    eventDate: "2026-02-18",
    xpReward: 125,
    category: "Community",
    note: "Great job! You earned a review from the organizer.",
  },
]

/* ── Categories ─── */

export const categories = [
  "All",
  "Environment",
  "Education",
  "Community",
  "Arts & Culture",
  "Health",
  "Technology",
  "Sports",
]

/* ── Causes ─── */

export const causes = [
  "Climate Action",
  "Education Access",
  "Community Building",
  "Mental Health",
  "Food Security",
  "Arts & Creativity",
  "Animal Welfare",
  "Indigenous Reconciliation",
  "Newcomer Support",
  "Homelessness",
]

/* ── Community Partners ─── */

export interface Partner {
  id: string
  name: string
  type: "environmental" | "civic" | "food" | "arts" | "education"
  description: string
  logo: string
}

export const communityPartners: Partner[] = [
  { id: "p1", name: "Ocean Guardians BC", type: "environmental", description: "Coastal cleanup and marine conservation across Metro Vancouver.", logo: "OG" },
  { id: "p2", name: "Green Roots Collective", type: "food", description: "Community gardens and sustainable food education for youth.", logo: "GR" },
  { id: "p3", name: "TechBridge Vancouver", type: "education", description: "Free coding workshops and digital literacy for underserved youth.", logo: "TB" },
  { id: "p4", name: "Arts for All Vancouver", type: "arts", description: "Public art projects and creative workshops in every neighbourhood.", logo: "AA" },
  { id: "p5", name: "Greater Vancouver Food Bank", type: "food", description: "Distributing nutritious food to 30,000+ people monthly.", logo: "FBank" },
  { id: "p6", name: "BC Parks Foundation", type: "environmental", description: "Trail restoration and wilderness stewardship across BC.", logo: "BCP" },
  { id: "p7", name: "Welcome BC", type: "civic", description: "Settlement support and community integration for newcomers.", logo: "WBC" },
  { id: "p8", name: "Sunshine Seniors Society", type: "civic", description: "Intergenerational programs connecting youth with seniors.", logo: "SSS" },
  { id: "p9", name: "Vancouver Climate Hub", type: "environmental", description: "Climate education, advocacy and community action in the city.", logo: "VCH" },
  { id: "p10", name: "Youth Food Movement", type: "food", description: "Youth-led food sovereignty and urban farming initiatives.", logo: "YFM" },
]

/* ── Mock Organization Account ─── */

export interface OrgUser {
  id: string
  name: string
  logo: string
  type: string
  description: string
  website: string
  email: string
  phone: string
  location: string
  totalVolunteers: number
  totalEvents: number
  completedEvents: number
  activeEvents: number
  totalHired: number
  socialLinks: { twitter: string; instagram: string; website: string }
}

export const mockOrg: OrgUser = {
  id: "org1",
  name: "New Brighton Park Restoration",
  logo: "NB",
  type: "Environmental Nonprofit",
  description: "We restore and protect New Brighton Park's shoreline, wetlands, and trails through community-led planting days, invasive species removal, and habitat monitoring. Our volunteer network spans across Metro Vancouver with monthly events at 8 different restoration sites.",
  website: "https://newbrightonrestore.org",
  email: "hello@newbrightonrestore.org",
  phone: "(604) 555-0198",
  location: "Vancouver, BC",
  totalVolunteers: 248,
  totalEvents: 32,
  completedEvents: 24,
  activeEvents: 5,
  totalHired: 186,
  socialLinks: { twitter: "@nbprestoration", instagram: "@newbrightonrestore", website: "newbrightonrestore.org" },
}

/* ── Org Applications (what orgs see) ─── */

export interface OrgApplication {
  id: string
  applicantName: string
  applicantAvatar: string
  applicantLevel: number
  applicantXp: number
  applicantHours: number
  applicantSkills: string[]
  applicantTags: string[]
  applicantContact: {
    email: string
    phone: string
    instagram?: string
    linkedin?: string
  }
  opportunityId: string
  opportunityTitle: string
  status: "new" | "reviewed" | "accepted" | "rejected"
  appliedDate: string
  resumeUrl: string
}

export const mockOrgApplications: OrgApplication[] = [
  {
    id: "oa1", applicantName: "Cathy Luo", applicantAvatar: "/images/cathy-luo.jpg", applicantLevel: 3, applicantXp: 1250, applicantHours: 42,
    applicantSkills: ["Event Planning", "Photography"], applicantTags: ["Reliable", "Team Player"],
    applicantContact: { email: "cathy.luo@email.com", phone: "(604) 555-0147", instagram: "@cathyluo", linkedin: "linkedin.com/in/cathyluo" },
    opportunityId: "op1", opportunityTitle: "Beach Cleanup at English Bay", status: "new", appliedDate: "2026-02-28", resumeUrl: "#",
  },
  {
    id: "oa2", applicantName: "Alex Rivera", applicantAvatar: "", applicantLevel: 5, applicantXp: 3400, applicantHours: 95,
    applicantSkills: ["Leadership", "Social Media", "First Aid"], applicantTags: ["Experienced", "Multilingual"],
    applicantContact: { email: "alex.rivera@email.com", phone: "(604) 555-0231", instagram: "@alexrivera_van" },
    opportunityId: "op1", opportunityTitle: "Beach Cleanup at English Bay", status: "accepted", appliedDate: "2026-02-25", resumeUrl: "#",
  },
  {
    id: "oa3", applicantName: "Priya Sharma", applicantAvatar: "", applicantLevel: 4, applicantXp: 2900, applicantHours: 78,
    applicantSkills: ["Public Speaking", "Teaching"], applicantTags: ["Dedicated", "Creative"],
    applicantContact: { email: "priya.sharma@email.com", phone: "(604) 555-0312", linkedin: "linkedin.com/in/priyasharma" },
    opportunityId: "op1", opportunityTitle: "Beach Cleanup at English Bay", status: "reviewed", appliedDate: "2026-03-01", resumeUrl: "#",
  },
  {
    id: "oa4", applicantName: "Liam Nguyen", applicantAvatar: "", applicantLevel: 4, applicantXp: 2100, applicantHours: 61,
    applicantSkills: ["Photography", "Design"], applicantTags: ["Creative", "Outdoorsy"],
    applicantContact: { email: "liam.nguyen@email.com", phone: "(604) 555-0445", instagram: "@liamnguyen.photo" },
    opportunityId: "op3", opportunityTitle: "Community Garden Planting Day", status: "new", appliedDate: "2026-03-02", resumeUrl: "#",
  },
  {
    id: "oa5", applicantName: "Sophia Park", applicantAvatar: "", applicantLevel: 3, applicantXp: 1100, applicantHours: 35,
    applicantSkills: ["Event Planning", "Cooking"], applicantTags: ["Friendly", "Beginner"],
    applicantContact: { email: "sophia.park@email.com", phone: "(604) 555-0578", instagram: "@sophiapark_yvr", linkedin: "linkedin.com/in/sophiapark" },
    opportunityId: "op3", opportunityTitle: "Community Garden Planting Day", status: "accepted", appliedDate: "2026-02-27", resumeUrl: "#",
  },
]
