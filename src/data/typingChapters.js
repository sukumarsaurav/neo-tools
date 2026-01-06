// Typing Practice - 30 Chapter Progressive Curriculum
// Finger color mapping for virtual keyboard
export const FINGER_COLORS = {
    leftPinky: '#8B5CF6',   // violet
    leftRing: '#3B82F6',    // blue
    leftMiddle: '#10B981',  // green
    leftIndex: '#F59E0B',   // amber
    rightIndex: '#F97316',  // orange
    rightMiddle: '#14B8A6', // teal
    rightRing: '#6366F1',   // indigo
    rightPinky: '#EC4899',  // pink
};

// Key to finger mapping
export const KEY_FINGER_MAP = {
    // Left pinky
    'q': 'leftPinky', 'a': 'leftPinky', 'z': 'leftPinky', '1': 'leftPinky', '`': 'leftPinky',
    // Left ring
    'w': 'leftRing', 's': 'leftRing', 'x': 'leftRing', '2': 'leftRing',
    // Left middle
    'e': 'leftMiddle', 'd': 'leftMiddle', 'c': 'leftMiddle', '3': 'leftMiddle',
    // Left index (includes reach keys)
    'r': 'leftIndex', 'f': 'leftIndex', 'v': 'leftIndex', 't': 'leftIndex', 'g': 'leftIndex', 'b': 'leftIndex', '4': 'leftIndex', '5': 'leftIndex',
    // Right index (includes reach keys)
    'u': 'rightIndex', 'j': 'rightIndex', 'm': 'rightIndex', 'y': 'rightIndex', 'h': 'rightIndex', 'n': 'rightIndex', '6': 'rightIndex', '7': 'rightIndex',
    // Right middle
    'i': 'rightMiddle', 'k': 'rightMiddle', ',': 'rightMiddle', '8': 'rightMiddle',
    // Right ring
    'o': 'rightRing', 'l': 'rightRing', '.': 'rightRing', '9': 'rightRing',
    // Right pinky
    'p': 'rightPinky', ';': 'rightPinky', '/': 'rightPinky', '0': 'rightPinky', '-': 'rightPinky', '=': 'rightPinky', '[': 'rightPinky', ']': 'rightPinky', "'": 'rightPinky',
    // Space - thumbs
    ' ': 'thumb',
};

