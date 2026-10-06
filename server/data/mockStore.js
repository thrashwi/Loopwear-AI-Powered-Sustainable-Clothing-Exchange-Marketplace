// In-Memory Data Store for Loopwear
// Supports immediate out-of-the-box demo with high fidelity data

export const users = [
  {
    id: 'user_1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    location: 'Indiranagar, Bengaluru',
    rating: 4.9,
    swapsCompleted: 12,
    sustainabilityScore: {
      co2KgSaved: 48,
      waterLitersSaved: 15400,
      garmentsDiverted: 14
    }
  },
  {
    id: 'user_2',
    name: 'Ananya Verma',
    email: 'ananya@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    location: 'Koramangala, Bengaluru',
    rating: 5.0,
    swapsCompleted: 19,
    sustainabilityScore: {
      co2KgSaved: 76,
      waterLitersSaved: 24200,
      garmentsDiverted: 21
    }
  },
  {
    id: 'user_3',
    name: 'Priya Patel',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Bandra, Mumbai',
    rating: 4.8,
    swapsCompleted: 7,
    sustainabilityScore: {
      co2KgSaved: 28,
      waterLitersSaved: 9800,
      garmentsDiverted: 8
    }
  }
];

export const items = [
  {
    id: 'item_1',
    ownerId: 'user_1',
    ownerName: 'Rahul Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    title: 'Nike Sportswear Club Fleece Pullover Hoodie',
    brand: 'Nike',
    category: 'Tops',
    size: 'L',
    condition: 'Gently Used',
    color: 'Heather Grey',
    estimatedValue: 1600,
    description: 'Iconic brushed-back fleece pullover hoodie from Nike. In warm heather grey with minimal wear around the cuffs. Features pouch pocket and adjustable drawstring hood. Perfect for casual layered streetwear.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Streetwear', 'Nike', 'Fleece', 'Athleisure', 'Autumn'],
    status: 'available',
    createdAt: new Date('2026-09-28').toISOString()
  },
  {
    id: 'item_2',
    ownerId: 'user_2',
    ownerName: 'Ananya Verma',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    title: 'Zara Vintage Wash Denim Trucker Jacket',
    brand: 'Zara',
    category: 'Jackets & Outerwear',
    size: 'M',
    condition: 'Like New',
    color: 'Classic Vintage Blue',
    estimatedValue: 1750,
    description: 'Classic Zara denim jacket in premium medium-wash cotton. Features silver metallic buttons, dual chest flap pockets, and relaxed regular fit. Worn twice for a shoot, zero distress or fading flaws.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Denim', 'Zara', 'Jackets', 'Outerwear', 'VintageLook'],
    status: 'available',
    createdAt: new Date('2026-10-01').toISOString()
  },
  {
    id: 'item_3',
    ownerId: 'user_2',
    ownerName: 'Ananya Verma',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    title: "Levi's 501 Original Fit Straight Leg Jeans",
    brand: "Levi's",
    category: 'Bottoms',
    size: 'M',
    condition: 'Like New',
    color: 'Dark Indigo',
    estimatedValue: 2200,
    description: "The timeless Levi's 501 signature straight leg denim with iconic button fly. Rigid 100% cotton in dark stonewash. Hem and waist are in pristine state. A closet staple that lasts decades.",
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ["Levi's", '501', 'Denim', 'Classic', 'Sustainable'],
    status: 'available',
    createdAt: new Date('2026-10-02').toISOString()
  },
  {
    id: 'item_4',
    ownerId: 'user_3',
    ownerName: 'Priya Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'H&M Floral Chiffon Tiered Midi Dress',
    brand: 'H&M',
    category: 'Dresses',
    size: 'S',
    condition: 'Brand New with Tags',
    color: 'Pastel Floral',
    estimatedValue: 1400,
    description: 'Breezy tiered midi dress crafted in airy printed chiffon with V-neckline and gathered waist. Never worn, original store tags still attached. Ideal for brunches or summer outings.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Floral', 'Summer', 'H&M', 'MidiDress', 'BNWT'],
    status: 'available',
    createdAt: new Date('2026-10-03').toISOString()
  },
  {
    id: 'item_5',
    ownerId: 'user_1',
    ownerName: 'Rahul Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    title: 'Adidas Originals Gazelle Suede Sneakers',
    brand: 'Adidas',
    category: 'Shoes',
    size: 'L',
    condition: 'Gently Used',
    color: 'Black / White',
    estimatedValue: 2600,
    description: 'Iconic low-profile sneaker with soft suede upper and white serrated 3-Stripes. Clean rubber outsole with very light tread wear. Cleaned and sanitized, comes with original laces.',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Adidas', 'Sneakers', 'Gazelle', 'Footwear', 'Retro'],
    status: 'available',
    createdAt: new Date('2026-09-25').toISOString()
  },
  {
    id: 'item_6',
    ownerId: 'user_3',
    ownerName: 'Priya Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'Uniqlo Ultra Light Down Compact Jacket',
    brand: 'Uniqlo',
    category: 'Jackets & Outerwear',
    size: 'M',
    condition: 'Like New',
    color: 'Midnight Navy',
    estimatedValue: 2400,
    description: 'Feather-light down insulation with water-repellent coating. Folds down into its included compact carrying pouch. Extremely warm for its weight, ideal for travel or winter layering.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Uniqlo', 'DownJacket', 'WinterWear', 'Ultralight', 'Outerwear'],
    status: 'available',
    createdAt: new Date('2026-09-30').toISOString()
  }
];

export const swaps = [
  {
    id: 'swap_1',
    requesterId: 'user_1',
    recipientId: 'user_2',
    offeredItemId: 'item_1',
    requestedItemId: 'item_2',
    status: 'pending',
    aiFairnessAssessment: {
      verdict: 'Fair Swap',
      score: 94,
      differenceAmount: 150,
      analysisText: 'Both items are from popular high-street and sportswear brands with high desirability. Estimated values are ₹1,600 and ₹1,750—a negligible difference of ₹150. The swap is balanced and mutually advantageous.',
      recommendation: 'Direct 1-to-1 swap is highly recommended without additional adjustments.'
    },
    createdAt: new Date('2026-10-04T10:30:00Z').toISOString()
  }
];

export const conversations = [
  {
    id: 'conv_swap_1',
    swapId: 'swap_1',
    participants: ['user_1', 'user_2'],
    messages: [
      {
        id: 'msg_1',
        senderId: 'user_1',
        senderName: 'Rahul Sharma',
        text: 'Hey Ananya! Loved your Zara denim jacket. Would you be interested in swapping for my Nike Club Fleece Hoodie?',
        timestamp: new Date('2026-10-04T10:32:00Z').toISOString()
      },
      {
        id: 'msg_2',
        senderId: 'user_2',
        senderName: 'Ananya Verma',
        text: "Hi Rahul! That's a great hoodie. The AI Fair Swap assessment says our items are within ₹150 of each other. Sounds like a fair trade to me!",
        timestamp: new Date('2026-10-04T11:05:00Z').toISOString()
      }
    ]
  }
];
