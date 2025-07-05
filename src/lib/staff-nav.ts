import {
  Baby,
  BarChart3,
  DollarSign,
  HandHeart,
  HeartHandshake,
  LayoutDashboard,
  Newspaper,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  UsersRound,
} from 'lucide-react';

// Centralized navigation items for the staff portal, now grouped.
export const staffNavGroups = [
  {
    label: 'Overview',
    items: [
      {
        href: '/staff',
        label: 'Dashboard',
        labelSw: 'Dashibodi',
        description: 'Overview of all ministry activities.',
        icon: LayoutDashboard,
      },
      {
        href: '/staff/analytics',
        label: 'Analytics',
        labelSw: 'Takwimu',
        description: 'Review website traffic and engagement statistics.',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Community',
    items: [
       {
        href: '/staff/review-testimonies',
        label: 'Review Testimonies',
        labelSw: 'Pitia Shuhuda',
        description: 'Approve and publish user-submitted stories.',
        icon: ShieldCheck,
      },
      {
        href: '/staff/pastoral',
        label: 'Pastoral Care',
        labelSw: 'Huduma za Kichungaji',
        description: 'Follow up on decisions and prayer requests.',
        icon: HandHeart,
      },
      {
        href: '/staff/humanitarian',
        label: 'Hospitality',
        labelSw: 'Ukarimu',
        description: 'Manage new visitors, volunteers, and community needs.',
        icon: HeartHandshake,
      },
    ]
  },
  {
    label: 'Operations',
    items: [
      {
        href: '/staff/content',
        label: 'Content Management',
        labelSw: 'Usimamizi wa Maudhui',
        description: 'Manage sermons, blogs, events, and more.',
        icon: Newspaper,
      },
       {
        href: '/staff/human-resource',
        label: 'Human Resources',
        labelSw: 'Rasilimali Watu',
        description: 'Manage volunteer applications and staff records.',
        icon: Users,
      },
      {
        href: '/staff/youth',
        label: 'Youth Ministry',
        labelSw: 'Huduma ya Vijana',
        description: 'Manage youth events and parent communications.',
        icon: UsersRound,
      },
      {
        href: '/staff/children',
        label: "Children's Ministry",
        labelSw: 'Huduma ya Watoto',
        description: 'Manage check-ins, curriculum, and parent info.',
        icon: Baby,
      },
      {
        href: '/staff/transport-security',
        label: 'Transport & Security',
        labelSw: 'Uchukuzi na Usalama',
        description: 'View upcoming events for logistics coordination.',
        icon: Shield,
      },
      {
        href: '/staff/finance',
        label: 'Finance',
        labelSw: 'Fedha',
        description: 'View giving reports and manage financial partner data.',
        icon: DollarSign,
      },
    ]
  },
  {
    label: "System",
    items: [
      {
        href: '/staff/settings',
        label: 'System Settings',
        labelSw: 'Mipangilio ya Mfumo',
        description: 'Manage site-wide settings and user roles.',
        icon: Settings,
      },
    ]
  }
];