export const typingChapters = [
    // ============ PHASE 1: HOME ROW FOUNDATION (Chapters 1-6) ============
    {
        id: 1,
        title: "Index Finger Anchors",
        description: "Master F and J - your home position anchor keys with the bumps",
        phase: "Home Row Foundation",
        phaseNumber: 1,
        targetWPM: 15,
        minimumAccuracy: 75,
        focusKeys: ['f', 'j'],
        words: ['ff', 'jj', 'fj', 'jf', 'fjf', 'jfj', 'ffjj', 'jjff', 'fjfj', 'jfjf', 'fff', 'jjj', 'ffjjff', 'jjffjj'],
        sentences: [
            'fj fj fj fj fj fj fj fj',
            'jf jf jf jf jf jf jf jf',
            'fjfj fjfj fjfj fjfj fjfj',
            'jfjf jfjf jfjf jfjf jfjf',
            'ff jj ff jj ff jj ff jj',
        ],
        unlockRequirement: null,
        starThresholds: { 1: { wpm: 8, accuracy: 70 }, 2: { wpm: 12, accuracy: 80 }, 3: { wpm: 18, accuracy: 90 } }
    },
    {
        id: 2,
        title: "Middle Finger Power",
        description: "Add D and K to your typing arsenal",
        phase: "Home Row Foundation",
        phaseNumber: 1,
        targetWPM: 18,
        minimumAccuracy: 75,
        focusKeys: ['f', 'j', 'd', 'k'],
        words: ['dd', 'kk', 'dk', 'kd', 'fdk', 'jkd', 'dkf', 'kdf', 'fdkj', 'jkdf', 'dffk', 'kjjd'],
        sentences: [
            'fd fd fd jk jk jk fd jk',
            'dk dk dk dk dk dk dk dk',
            'fdk jkd fdk jkd fdk jkd',
            'dkfj dkfj dkfj dkfj dkfj',
            'fddk jkkd fddk jkkd fddk',
        ],
        unlockRequirement: { chapterId: 1, minStars: 1 },
        starThresholds: { 1: { wpm: 10, accuracy: 70 }, 2: { wpm: 15, accuracy: 80 }, 3: { wpm: 20, accuracy: 90 } }
    },
    {
        id: 3,
        title: "Ring Finger Reach",
        description: "Learn S and L with your ring fingers",
        phase: "Home Row Foundation",
        phaseNumber: 1,
        targetWPM: 18,
        minimumAccuracy: 75,
        focusKeys: ['f', 'j', 'd', 'k', 's', 'l'],
        words: ['ss', 'll', 'sl', 'ls', 'sad', 'lad', 'flask', 'salad', 'leads', 'falls'],
        sentences: [
            'ss ll ss ll ss ll ss ll',
            'asd jkl asd jkl asd jkl',
            'sad lad sad lad sad lad',
            'flask flask flask flask',
            'salads falls salads falls',
        ],
        unlockRequirement: { chapterId: 2, minStars: 1 },
        starThresholds: { 1: { wpm: 10, accuracy: 70 }, 2: { wpm: 15, accuracy: 80 }, 3: { wpm: 20, accuracy: 90 } }
    },
    {
        id: 4,
        title: "Pinky Precision",
        description: "Master A and semicolon with your pinky fingers",
        phase: "Home Row Foundation",
        phaseNumber: 1,
        targetWPM: 20,
        minimumAccuracy: 75,
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        words: ['aa', 'as', 'ask', 'all', 'fall', 'asks', 'lass', 'salads', 'flask', 'alaska'],
        sentences: [
            'asdf jkl; asdf jkl; asdf',
            'a sad lad asks a lass',
            'all falls all falls all',
            'alaska salads alaska salads',
            'ask a lad; ask a lass;',
        ],
        unlockRequirement: { chapterId: 3, minStars: 1 },
        starThresholds: { 1: { wpm: 12, accuracy: 70 }, 2: { wpm: 17, accuracy: 80 }, 3: { wpm: 22, accuracy: 90 } }
    },
    {
        id: 5,
        title: "Index Finger Reach",
        description: "Reach inward for G and H keys",
        phase: "Home Row Foundation",
        phaseNumber: 1,
        targetWPM: 22,
        minimumAccuracy: 78,
        focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        words: ['hag', 'gash', 'hash', 'flash', 'gall', 'hall', 'shall', 'hadj', 'glass', 'shag'],
        sentences: [
            'fghj fghj fghj fghj fghj',
            'a flash hall a glass hall',
            'shall a lass flash a lad',
            'hash gash flash lash dash',
            'the glass shall fall fast',
        ],
        unlockRequirement: { chapterId: 4, minStars: 1 },
        starThresholds: { 1: { wpm: 14, accuracy: 72 }, 2: { wpm: 19, accuracy: 82 }, 3: { wpm: 24, accuracy: 92 } }
    },
    {
        id: 6,
        title: "Home Row Mastery",
        description: "Complete home row practice with all keys",
        phase: "Home Row Foundation",
        phaseNumber: 1,
        targetWPM: 25,
        minimumAccuracy: 80,
        focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        words: ['alas', 'flash', 'glass', 'shall', 'alaska', 'salads', 'hassle', 'gadfly', 'halfs'],
        sentences: [
            'a lass shall flash a glass',
            'half a flask falls; a sad gaff',
            'dad had a salad; lads shall dash',
            'gals flash glad flags; lads jag',
            'alaska has flash halls; dads gash',
        ],
        unlockRequirement: { chapterId: 5, minStars: 1 },
        starThresholds: { 1: { wpm: 16, accuracy: 75 }, 2: { wpm: 22, accuracy: 85 }, 3: { wpm: 28, accuracy: 92 } }
    },

    // ============ PHASE 2: UPPER ROW INTRODUCTION (Chapters 7-12) ============
    {
        id: 7,
        title: "Index Fingers Up",
        description: "Reach up for R and U keys",
        phase: "Upper Row Introduction",
        phaseNumber: 2,
        targetWPM: 25,
        minimumAccuracy: 78,
        focusKeys: ['r', 'u', 'f', 'j', 'd', 'k'],
        words: ['fur', 'ruff', 'gruff', 'surf', 'rural', 'under', 'hurry', 'jury', 'rug', 'drug'],
        sentences: [
            'rf rf uj uj rf uj rf uj',
            'a fur rug; a ruff drug',
            'urdu fuji rural jury fur',
            'hurry a jury; surf a rug',
            'gruff rural drugs ruffled',
        ],
        unlockRequirement: { chapterId: 6, minStars: 1 },
        starThresholds: { 1: { wpm: 16, accuracy: 73 }, 2: { wpm: 21, accuracy: 83 }, 3: { wpm: 26, accuracy: 92 } }
    },
    {
        id: 8,
        title: "Middle Fingers Up",
        description: "Add E and I to expand your reach",
        phase: "Upper Row Introduction",
        phaseNumber: 2,
        targetWPM: 28,
        minimumAccuracy: 78,
        focusKeys: ['e', 'i', 'r', 'u', 'd', 'k', 'f', 'j'],
        words: ['idea', 'fire', 'like', 'life', 'reside', 'desire', 'serial', 'fields', 'filled', 'drilled'],
        sentences: [
            'de de ki ki de ki de ki',
            'desire fields; fire ideas',
            'life is like a serial ride',
            'filled fields fired desires',
            'the idea resided inside her',
        ],
        unlockRequirement: { chapterId: 7, minStars: 1 },
        starThresholds: { 1: { wpm: 18, accuracy: 73 }, 2: { wpm: 23, accuracy: 83 }, 3: { wpm: 28, accuracy: 92 } }
    },
    {
        id: 9,
        title: "Ring Fingers Up",
        description: "Learn W and O for wider reach",
        phase: "Upper Row Introduction",
        phaseNumber: 2,
        targetWPM: 28,
        minimumAccuracy: 78,
        focusKeys: ['w', 'o', 'e', 'i', 'r', 'u', 's', 'l'],
        words: ['wow', 'owl', 'work', 'world', 'words', 'slower', 'flower', 'follow', 'willow', 'window'],
        sentences: [
            'sw sw lo lo sw lo sw lo',
            'words flow like a slow owl',
            'the world follows flowers',
            'willow windows work well',
            'slower owls follow worlds',
        ],
        unlockRequirement: { chapterId: 8, minStars: 1 },
        starThresholds: { 1: { wpm: 18, accuracy: 73 }, 2: { wpm: 24, accuracy: 83 }, 3: { wpm: 30, accuracy: 92 } }
    },
    {
        id: 10,
        title: "Pinky Fingers Up",
        description: "Master Q and P with your pinkies",
        phase: "Upper Row Introduction",
        phaseNumber: 2,
        targetWPM: 30,
        minimumAccuracy: 78,
        focusKeys: ['q', 'p', 'w', 'o', 'a', ';'],
        words: ['quip', 'pique', 'opaque', 'plaque', 'quake', 'equip', 'equal', 'squid', 'squash', 'pueblo'],
        sentences: [
            'aq aq p; p; aq p; aq p;',
            'a quip of equal pique',
            'opaque plaques and squids',
            'equip a pueblo with squash',
            'qoph quips piqued people',
        ],
        unlockRequirement: { chapterId: 9, minStars: 1 },
        starThresholds: { 1: { wpm: 19, accuracy: 73 }, 2: { wpm: 25, accuracy: 83 }, 3: { wpm: 32, accuracy: 92 } }
    },
    {
        id: 11,
        title: "Center Reach Up",
        description: "Add T and Y for complete upper reach",
        phase: "Upper Row Introduction",
        phaseNumber: 2,
        targetWPM: 30,
        minimumAccuracy: 80,
        focusKeys: ['t', 'y', 'r', 'u', 'g', 'h', 'f', 'j'],
        words: ['try', 'type', 'tyrant', 'rhythm', 'thirty', 'thirsty', 'worthy', 'youth', 'truth', 'youthful'],
        sentences: [
            'tf tf yj yj tf yj tf yj',
            'try to type with rhythm',
            'thirty youths tried truth',
            'youthful tyrants try typing',
            'the thirsty youth yearned',
        ],
        unlockRequirement: { chapterId: 10, minStars: 1 },
        starThresholds: { 1: { wpm: 20, accuracy: 75 }, 2: { wpm: 26, accuracy: 85 }, 3: { wpm: 32, accuracy: 92 } }
    },
    {
        id: 12,
        title: "Upper Row Mastery",
        description: "Complete upper row with home row integration",
        phase: "Upper Row Introduction",
        phaseNumber: 2,
        targetWPM: 32,
        minimumAccuracy: 82,
        focusKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        words: ['typewriter', 'quality', 'question', 'territory', 'opportunity', 'powerful', 'leadership', 'friendship'],
        sentences: [
            'qwerty is the popular layout',
            'the quality of a territory',
            'powerful leadership requires skill',
            'typewriters were quite popular',
            'question the opportunity always',
        ],
        unlockRequirement: { chapterId: 11, minStars: 1 },
        starThresholds: { 1: { wpm: 22, accuracy: 77 }, 2: { wpm: 28, accuracy: 85 }, 3: { wpm: 35, accuracy: 93 } }
    },

    // ============ PHASE 3: BOTTOM ROW MASTERY (Chapters 13-18) ============
    {
        id: 13,
        title: "Index Fingers Down",
        description: "Reach down for V and M keys",
        phase: "Bottom Row Mastery",
        phaseNumber: 3,
        targetWPM: 32,
        minimumAccuracy: 80,
        focusKeys: ['v', 'm', 'f', 'j', 'r', 'u'],
        words: ['vim', 'move', 'movie', 'vivid', 'mauve', 'remove', 'volume', 'maximum', 'motivate', 'improve'],
        sentences: [
            'fv fv jm jm fv jm fv jm',
            'vivid movies motivate us',
            'improve the maximum volume',
            'remove mauve from the view',
            'vim is a very vivid editor',
        ],
        unlockRequirement: { chapterId: 12, minStars: 1 },
        starThresholds: { 1: { wpm: 22, accuracy: 75 }, 2: { wpm: 28, accuracy: 84 }, 3: { wpm: 35, accuracy: 93 } }
    },
    {
        id: 14,
        title: "Middle Fingers Down",
        description: "Add C and comma for complete reach",
        phase: "Bottom Row Mastery",
        phaseNumber: 3,
        targetWPM: 33,
        minimumAccuracy: 80,
        focusKeys: ['c', ',', 'v', 'm', 'd', 'k'],
        words: ['code', 'come', 'calm', 'comic', 'claim', 'comma', 'custom', 'welcome', 'compact', 'macros'],
        sentences: [
            'dc dc k, k, dc k, dc k,',
            'code comes with commas,',
            'calm, collected, compact',
            'comics claim custom macros,',
            'welcome, come, and code,',
        ],
        unlockRequirement: { chapterId: 13, minStars: 1 },
        starThresholds: { 1: { wpm: 23, accuracy: 75 }, 2: { wpm: 29, accuracy: 84 }, 3: { wpm: 36, accuracy: 93 } }
    },
    {
        id: 15,
        title: "Ring Fingers Down",
        description: "Master X and period keys",
        phase: "Bottom Row Mastery",
        phaseNumber: 3,
        targetWPM: 33,
        minimumAccuracy: 80,
        focusKeys: ['x', '.', 'c', ',', 's', 'l'],
        words: ['fix', 'flex', 'next', 'exist', 'excel', 'export', 'relax', 'complex', 'explore', 'express'],
        sentences: [
            'sx sx l. l. sx l. sx l.',
            'fix the complex. explore next.',
            'relax. excel. express. exist.',
            'next, export the flex files.',
            'the explorer fixed the text.',
        ],
        unlockRequirement: { chapterId: 14, minStars: 1 },
        starThresholds: { 1: { wpm: 23, accuracy: 75 }, 2: { wpm: 29, accuracy: 84 }, 3: { wpm: 36, accuracy: 93 } }
    },
    {
        id: 16,
        title: "Pinky Fingers Down",
        description: "Learn Z and slash keys",
        phase: "Bottom Row Mastery",
        phaseNumber: 3,
        targetWPM: 34,
        minimumAccuracy: 80,
        focusKeys: ['z', '/', 'x', '.', 'a', ';'],
        words: ['zoo', 'zone', 'zero', 'freeze', 'amaze', 'puzzle', 'drizzle', 'organize', 'visualize'],
        sentences: [
            'az az ;/ ;/ az ;/ az ;/',
            'visualize the puzzle zone.',
            'zero/zones freeze amazingly.',
            'organize/categorize/optimize.',
            'the drizzle dazzled the zoo.',
        ],
        unlockRequirement: { chapterId: 15, minStars: 1 },
        starThresholds: { 1: { wpm: 24, accuracy: 75 }, 2: { wpm: 30, accuracy: 84 }, 3: { wpm: 37, accuracy: 93 } }
    },
    {
        id: 17,
        title: "Center Reach Down",
        description: "Add B and N for complete bottom row",
        phase: "Bottom Row Mastery",
        phaseNumber: 3,
        targetWPM: 35,
        minimumAccuracy: 82,
        focusKeys: ['b', 'n', 'v', 'm', 'g', 'h'],
        words: ['bin', 'bon', 'burn', 'barn', 'brain', 'brand', 'number', 'nimble', 'banana', 'combine'],
        sentences: [
            'fb fb jn jn fb jn fb jn',
            'burn the number on the bin.',
            'nimble brains brand bananas.',
            'combine the barn and bundle.',
            'the notable brand burned.',
        ],
        unlockRequirement: { chapterId: 16, minStars: 1 },
        starThresholds: { 1: { wpm: 25, accuracy: 77 }, 2: { wpm: 31, accuracy: 85 }, 3: { wpm: 38, accuracy: 93 } }
    },
    {
        id: 18,
        title: "Full Keyboard Basics",
        description: "All letters and basic punctuation combined",
        phase: "Bottom Row Mastery",
        phaseNumber: 3,
        targetWPM: 38,
        minimumAccuracy: 85,
        focusKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', ',', ';', '/'],
        words: ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dogs', 'sphinx', 'quartz'],
        sentences: [
            'the quick brown fox jumps over the lazy dog.',
            'pack my box with five dozen liquor jugs.',
            'sphinx of black quartz, judge my vow.',
            'how vexingly quick daft zebras jump.',
            'the five boxing wizards jump quickly.',
        ],
        unlockRequirement: { chapterId: 17, minStars: 1 },
        starThresholds: { 1: { wpm: 28, accuracy: 80 }, 2: { wpm: 35, accuracy: 87 }, 3: { wpm: 42, accuracy: 94 } }
    },

    // ============ PHASE 4: NUMBERS & SYMBOLS (Chapters 19-24) ============
    {
        id: 19,
        title: "Left Hand Numbers",
        description: "Learn number keys 1-5",
        phase: "Numbers & Symbols",
        phaseNumber: 4,
        targetWPM: 30,
        minimumAccuracy: 80,
        focusKeys: ['1', '2', '3', '4', '5'],
        words: ['11', '22', '33', '44', '55', '123', '234', '345', '1234', '12345', '54321', '2345'],
        sentences: [
            '1 2 3 4 5 1 2 3 4 5',
            '12 23 34 45 12 23 34 45',
            '123 234 345 451 512 123',
            'room 123 has 45 students.',
            'add 12 and 34 to get 46.',
        ],
        unlockRequirement: { chapterId: 18, minStars: 1 },
        starThresholds: { 1: { wpm: 20, accuracy: 75 }, 2: { wpm: 26, accuracy: 83 }, 3: { wpm: 32, accuracy: 92 } }
    },
    {
        id: 20,
        title: "Right Hand Numbers",
        description: "Master number keys 6-0",
        phase: "Numbers & Symbols",
        phaseNumber: 4,
        targetWPM: 30,
        minimumAccuracy: 80,
        focusKeys: ['6', '7', '8', '9', '0'],
        words: ['66', '77', '88', '99', '00', '678', '789', '890', '67890', '09876', '6789', '7890'],
        sentences: [
            '6 7 8 9 0 6 7 8 9 0',
            '67 78 89 90 67 78 89 90',
            '678 789 890 901 678 789',
            'call 789 for 60 orders.',
            'the score was 80 to 67.',
        ],
        unlockRequirement: { chapterId: 19, minStars: 1 },
        starThresholds: { 1: { wpm: 20, accuracy: 75 }, 2: { wpm: 26, accuracy: 83 }, 3: { wpm: 32, accuracy: 92 } }
    },
    {
        id: 21,
        title: "Capital Letters",
        description: "Practice Shift key with letters",
        phase: "Numbers & Symbols",
        phaseNumber: 4,
        targetWPM: 32,
        minimumAccuracy: 82,
        focusKeys: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        words: ['The', 'Quick', 'Brown', 'Fox', 'Jumps', 'Over', 'Lazy', 'Dog', 'John', 'Mary'],
        sentences: [
            'John and Mary went to Paris.',
            'The Quick Brown Fox Jumps High.',
            'New York is in the United States.',
            'Dr. Smith met Prof. Johnson today.',
            'Apple, Google, and Microsoft lead.',
        ],
        unlockRequirement: { chapterId: 20, minStars: 1 },
        starThresholds: { 1: { wpm: 22, accuracy: 77 }, 2: { wpm: 28, accuracy: 85 }, 3: { wpm: 35, accuracy: 93 } }
    },
    {
        id: 22,
        title: "Common Symbols",
        description: "Learn ! @ # $ % symbols",
        phase: "Numbers & Symbols",
        phaseNumber: 4,
        targetWPM: 28,
        minimumAccuracy: 78,
        focusKeys: ['!', '@', '#', '$', '%'],
        words: ['!', '@', '#', '$', '%', '!@#', '$%', '!$', '@#', '$100', '50%', 'email@example'],
        sentences: [
            '! @ # $ % ! @ # $ %',
            'Wow! Amazing! Incredible!',
            'email@work.com costs $100.',
            'The sale is 50% off!',
            '#trending @user $bargain!',
        ],
        unlockRequirement: { chapterId: 21, minStars: 1 },
        starThresholds: { 1: { wpm: 18, accuracy: 73 }, 2: { wpm: 24, accuracy: 82 }, 3: { wpm: 30, accuracy: 91 } }
    },
    {
        id: 23,
        title: "Programming Brackets",
        description: "Master [ ] { } ( ) symbols",
        phase: "Numbers & Symbols",
        phaseNumber: 4,
        targetWPM: 26,
        minimumAccuracy: 78,
        focusKeys: ['[', ']', '{', '}', '(', ')'],
        words: ['[]', '{}', '()', '[a]', '{b}', '(c)', '(a, b)', '[1, 2]', '{x: 1}', 'fn()'],
        sentences: [
            '[] {} () [] {} ()',
            'function add(a, b) { return a; }',
            'arr[0], arr[1], arr[2]',
            'obj = { key: value };',
            'if (x) { do(y); } else { do(z); }',
        ],
        unlockRequirement: { chapterId: 22, minStars: 1 },
        starThresholds: { 1: { wpm: 16, accuracy: 73 }, 2: { wpm: 22, accuracy: 82 }, 3: { wpm: 28, accuracy: 91 } }
    },
    {
        id: 24,
        title: "Full Symbol Mastery",
        description: "All symbols and special characters",
        phase: "Numbers & Symbols",
        phaseNumber: 4,
        targetWPM: 28,
        minimumAccuracy: 80,
        focusKeys: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', "'", '"', ',', '.', '<', '>', '/', '?'],
        words: ['$100', '50%', 'a+b', 'c-d', 'x*y', 'n/m', 'a=b', 'c+=d', 'arr[i]', 'obj.key'],
        sentences: [
            'cmd + shift + p = palette',
            'price: $99.99 (50% off!)',
            'user@email.com | #hashtag',
            'if (a && b || c) { return; }',
            'const x = { a: 1, b: "text" };',
        ],
        unlockRequirement: { chapterId: 23, minStars: 1 },
        starThresholds: { 1: { wpm: 18, accuracy: 75 }, 2: { wpm: 24, accuracy: 83 }, 3: { wpm: 30, accuracy: 92 } }
    },

    // ============ PHASE 5: SPEED & ENDURANCE (Chapters 25-30) ============
    {
        id: 25,
        title: "Common Word Sprint",
        description: "Practice the 100 most common English words",
        phase: "Speed & Endurance",
        phaseNumber: 5,
        targetWPM: 40,
        minimumAccuracy: 88,
        focusKeys: [],
        words: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'],
        sentences: [
            'The quick brown fox jumps over the lazy dog.',
            'How vexingly quick daft zebras jump.',
            'Pack my box with five dozen liquor jugs.',
            'We promptly judged antique ivory buckles.',
            'Crazy Frederick bought many very exquisite opal jewels.',
        ],
        unlockRequirement: { chapterId: 24, minStars: 1 },
        starThresholds: { 1: { wpm: 30, accuracy: 83 }, 2: { wpm: 38, accuracy: 88 }, 3: { wpm: 45, accuracy: 95 } }
    },
    {
        id: 26,
        title: "Sentence Flow",
        description: "Build rhythm with complete sentences",
        phase: "Speed & Endurance",
        phaseNumber: 5,
        targetWPM: 42,
        minimumAccuracy: 88,
        focusKeys: [],
        words: [],
        sentences: [
            'The morning sun cast golden rays across the quiet valley, awakening the birds from their slumber.',
            'She walked briskly through the crowded streets, her mind racing with thoughts of the upcoming meeting.',
            'Technology continues to reshape our daily lives in ways we never imagined possible just decades ago.',
            'The old library held countless stories within its weathered walls, each book a gateway to new worlds.',
            'Success is not final, failure is not fatal: it is the courage to continue that counts most.',
        ],
        unlockRequirement: { chapterId: 25, minStars: 1 },
        starThresholds: { 1: { wpm: 32, accuracy: 83 }, 2: { wpm: 40, accuracy: 88 }, 3: { wpm: 48, accuracy: 95 } }
    },
    {
        id: 27,
        title: "Paragraph Power",
        description: "Multi-sentence passages for endurance",
        phase: "Speed & Endurance",
        phaseNumber: 5,
        targetWPM: 45,
        minimumAccuracy: 90,
        focusKeys: [],
        words: [],
        sentences: [
            'The art of programming is the art of organizing complexity. It requires clear thinking and careful attention to detail. Good code should be readable, maintainable, and efficient.',
            'Learning to type quickly and accurately is one of the most valuable skills in the digital age. It allows you to express your thoughts faster and focus on what matters most: your ideas.',
            'Every great achievement was once considered impossible. Those who dare to dream and work persistently toward their goals are the ones who change the world for the better.',
        ],
        unlockRequirement: { chapterId: 26, minStars: 1 },
        starThresholds: { 1: { wpm: 35, accuracy: 85 }, 2: { wpm: 43, accuracy: 90 }, 3: { wpm: 52, accuracy: 96 } }
    },
    {
        id: 28,
        title: "Technical Text",
        description: "Programming and technology vocabulary",
        phase: "Speed & Endurance",
        phaseNumber: 5,
        targetWPM: 40,
        minimumAccuracy: 88,
        focusKeys: [],
        words: ['function', 'variable', 'constant', 'algorithm', 'database', 'interface', 'component', 'framework'],
        sentences: [
            'const handleClick = (event) => { event.preventDefault(); setState(prev => !prev); };',
            'function fetchData(url) { return fetch(url).then(response => response.json()); }',
            'The React component lifecycle includes mounting, updating, and unmounting phases.',
            'APIs enable communication between different software systems using HTTP protocols.',
            'Version control with Git allows teams to collaborate on code efficiently and safely.',
        ],
        unlockRequirement: { chapterId: 27, minStars: 1 },
        starThresholds: { 1: { wpm: 30, accuracy: 83 }, 2: { wpm: 38, accuracy: 88 }, 3: { wpm: 45, accuracy: 94 } }
    },
    {
        id: 29,
        title: "Story Time",
        description: "Creative writing passages for flow",
        phase: "Speed & Endurance",
        phaseNumber: 5,
        targetWPM: 48,
        minimumAccuracy: 90,
        focusKeys: [],
        words: [],
        sentences: [
            'Once upon a time, in a land far away, there lived a young programmer who dreamed of creating the perfect application. Every day, she would sit at her desk, fingers dancing across the keyboard, bringing her ideas to life one line of code at a time.',
            'The storm had been building for hours, dark clouds gathering on the horizon like an army preparing for battle. Thunder rumbled in the distance, and the first drops of rain began to fall, tapping gently against the windowpane before turning into a torrent.',
            'In the quiet corners of the ancient library, Sarah discovered a book that would change her life forever. Its pages, yellowed with age, contained secrets that had been hidden for centuries, waiting for someone brave enough to uncover them.',
        ],
        unlockRequirement: { chapterId: 28, minStars: 1 },
        starThresholds: { 1: { wpm: 38, accuracy: 85 }, 2: { wpm: 46, accuracy: 90 }, 3: { wpm: 55, accuracy: 96 } }
    },
    {
        id: 30,
        title: "Mastery Challenge",
        description: "The ultimate typing test - prove your skills",
        phase: "Speed & Endurance",
        phaseNumber: 5,
        targetWPM: 50,
        minimumAccuracy: 92,
        focusKeys: [],
        words: [],
        sentences: [
            'Congratulations on reaching the final challenge! You have journeyed from the humble beginnings of F and J keys to the pinnacle of typing mastery. This is your moment to shine.',
            'The skilled typist moves with fluid grace, each keystroke precise and purposeful. Their fingers dance across the keyboard in a symphony of clicks, transforming thoughts into words at remarkable speed.',
            'Remember that speed without accuracy is meaningless. The true master balances both, knowing when to push faster and when to slow down. Your fingers have learned the patterns; now let them flow.',
            'As you complete this final chapter, take pride in your accomplishment. You have developed a skill that will serve you throughout your digital life. The keyboard is now an extension of your mind.',
            'Type with confidence, type with precision, type with purpose. You are now a certified touch typist, capable of expressing your thoughts as fast as you can think them. Well done, master!',
        ],
        unlockRequirement: { chapterId: 29, minStars: 1 },
        starThresholds: { 1: { wpm: 40, accuracy: 87 }, 2: { wpm: 48, accuracy: 92 }, 3: { wpm: 58, accuracy: 97 } }
    },
];

// Helper functions
export const getChapterById = (id) => typingChapters.find(ch => ch.id === id);

export const getChaptersByPhase = (phaseNumber) => typingChapters.filter(ch => ch.phaseNumber === phaseNumber);

export const getPhases = () => [
    { number: 1, name: 'Home Row Foundation', chapters: [1, 2, 3, 4, 5, 6] },
    { number: 2, name: 'Upper Row Introduction', chapters: [7, 8, 9, 10, 11, 12] },
    { number: 3, name: 'Bottom Row Mastery', chapters: [13, 14, 15, 16, 17, 18] },
    { number: 4, name: 'Numbers & Symbols', chapters: [19, 20, 21, 22, 23, 24] },
    { number: 5, name: 'Speed & Endurance', chapters: [25, 26, 27, 28, 29, 30] },
];

export const isChapterUnlocked = (chapterId, progress) => {
    const chapter = getChapterById(chapterId);
    if (!chapter) return false;
    if (!chapter.unlockRequirement) return true;

    const requiredProgress = progress[chapter.unlockRequirement.chapterId];
    return requiredProgress && requiredProgress.stars >= chapter.unlockRequirement.minStars;
};

export const calculateStars = (wpm, accuracy, chapter) => {
    const thresholds = chapter.starThresholds;
    if (wpm >= thresholds[3].wpm && accuracy >= thresholds[3].accuracy) return 3;
    if (wpm >= thresholds[2].wpm && accuracy >= thresholds[2].accuracy) return 2;
    if (wpm >= thresholds[1].wpm && accuracy >= thresholds[1].accuracy) return 1;
    return 0;
};

export const generatePracticeText = (chapter, wordCount = null) => {
    const targetWords = wordCount || (chapter.words.length > 0 ? chapter.words.length * 3 : 50);

    if (chapter.sentences.length > 0) {
        // For later chapters, join sentences
        let text = chapter.sentences.join(' ');
        return text;
    }

    // For early chapters, generate from words
    let result = [];
    while (result.length < targetWords) {
        const shuffled = [...chapter.words].sort(() => Math.random() - 0.5);
        result = result.concat(shuffled);
    }
    return result.slice(0, targetWords).join(' ');
};

export default typingChapters;
