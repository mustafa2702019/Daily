import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Types
interface Habit { id: string; name: string; category: string; target: number; }
interface HabitLog { [date: string]: { habitId: string; done: boolean }[]; }
interface Goal { id: string; title: string; category: string; dueDate?: string; progress: number; completed: boolean; }
interface Transaction { id: number; desc: string; amount: number; category: string; type: 'income' | 'expense'; date: string; }
interface Hobby { id: string; name: string; category: string; status: 'interested' | 'trying' | 'mastered'; }
interface Event { id: string; title: string; date: string; }
interface RoutineItem { id: string; title: string; description: string; completed: boolean; }
interface JournalEntry { date: string; text: string; }
interface Todo { id: string; text: string; completed: boolean; priority: 'high' | 'medium' | 'low'; date: string; }
interface DailyChallenge { id: string; text: string; completed: boolean; date: string; }

// Quotes array - 365 quotes for each day
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success.", author: "Unknown" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "If you want to achieve greatness stop asking for permission.", author: "Unknown" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Everything has beauty, but not everyone can see.", author: "Confucius" },
  { text: "How wonderful it is that nobody need wait a single moment before starting to improve the world.", author: "Anne Frank" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Do what you love and the money will follow.", author: "Marsha Sinetar" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Eighty percent of success is showing up.", author: "Woody Allen" },
  { text: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "Winners never quit and quitters never win.", author: "Vince Lombardi" },
  { text: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
  { text: "Every child is an artist. The problem is how to remain an artist once he grows up.", author: "Pablo Picasso" },
  { text: "You can never cross the ocean until you have the courage to lose sight of the shore.", author: "Christopher Columbus" },
  { text: "I've learned that people will forget what you said, but never how you made them feel.", author: "Maya Angelou" },
  { text: "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it.", author: "Johann Wolfgang von Goethe" },
  { text: "Life is 10% what happens to me and 90% how I react to it.", author: "Charles Swindoll" },
  { text: "Remember that not getting what you want is sometimes a wonderful stroke of luck.", author: "Dalai Lama" },
  { text: "The question isn't who is going to let me; it's who is going to stop me.", author: "Ayn Rand" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind.", author: "Henry Ford" },
  { text: "It's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "Either write something worth reading or do something worth writing.", author: "Benjamin Franklin" },
  { text: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "We become what we think about.", author: "Earl Nightingale" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
  { text: "Dream as if you'll live forever, live as if you'll die today.", author: "James Dean" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { text: "If you fell down yesterday, stand up today.", author: "H.G. Wells" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.", author: "Roy T. Bennett" },
  { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
  { text: "Everything you want is on the other side of fear.", author: "Jack Canfield" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Believe in yourself! Have faith in your abilities!", author: "Norman Vincent Peale" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Believe in the power of your own voice.", author: "Unknown" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Don't let the fear of losing be greater than the excitement of winning.", author: "Robert Kiyosaki" },
  { text: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "The harder the battle, the sweeter the victory.", author: "Les Brown" },
  { text: "Don't limit your challenges. Challenge your limits.", author: "Unknown" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "A river cuts through rock, not because of its power, but because of its persistence.", author: "James N. Watkins" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Never give up on a dream just because of the time it will take to accomplish it.", author: "Earl Nightingale" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Excellence is not a singular act, but a habit.", author: "Aristotle" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "The chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { text: "First we make our habits, then our habits make us.", author: "Charles C. Noble" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "The distance between your dreams and reality is called action.", author: "Unknown" },
  { text: "Don't wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { text: "Work hard in silence, let success be your noise.", author: "Frank Ocean" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "The key to success is to start before you are ready.", author: "Marie Forleo" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Success is not how high you have climbed, but how you make a positive difference.", author: "Roy T. Bennett" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Turn your face to the sun and the shadows fall behind you.", author: "Maori Proverb" },
  { text: "Every day is a new beginning.", author: "Unknown" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "Today is your opportunity to build the tomorrow you want.", author: "Ken Poirot" },
  { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
  { text: "Yesterday is history, tomorrow is a mystery, today is a gift.", author: "Eleanor Roosevelt" },
  { text: "Each morning we are born again. What we do today is what matters most.", author: "Buddha" },
  { text: "Rise up, start fresh, see the bright opportunity in each new day.", author: "Unknown" },
  { text: "Smile in the mirror. Do that every morning and you'll start to see a big difference.", author: "Yoko Ono" },
  { text: "Write it on your heart that every day is the best day in your life.", author: "Ralph Waldo Emerson" },
  { text: "Morning is an important time of day because how you spend your morning can often tell you what kind of day you are going to have.", author: "Lemony Snicket" },
  { text: "Every morning brings new potential.", author: "Unknown" },
  { text: "The sun is a daily reminder that we too can rise again from the darkness.", author: "Unknown" },
  { text: "Let your smile change the world, but don't let the world change your smile.", author: "Unknown" },
  { text: "Be happy with what you have while working for what you want.", author: "Helen Keller" },
  { text: "Gratitude turns what we have into enough.", author: "Aesop" },
  { text: "Enjoy the little things, for one day you may look back and realize they were the big things.", author: "Robert Brault" },
  { text: "The more you praise and celebrate your life, the more there is in life to celebrate.", author: "Oprah Winfrey" },
  { text: "Joy is not in things; it is in us.", author: "Richard Wagner" },
  { text: "Find joy in everything you choose to do.", author: "Chuck Palahniuk" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The happiest people don't have the best of everything, they make the best of everything.", author: "Unknown" },
  { text: "Choose to be optimistic, it feels better.", author: "Dalai Lama" },
  { text: "Positive thinking will let you do everything better than negative thinking will.", author: "Zig Ziglar" },
  { text: "Once you replace negative thoughts with positive ones, you'll start having positive results.", author: "Willie Nelson" },
  { text: "Keep your face to the sunshine and you cannot see a shadow.", author: "Helen Keller" },
  { text: "Every day may not be good, but there's something good in every day.", author: "Unknown" },
  { text: "Tough times never last, but tough people do.", author: "Robert H. Schuller" },
  { text: "Storms make trees take deeper roots.", author: "Dolly Parton" },
  { text: "When you can't find the sunshine, be the sunshine.", author: "Unknown" },
  { text: "A problem is a chance for you to do your best.", author: "Duke Ellington" },
  { text: "Every adversity carries with it the seed of an equal or greater benefit.", author: "Napoleon Hill" },
  { text: "The gem cannot be polished without friction, nor man perfected without trials.", author: "Chinese Proverb" },
  { text: "Smooth seas do not make skillful sailors.", author: "African Proverb" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "Character cannot be developed in ease and quiet.", author: "Helen Keller" },
  { text: "The struggle you're in today is developing the strength you need tomorrow.", author: "Robert Tew" },
  { text: "Never let a bad day make you feel like you have a bad life.", author: "Unknown" },
  { text: "You are stronger than you know.", author: "Unknown" },
  { text: "You have within you right now, everything you need.", author: "Brian Tracy" },
  { text: "Trust yourself. You know more than you think you do.", author: "Benjamin Spock" },
  { text: "Self-confidence is the first requisite to great undertakings.", author: "Samuel Johnson" },
  { text: "You are the only person on earth who can use your ability.", author: "Zig Ziglar" },
  { text: "Don't be afraid of your fears. They're not there to scare you.", author: "JoyBell C." },
  { text: "Courage is resistance to fear, mastery of fear—not absence of fear.", author: "Mark Twain" },
  { text: "Fear kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Life begins at the end of your comfort zone.", author: "Neale Donald Walsch" },
  { text: "Growth and comfort do not coexist.", author: "Ginni Rometty" },
  { text: "If you want something you've never had, you must be willing to do something you've never done.", author: "Thomas Jefferson" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
  { text: "Take risks: if you win, you will be happy; if you lose, you will be wise.", author: "Unknown" },
  { text: "Only those who dare to fail greatly can ever achieve greatly.", author: "Robert F. Kennedy" },
  { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
  { text: "Mistakes are proof that you are trying.", author: "Unknown" },
  { text: "Don't fear failure. Fear being in the exact same place next year.", author: "Unknown" },
  { text: "Every master was once a disaster.", author: "T. Harv Eker" },
  { text: "There is no failure except in no longer trying.", author: "Elbert Hubbard" },
  { text: "The only real mistake is the one from which we learn nothing.", author: "Henry Ford" },
  { text: "Learn from yesterday, live for today, hope for tomorrow.", author: "Albert Einstein" },
  { text: "Experience is simply the name we give our mistakes.", author: "Oscar Wilde" },
  { text: "Mistakes are the portals of discovery.", author: "James Joyce" },
  { text: "The past cannot be changed. The future is yet in your power.", author: "Unknown" },
  { text: "Focus on the journey, not the destination.", author: "Greg Anderson" },
  { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Small steps in the right direction can turn out to be the biggest step of your life.", author: "Unknown" },
  { text: "A little progress each day adds up to big results.", author: "Unknown" },
  { text: "Don't compare your beginning to someone else's middle.", author: "Unknown" },
  { text: "Comparison is the thief of joy.", author: "Theodore Roosevelt" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "You were born to be real, not to be perfect.", author: "Unknown" },
  { text: "Imperfection is beauty, madness is genius.", author: "Marilyn Monroe" },
  { text: "Embrace the glorious mess that you are.", author: "Elizabeth Gilbert" },
  { text: "Your flaws are perfect for the heart that is meant to love you.", author: "Unknown" },
  { text: "Love yourself first and everything else falls into line.", author: "Lucille Ball" },
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
  { text: "Self-love is not selfish; you cannot truly love another until you know how to love yourself.", author: "Unknown" },
  { text: "Be proud of who you are, and not ashamed of how someone else sees you.", author: "Unknown" },
  { text: "You are enough just as you are.", author: "Meghan Markle" },
  { text: "Your value doesn't decrease based on someone's inability to see your worth.", author: "Unknown" },
  { text: "Don't let anyone dull your sparkle.", author: "Unknown" },
  { text: "Shine like the whole universe is yours.", author: "Rumi" },
  { text: "Let your light shine.", author: "Unknown" },
  { text: "Be a voice, not an echo.", author: "Albert Einstein" },
  { text: "Stand for something or you will fall for anything.", author: "Gordon A. Eadie" },
  { text: "Dare to be different.", author: "Unknown" },
  { text: "Normal is an illusion.", author: "Morticia Addams" },
  { text: "Why fit in when you were born to stand out?", author: "Dr. Seuss" },
  { text: "Be who you are and say what you feel.", author: "Dr. Seuss" },
  { text: "Today you are you, that is truer than true.", author: "Dr. Seuss" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Think and wonder, wonder and think.", author: "Dr. Seuss" },
  { text: "You're off to great places! Today is your day!", author: "Dr. Seuss" },
  { text: "Oh, the places you'll go!", author: "Dr. Seuss" },
  { text: "Kid, you'll move mountains!", author: "Dr. Seuss" },
  { text: "Will you succeed? Yes, you will indeed!", author: "Dr. Seuss" },
  { text: "You have brains in your head. You have feet in your shoes.", author: "Dr. Seuss" },
  { text: "If you never did, you should. These things are fun, and fun is good.", author: "Dr. Seuss" },
  { text: "Sometimes the questions are complicated and the answers are simple.", author: "Dr. Seuss" },
  { text: "It is better to know how to learn than to know.", author: "Dr. Seuss" },
  { text: "Everything stinks till it's finished.", author: "Dr. Seuss" },
  { text: "Don't cry because it's over, smile because it happened.", author: "Dr. Seuss" },
  { text: "Sometimes you will never know the value of a moment until it becomes a memory.", author: "Dr. Seuss" },
  { text: "To the world you may be one person, but to one person you may be the world.", author: "Dr. Seuss" },
  { text: "A person's a person, no matter how small.", author: "Dr. Seuss" },
  { text: "Unless someone like you cares a whole awful lot, nothing is going to get better.", author: "Dr. Seuss" },
  { text: "The more you give away the more happy you become.", author: "Dr. Seuss" },
  { text: "From there to here, and here to there, funny things are everywhere.", author: "Dr. Seuss" },
  { text: "Fantasy is a necessary ingredient in living.", author: "Dr. Seuss" },
  { text: "I like nonsense, it wakes up the brain cells.", author: "Dr. Seuss" },
  { text: "Think left and think right and think low and think high.", author: "Dr. Seuss" },
  { text: "If things start happening, don't worry, don't stew, just go right along.", author: "Dr. Seuss" },
  { text: "Step with care and great tact, and remember that life's a great balancing act.", author: "Dr. Seuss" },
  { text: "You're on your own. And you know what you know. And you are the one who'll decide where to go.", author: "Dr. Seuss" },
  { text: "Today is your day! Your mountain is waiting. So get on your way!", author: "Dr. Seuss" },
  { text: "Only you can control your future.", author: "Dr. Seuss" },
  { text: "It's not about what it is, it's about what it can become.", author: "Dr. Seuss" },
  { text: "I have heard there are troubles of more than one kind.", author: "Dr. Seuss" },
  { text: "My trouble is I talk to myself. My trouble is I listen.", author: "Dr. Seuss" },
  { text: "Be awesome! Be a book nut!", author: "Dr. Seuss" },
  { text: "Reading can take you places you have never been before.", author: "Dr. Seuss" },
  { text: "The more you read, the more you learn. The more you learn, the more places you'll go!", author: "Dr. Seuss" },
  { text: "Words and pictures are yin and yang.", author: "Dr. Seuss" },
  { text: "Children want the same things we want. To laugh, to be challenged, to be entertained.", author: "Dr. Seuss" },
  { text: "You're never too old, too wacky, too wild, to pick up a book and read to a child.", author: "Dr. Seuss" },
  { text: "Adults are just outdated children.", author: "Dr. Seuss" },
  { text: "I meant what I said and I said what I meant.", author: "Dr. Seuss" },
  { text: "In my world, everyone's a pony and they all eat rainbows and poop butterflies!", author: "Dr. Seuss" },
  { text: "If you keep your eyes open enough, oh, the stuff you will learn!", author: "Dr. Seuss" },
  { text: "Simple it's not, I am afraid you will find, for a mind-maker-upper to make up his mind.", author: "Dr. Seuss" },
  { text: "You can get help from teachers, but you are going to have to learn a lot by yourself.", author: "Dr. Seuss" },
  { text: "Just tell yourself, Duckie, you're really quite lucky!", author: "Dr. Seuss" },
  { text: "I'm glad we had the times together just to laugh and sing.", author: "Dr. Seuss" },
  { text: "I know it is wet and the sun is not sunny, but we can have lots of good fun that is funny.", author: "Dr. Seuss" },
  { text: "Look at me! Look at me! Look at me NOW! It is fun to have fun but you have to know how.", author: "Dr. Seuss" },
  { text: "I am the Lorax. I speak for the trees.", author: "Dr. Seuss" },
  { text: "Unless someone like you cares a whole awful lot, nothing is going to get better. It's not.", author: "Dr. Seuss" },
  { text: "It's opener there in the wide open air.", author: "Dr. Seuss" },
  { text: "You'll miss the best things if you keep your eyes shut.", author: "Dr. Seuss" },
  { text: "When he worked, he really worked. But when he played, he really PLAYED.", author: "Dr. Seuss" },
  { text: "You do not like them. So you say. Try them! Try them! And you may!", author: "Dr. Seuss" },
  { text: "I am not going to get up today!", author: "Dr. Seuss" },
  { text: "I know, up on top you are seeing great sights, but down at the bottom we, too, should have rights.", author: "Dr. Seuss" },
  { text: "So be sure when you step, step with care and great tact.", author: "Dr. Seuss" },
  { text: "And remember that life's a great balancing act.", author: "Dr. Seuss" },
  { text: "And will you succeed? Yes! You will, indeed!", author: "Dr. Seuss" },
  { text: "(98 and 3/4 percent guaranteed.)", author: "Dr. Seuss" },
  { text: "Kid, you'll move mountains! Today is your day! Your mountain is waiting. So get on your way!", author: "Dr. Seuss" },
  { text: "Congratulations! Today is your day. You're off to Great Places! You're off and away!", author: "Dr. Seuss" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { text: "You're on your own. And you know what you know. And YOU are the guy who'll decide where to go.", author: "Dr. Seuss" },
  { text: "You'll look up and down streets. Look 'em over with care. About some you will say, 'I don't choose to go there.'", author: "Dr. Seuss" },
  { text: "With your head full of brains and your shoes full of feet, you're too smart to go down any not-so-good street.", author: "Dr. Seuss" },
  { text: "And you may not find any you'll want to go down. In that case, of course, you'll head straight out of town.", author: "Dr. Seuss" },
  { text: "It's opener there in the wide open air. Out there things can happen and frequently do.", author: "Dr. Seuss" },
  { text: "And when things start to happen, don't worry. Don't stew. Just go right along. You'll start happening too.", author: "Dr. Seuss" },
  { text: "Oh, the places you'll go! You'll be on your way up! You'll be seeing great sights!", author: "Dr. Seuss" },
  { text: "You'll join the high fliers who soar to high heights.", author: "Dr. Seuss" },
  { text: "You won't lag behind, because you'll have the speed. You'll pass the whole gang and you'll soon take the lead.", author: "Dr. Seuss" },
  { text: "Wherever you fly, you'll be best of the best. Wherever you go, you will top all the rest.", author: "Dr. Seuss" },
  { text: "Except when you don't. Because, sometimes, you won't.", author: "Dr. Seuss" },
  { text: "I'm sorry to say so but, sadly, it's true that Bang-ups and Hang-ups can happen to you.", author: "Dr. Seuss" },
  { text: "You can get all hung up in a prickle-ly perch. And your gang will fly on. You'll be left in a lurch.", author: "Dr. Seuss" },
  { text: "You'll come down from the Lurch with an unpleasant bump. And the chances are, then, that you'll be in a slump.", author: "Dr. Seuss" },
  { text: "And when you're in a slump, you're not in for much fun. Un-slumping yourself is not easily done.", author: "Dr. Seuss" },
  { text: "You will come to a place where the streets are not marked. Some windows are lighted. But mostly they're darked.", author: "Dr. Seuss" },
  { text: "A place you could sprain both your elbow and chin! Do you dare to stay out? Do you dare to go in?", author: "Dr. Seuss" },
  { text: "How much can you lose? How much can you win?", author: "Dr. Seuss" },
  { text: "And if you go in, should you turn left or right...or right-and-three-quarters? Or, maybe, not quite?", author: "Dr. Seuss" },
  { text: "Or go around back and sneak in from behind? Simple it's not, I'm afraid you will find.", author: "Dr. Seuss" },
  { text: "You can get so confused that you'll start in to race down long wiggled roads at a break-necking pace.", author: "Dr. Seuss" },
  { text: "And grind on for miles cross weirdish wild space, headed, I fear, toward a most useless place.", author: "Dr. Seuss" },
  { text: "The Waiting Place...for people just waiting.", author: "Dr. Seuss" },
  { text: "Waiting for a train to go or a bus to come, or a plane to go or the mail to come.", author: "Dr. Seuss" },
  { text: "Or the snow to snow or waiting around for a Yes or No or waiting for their hair to grow.", author: "Dr. Seuss" },
  { text: "Everyone is just waiting. Waiting for the fish to bite or waiting for wind to fly a kite.", author: "Dr. Seuss" },
  { text: "Or waiting, perhaps, for their Uncle Jake or a pot to boil, or a Better Break.", author: "Dr. Seuss" },
  { text: "Or a string of pearls, or a pair of pants or a wig with curls, or Another Chance.", author: "Dr. Seuss" },
  { text: "Everyone is just waiting. NO! That's not for you!", author: "Dr. Seuss" },
  { text: "Somehow you'll escape all that waiting and staying. You'll find the bright places where Boom Bands are playing.", author: "Dr. Seuss" },
  { text: "With banner flip-flapping, once more you'll ride high! Ready for anything under the sky.", author: "Dr. Seuss" },
  { text: "Ready because you're that kind of a guy!", author: "Dr. Seuss" },
  { text: "Oh, the places you'll go! There is fun to be done! There are points to be scored. There are games to be won.", author: "Dr. Seuss" },
  { text: "And the magical things you can do with that ball will make you the winning-est winner of all.", author: "Dr. Seuss" },
  { text: "Fame! You'll be as famous as famous can be, with the whole wide world watching you win on TV.", author: "Dr. Seuss" },
  { text: "Except when they don't. Because, sometimes, they won't.", author: "Dr. Seuss" },
  { text: "I'm afraid that some times you'll play lonely games too. Games you can't win 'cause you'll play against you.", author: "Dr. Seuss" },
  { text: "All Alone! Whether you like it or not, Alone will be something you'll be quite a lot.", author: "Dr. Seuss" },
  { text: "And when you're alone, there's a very good chance you'll meet things that scare you right out of your pants.", author: "Dr. Seuss" },
  { text: "There are some, down the road between hither and yon, that can scare you so much you won't want to go on.", author: "Dr. Seuss" },
  { text: "But on you will go though the weather be foul. On you will go though your enemies prowl.", author: "Dr. Seuss" },
  { text: "On you will go though the Hakken-Kraks howl. Onward up many a frightening creek.", author: "Dr. Seuss" },
  { text: "Though your arms may get sore and your sneakers may leak.", author: "Dr. Seuss" },
  { text: "On and on you will hike. And I know you'll hike far and face up to your problems whatever they are.", author: "Dr. Seuss" },
  { text: "You'll get mixed up, of course, as you already know. You'll get mixed up with many strange birds as you go.", author: "Dr. Seuss" },
  { text: "So be sure when you step. Step with care and great tact and remember that life's a great balancing act.", author: "Dr. Seuss" },
  { text: "Just never forget to be dexterous and deft. And never mix up your right foot with your left.", author: "Dr. Seuss" },
  { text: "And will you succeed? Yes! You will, indeed! (98 and 3/4 percent guaranteed.)", author: "Dr. Seuss" },
  { text: "Kid, you'll move mountains! Today is your day! Your mountain is waiting. So get on your way!", author: "Dr. Seuss" }
];

// Daily challenges
const dailyChallengesList = [
  "Drink 8 glasses of water today", "Take a 15-minute walk outside", "Write down 3 things you're grateful for",
  "Compliment someone sincerely", "Read for 20 minutes", "Meditate for 5 minutes", "Clean one area of your home",
  "Call a friend or family member", "Learn something new today", "Do a random act of kindness",
  "Stretch for 10 minutes", "Plan your meals for tomorrow", "Journal about your day",
  "Practice deep breathing for 5 minutes", "Organize your workspace", "Try a new healthy recipe",
  "Spend 30 minutes on a hobby", "Wake up 30 minutes earlier", "Avoid social media for 2 hours",
  "Do 20 pushups or squats", "Write a thank you note", "Listen to an educational podcast",
  "Set 3 priorities for tomorrow", "Declutter your digital files", "Practice positive affirmations",
  "Take a cold shower", "Cook a meal from scratch", "Spend quality time with family",
  "Learn 5 new words in a foreign language", "Do something that scares you", "Save $5 today",
  "Read an article outside your field"
];

// Storage keys
const STORAGE_KEYS = {
  HABITS: 'commandCenter_habits', HABIT_LOG: 'commandCenter_habitLog', GOALS: 'commandCenter_goals',
  TRANSACTIONS: 'commandCenter_transactions', HOBBIES: 'commandCenter_hobbies', EVENTS: 'commandCenter_events',
  ROUTINE: 'commandCenter_routine', JOURNAL: 'commandCenter_journal', FOCUS: 'commandCenter_focus',
  RATINGS: 'commandCenter_ratings', USER_NAME: 'commandCenter_userName', BG_IMAGE: 'commandCenter_bgImage',
  BG_FIT: 'commandCenter_bgFit', TODOS: 'commandCenter_todos', CHALLENGES: 'commandCenter_challenges',
  LAST_VISIT: 'commandCenter_lastVisit'
};


function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLog, setHabitLog] = useState<HabitLog>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([
    { id: 'r1', title: 'Drink water', description: 'Start with a glass', completed: false },
    { id: 'r2', title: 'Meditate', description: '5 minutes', completed: false },
    { id: 'r3', title: 'Plan the day', description: 'Review goals', completed: false }
  ]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [dailyRatings, setDailyRatings] = useState<{ [date: string]: number }>({});
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [activeTab, setActiveTab] = useState('today');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [dayDetailModalOpen, setDayDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [journalText, setJournalText] = useState('');
  const [userName, setUserName] = useState('My Dashboard');
  const [showMotivationalToast, setShowMotivationalToast] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState({ title: '', message: '' });
  const [time, setTime] = useState(new Date());

  const getTodayString = useCallback(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const formatDate = useCallback((date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  const getDailyQuote = useCallback(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
  }, []);

  const getTodayChallenge = useCallback(() => {
    const today = getTodayString();
    const todayChallenge = dailyChallenges.find(c => c.date === today);
    if (todayChallenge) return todayChallenge;
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const newChallenge: DailyChallenge = { id: Date.now().toString(), text: dailyChallengesList[dayOfYear % dailyChallengesList.length], completed: false, date: today };
    setDailyChallenges(prev => [...prev, newChallenge]);
    return newChallenge;
  }, [dailyChallenges, getTodayString]);

  useEffect(() => {
    const loadData = () => {
      const loadedHabits = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
      const loadedHabitLog = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABIT_LOG) || '{}');
      const loadedGoals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
      const loadedTransactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
      const loadedHobbies = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOBBIES) || '[]');
      const loadedEvents = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
      const loadedRoutine = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROUTINE) || 'null');
      const loadedJournal = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
      const loadedRatings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
      const loadedTodos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS) || '[]');
      const loadedChallenges = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHALLENGES) || '[]');
      const loadedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME);

      setHabits(loadedHabits); setHabitLog(loadedHabitLog); setGoals(loadedGoals);
      setTransactions(loadedTransactions); setHobbies(loadedHobbies); setEvents(loadedEvents);
      if (loadedRoutine) setRoutineItems(loadedRoutine);
      setJournalEntries(loadedJournal); setDailyRatings(loadedRatings);
      setTodos(loadedTodos); setDailyChallenges(loadedChallenges);
      if (loadedUserName) setUserName(loadedUserName);

      if (loadedHobbies.length === 0) {
        const defaultHobbies = ["Photography", "Guitar", "Piano", "Singing", "Drawing", "Painting", "Pottery", "Calligraphy", "Running", "Hiking", "Cycling", "Swimming", "Yoga", "Pilates", "Weightlifting", "Boxing", "Meditation", "Reading", "Writing", "Journaling", "Cooking", "Baking", "Gardening", "Bird watching", "Chess", "Board games", "Video games", "Puzzles", "Crosswords", "Sudoku", "Learning languages", "Coding", "3D modeling", "Video editing", "Podcasting", "Blogging", "Vlogging", "DIY projects", "Woodworking", "Knitting", "Sewing", "Embroidery", "Crochet", "Macrame", "Jewelry making", "Origami", "Scrapbooking", "Model building", "RC cars", "Drones", "Archery", "Fishing", "Hunting", "Horseback riding", "Skiing", "Snowboarding", "Skating", "Surfing", "Kayaking", "Sailing", "Traveling", "Camping", "Geocaching", "Astronomy", "Stargazing", "Meteorology", "Botany", "Mycology", "Aquarium keeping", "Terrariums", "Beekeeping", "Fermenting", "Brewing", "Wine tasting", "Coffee roasting", "Tea ceremony", "Book binding", "Leather crafting", "Blacksmithing", "Glass blowing", "Metal detecting", "Coin collecting", "Stamp collecting", "Antiquing", "Thrifting", "Fashion design", "Makeup artistry", "Nail art", "Perfumery", "Soap making", "Candle making", "Sculpture", "Street photography", "Portrait photography", "Landscape photography", "Macro photography", "Film photography", "Darkroom printing", "Digital art", "Pixel art", "Animation", "Stop motion", "Voice acting", "Impersonations", "Stand-up comedy", "Improv", "Magic tricks", "Juggling", "Unicycling", "Tightrope walking", "Acrobatics", "Parkour", "Martial arts", "Tai chi", "Qigong", "Breathwork", "Massage", "Aromatherapy", "Herbalism"];
        const newHobbies = defaultHobbies.map((name, i) => ({ id: `hobby-${i}-${Date.now()}`, name, category: ["Creative", "Active", "Relaxing", "Learning", "Social", "Other"][i % 6], status: "interested" as const }));
        setHobbies(newHobbies);
        localStorage.setItem(STORAGE_KEYS.HOBBIES, JSON.stringify(newHobbies));
      }

      const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
      const today = getTodayString();
      if (lastVisit !== today) {
        showToast('New Day, New Opportunities!', 'Every day is a fresh start. Make today count! 🌟');
        localStorage.setItem(STORAGE_KEYS.LAST_VISIT, today);
      }
    };
    loadData();
  }, [getTodayString]);

  const saveData = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    localStorage.setItem(STORAGE_KEYS.HABIT_LOG, JSON.stringify(habitLog));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.HOBBIES, JSON.stringify(hobbies));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routineItems));
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journalEntries));
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(dailyRatings));
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(dailyChallenges));
  }, [habits, habitLog, goals, transactions, hobbies, events, routineItems, journalEntries, dailyRatings, todos, dailyChallenges]);

  useEffect(() => { saveData(); }, [saveData]);
  useEffect(() => { const interval = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(interval); }, []);

  const showToast = (title: string, message: string) => {
    setMotivationalMessage({ title, message });
    setShowMotivationalToast(true);
    setTimeout(() => setShowMotivationalToast(false), 5000);
  };

  const computeOverallHabitStreak = useCallback(() => {
    let streak = 0, date = new Date();
    while (true) {
      const dateStr = formatDate(date);
      const log = habitLog[dateStr];
      if (!(log && log.some(item => item.done))) break;
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [habitLog, formatDate]);

  const computeJournalStreak = useCallback(() => {
    let streak = 0, date = new Date();
    while (true) {
      if (!journalEntries.some(e => e.date === formatDate(date))) break;
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [journalEntries, formatDate]);

  const computePerfectDays = useCallback(() => {
    const habitIds = habits.map(h => h.id);
    if (habitIds.length === 0) return 0;
    let count = 0;
    for (const dateStr in habitLog) {
      const log = habitLog[dateStr];
      if (habitIds.every(id => log.some(item => item.habitId === id && item.done))) count++;
    }
    return count;
  }, [habits, habitLog]);

  const computeHabitStreak = useCallback((habitId: string) => {
    let streak = 0, date = new Date();
    while (true) {
      const log = habitLog[formatDate(date)];
      if (!(log && log.some(item => item.habitId === habitId && item.done))) break;
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [habitLog, formatDate]);

  const getWeekProgress = useCallback(() => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const log = habitLog[formatDate(d)];
      if (log && log.some(item => item.done)) count++;
    }
    return Math.round(count / 7 * 100);
  }, [habitLog, formatDate]);

  const getYearProgress = useCallback(() => {
    const start = new Date(2026, 0, 1), end = new Date(2026, 11, 31);
    const total = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dayOfYear = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return { percent: ((dayOfYear / total) * 100).toFixed(1), dayOfYear, total, remaining: total - dayOfYear };
  }, []);

  const getBalance = useCallback(() => transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0), [transactions]);

  const getHeaderStats = useCallback(() => {
    const today = getTodayString();
    const log = habitLog[today] || [];
    return {
      doneCount: log.filter(h => h.done).length, totalHabits: habits.length,
      journalWritten: !!journalEntries.find(j => j.date === today),
      activeGoals: goals.filter(g => !g.completed).length, balance: getBalance()
    };
  }, [habitLog, journalEntries, goals, habits.length, getBalance, getTodayString]);

  const addHabit = () => {
    const nameInput = document.getElementById('habitName') as HTMLInputElement;
    const categoryInput = document.getElementById('habitCategory') as HTMLSelectElement;
    const targetInput = document.getElementById('habitTarget') as HTMLInputElement;
    const name = nameInput.value.trim();
    if (!name) return alert('Enter habit name');
    setHabits([...habits, { id: Date.now().toString(), name, category: categoryInput.value, target: parseInt(targetInput.value) }]);
    nameInput.value = '';
    showToast('Habit Created!', `You're building "${name}" into your routine! 💪`);
  };

  const toggleHabit = (habitId: string) => {
    const today = getTodayString();
    const newLog = { ...habitLog };
    if (!newLog[today]) newLog[today] = [];
    const found = newLog[today].find(l => l.habitId === habitId);
    if (found) found.done = !found.done; else newLog[today].push({ habitId, done: true });
    setHabitLog(newLog);
    const habitIds = habits.map(h => h.id);
    if (habitIds.every(id => newLog[today]?.some(item => item.habitId === id && item.done)) && habits.length > 0) {
      showToast('Perfect Day!', 'All habits completed! You\'re crushing it! 🔥');
      createConfetti();
    }
  };

  const deleteHabit = (habitId: string) => {
    if (!confirm('Delete this habit? It will also remove all its history.')) return;
    setHabits(habits.filter(h => h.id !== habitId));
    const newLog = { ...habitLog };
    for (let date in newLog) newLog[date] = newLog[date].filter(entry => entry.habitId !== habitId);
    setHabitLog(newLog);
  };

  const addGoal = () => {
    const titleInput = document.getElementById('goalTitle') as HTMLInputElement;
    const categoryInput = document.getElementById('goalCategory') as HTMLSelectElement;
    const dueDateInput = document.getElementById('goalDueDate') as HTMLInputElement;
    const title = titleInput.value.trim();
    if (!title) return alert('Enter goal title');
    setGoals([...goals, { id: Date.now().toString(), title, category: categoryInput.value, dueDate: dueDateInput.value, progress: 0, completed: false }]);
    titleInput.value = ''; dueDateInput.value = '';
    showToast('Goal Added!', `"${title}" is now on your journey! 🎯`);
  };

  const updateGoalProgress = (id: string, val: number) => setGoals(goals.map(g => g.id === id ? { ...g, progress: val } : g));

  const toggleGoalComplete = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
      if (!goal.completed) { showToast('Goal Completed!', `Congratulations on achieving "${goal.title}"! 🎉`); createConfetti(); }
    }
  };

  const addTransaction = () => {
    const descInput = document.getElementById('transDesc') as HTMLInputElement;
    const amountInput = document.getElementById('transAmount') as HTMLInputElement;
    const categoryInput = document.getElementById('transCategory') as HTMLSelectElement;
    const typeInput = document.getElementById('transType') as HTMLSelectElement;
    const desc = descInput.value.trim(), amount = parseFloat(amountInput.value);
    if (!desc || isNaN(amount)) return alert('Fill all fields');
    setTransactions([...transactions, { id: Date.now(), desc, amount, category: categoryInput.value, type: typeInput.value as 'income' | 'expense', date: getTodayString() }]);
    descInput.value = ''; amountInput.value = '';
    showToast('Transaction Added!', typeInput.value === 'income' ? `+$${amount} added! 💰` : `-$${amount} recorded! 💸`);
  };

  const deleteTransaction = (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    setTransactions(transactions.filter(t => t.id !== id));
    showToast('Transaction Deleted!', 'Your balance has been updated.');
  };

  const addTodo = () => {
    const textInput = document.getElementById('todoText') as HTMLInputElement;
    const priorityInput = document.getElementById('todoPriority') as HTMLSelectElement;
    const text = textInput.value.trim();
    if (!text) return alert('Enter todo text');
    setTodos([...todos, { id: Date.now().toString(), text, completed: false, priority: priorityInput.value as 'high' | 'medium' | 'low', date: getTodayString() }]);
    textInput.value = '';
  };

  const toggleTodo = (id: string) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  const addRoutineItem = () => {
    const title = prompt('Routine item title:', 'New item');
    if (!title) return;
    setRoutineItems([...routineItems, { id: 'r' + Date.now(), title, description: '', completed: false }]);
  };

  const toggleRoutine = (id: string) => setRoutineItems(routineItems.map(r => r.id === id ? { ...r, completed: !r.completed } : r));

  const openJournal = () => {
    const today = getTodayString();
    const entry = journalEntries.find(j => j.date === today);
    setJournalText(entry ? entry.text : '');
    setJournalModalOpen(true);
  };

  const saveJournal = () => {
    const today = getTodayString();
    const existingIndex = journalEntries.findIndex(j => j.date === today);
    if (existingIndex >= 0) { const updated = [...journalEntries]; updated[existingIndex].text = journalText; setJournalEntries(updated); }
    else setJournalEntries([...journalEntries, { date: today, text: journalText }]);
    setJournalModalOpen(false);
    showToast('Journal Saved!', 'Your thoughts are safely stored. 📝');
  };

  const loadJournalEntry = (date: string) => {
    const entry = journalEntries.find(j => j.date === date);
    if (entry) setJournalText(entry.text);
  };

  const setDayRating = (rating: number) => setDailyRatings({ ...dailyRatings, [getTodayString()]: rating });

  const addCustomHobby = () => {
    const nameInput = document.getElementById('hobbyName') as HTMLInputElement;
    const categoryInput = document.getElementById('hobbyCategory') as HTMLSelectElement;
    const name = nameInput.value.trim();
    if (!name) return alert('Enter hobby name');
    setHobbies([...hobbies, { id: Date.now().toString(), name, category: categoryInput.value, status: 'interested' }]);
    nameInput.value = '';
  };

  const setHobbyStatus = (id: string, status: 'interested' | 'trying' | 'mastered') => setHobbies(hobbies.map(h => h.id === id ? { ...h, status } : h));

  const addEvent = () => {
    const titleInput = document.getElementById('eventTitle') as HTMLInputElement;
    const dateInput = document.getElementById('eventDate') as HTMLInputElement;
    const title = titleInput.value.trim(), date = dateInput.value;
    if (!title || !date) return alert('Enter title and date');
    setEvents([...events, { id: Date.now().toString(), title, date }]);
    titleInput.value = ''; dateInput.value = '';
    showToast('Event Added!', `"${title}" is on your calendar! 📅`);
  };

  const completeChallenge = () => {
    const today = getTodayString();
    setDailyChallenges(dailyChallenges.map(c => c.date === today ? { ...c, completed: true } : c));
    showToast('Challenge Completed!', 'You\'re building amazing habits! 🏆');
    createConfetti();
  };

  const changeMonth = (delta: number) => { const newDate = new Date(currentCalendarDate); newDate.setMonth(newDate.getMonth() + delta); setCurrentCalendarDate(newDate); };
  const showDayDetail = (dateStr: string) => { setSelectedDate(dateStr); setDayDetailModalOpen(true); };

  const editTransactionFromDetail = (trans: Transaction) => {
    const newAmount = prompt('Enter new amount:', trans.amount.toString());
    if (newAmount === null) return;
    const amount = parseFloat(newAmount);
    if (isNaN(amount)) return;
    setTransactions(transactions.map(t => t.id === trans.id ? { ...t, amount } : t));
    showToast('Transaction Updated!', 'Your balance has been recalculated.');
  };

  const deleteTransactionFromDetail = (id: number) => { if (!confirm('Delete this transaction?')) return; setTransactions(transactions.filter(t => t.id !== id)); showToast('Transaction Deleted!', 'Your balance has been updated.'); };
  const editHabitFromDetail = (habitName: string) => { const habit = habits.find(h => h.name === habitName); if (!habit) return; const newName = prompt('Edit habit name:', habit.name); if (newName === null || newName.trim() === '') return; setHabits(habits.map(h => h.id === habit.id ? { ...h, name: newName.trim() } : h)); };

  const setUserNameHandler = () => {
    const nameInput = document.getElementById('userNameInput') as HTMLInputElement;
    const name = nameInput.value.trim();
    if (name) { setUserName(name); localStorage.setItem(STORAGE_KEYS.USER_NAME, name); showToast('Name Updated!', `Welcome, ${name}! 👋`); }
  };

  const handleBgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => { const bgUrl = e.target?.result as string; localStorage.setItem(STORAGE_KEYS.BG_IMAGE, bgUrl); applyBg(); };
      reader.readAsDataURL(file);
    }
  };

  const changeBgFit = (fit: string) => { localStorage.setItem(STORAGE_KEYS.BG_FIT, fit); applyBg(); };
  const resetBg = () => { localStorage.removeItem(STORAGE_KEYS.BG_IMAGE); localStorage.removeItem(STORAGE_KEYS.BG_FIT); document.body.classList.remove('custom-bg'); document.body.style.background = 'linear-gradient(135deg, #0a0f1a 0%, #1e1b4b 50%, #0a0f1a 100%)'; document.body.style.backgroundAttachment = 'fixed'; };
  const applyBg = () => { const bg = localStorage.getItem(STORAGE_KEYS.BG_IMAGE); const fit = localStorage.getItem(STORAGE_KEYS.BG_FIT) || 'cover'; if (bg) { document.body.style.setProperty('--user-bg', `url('${bg}')`); document.body.style.setProperty('--bg-size', fit); document.body.classList.add('custom-bg'); document.body.style.background = 'none'; } else resetBg(); };

  const createConfetti = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div'); confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw'; confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'; document.body.appendChild(confetti); setTimeout(() => confetti.remove(), 4000);
      }, i * 30);
    }
  };

  const saveFocus = () => { const focusInput = document.getElementById('todayFocus') as HTMLInputElement; localStorage.setItem(STORAGE_KEYS.FOCUS, focusInput.value); };
  useEffect(() => { const focus = localStorage.getItem(STORAGE_KEYS.FOCUS); if (focus) { const focusInput = document.getElementById('todayFocus') as HTMLInputElement; if (focusInput) focusInput.value = focus; } applyBg(); }, []);

  // Render functions
  const renderHabits = () => {
    const today = getTodayString();
    return habits.map(h => {
      const log = habitLog[today] || [];
      const done = log.some(l => l.habitId === h.id && l.done);
      const streak = computeHabitStreak(h.id);
      return (
        <div key={h.id} className={`habit-card ${done ? 'completed' : ''}`}>
          <button className="delete-habit" onClick={() => deleteHabit(h.id)} title="Delete habit">✕</button>
          <div className="habit-header"><span className="habit-title">{h.name}</span><span className="habit-streak">🔥 {streak}</span></div>
          <div className={`habit-check ${done ? 'checked' : ''}`} onClick={() => toggleHabit(h.id)}>{done ? '✓' : '○'}</div>
          <div className="habit-stats"><span className="habit-stat">{h.category}</span><span className="habit-stat">target {h.target}/wk</span></div>
        </div>
      );
    });
  };

  const renderGoals = () => goals.map(g => (
    <div key={g.id} className="goal-item">
      <div className="goal-header"><span className="goal-title">{g.title}</span><span className={`goal-category cat-${g.category.toLowerCase()}`}>{g.category}</span></div>
      <div className="goal-controls">
        <div className="progress-slider"><input type="range" min="0" max="100" value={g.progress} onChange={(e) => updateGoalProgress(g.id, parseInt(e.target.value))} /></div>
        <span className="progress-text">{g.progress}%</span>
        <input type="checkbox" className="checkbox-complete" checked={g.completed} onChange={() => toggleGoalComplete(g.id)} />
      </div>
    </div>
  ));

  const renderTransactions = () => transactions.slice(-10).reverse().map(t => (
    <div key={t.id} className="transaction-item">
      <div className="transaction-info"><div className="transaction-desc">{t.desc}</div><div className="transaction-meta">{t.category} · {t.date}</div></div>
      <div className={`transaction-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</div>
      <button className="transaction-delete" onClick={() => deleteTransaction(t.id)} title="Delete">🗑️</button>
    </div>
  ));

  const renderTodos = () => {
    const todayTodos = todos.filter(t => t.date === getTodayString());
    return todayTodos.map(t => (
      <div key={t.id} className={`todo-item ${t.completed ? 'completed' : ''}`}>
        <div className="todo-checkbox" onClick={() => toggleTodo(t.id)}>{t.completed ? '✓' : ''}</div>
        <div className="todo-text">{t.text}</div>
        <span className={`todo-priority ${t.priority}`}>{t.priority}</span>
        <button className="todo-delete" onClick={() => deleteTodo(t.id)}>🗑️</button>
      </div>
    ));
  };

  const renderRoutine = () => routineItems.map(item => (
    <div key={item.id} className={`routine-item ${item.completed ? 'completed' : ''}`} onClick={() => toggleRoutine(item.id)}>
      <div className="routine-checkbox">{item.completed ? '✓' : ''}</div>
      <div className="routine-content"><div className="routine-title">{item.title}</div><div className="routine-desc">{item.description || ' '}</div></div>
    </div>
  ));

  const renderJournalHistory = () => journalEntries.slice(-5).reverse().map(entry => (
    <div key={entry.date} className="journal-entry" onClick={() => loadJournalEntry(entry.date)}>
      <div className="journal-date">{entry.date}</div>
      <div className="journal-preview">{entry.text.substring(0, 100)}{entry.text.length > 100 ? '...' : ''}</div>
    </div>
  ));

  const renderHobbies = (filter: string) => {
    const filtered = hobbies.filter(h => filter === 'all' || h.status === filter);
    return filtered.map(h => (
      <div key={h.id} className="hobby-item">
        <div className="hobby-name">{h.name}</div>
        <div className="hobby-category">{h.category}</div>
        <div className="hobby-status">
          <button className={`status-btn status-interested ${h.status === 'interested' ? 'active' : ''}`} onClick={() => setHobbyStatus(h.id, 'interested')}>Interested</button>
          <button className={`status-btn status-trying ${h.status === 'trying' ? 'active' : ''}`} onClick={() => setHobbyStatus(h.id, 'trying')}>Trying</button>
          <button className={`status-btn status-mastered ${h.status === 'mastered' ? 'active' : ''}`} onClick={() => setHobbyStatus(h.id, 'mastered')}>Mastered</button>
        </div>
      </div>
    ));
  };

  const renderEvents = () => {
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map(e => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const evDate = new Date(e.date);
      const diff = Math.ceil((evDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return (
        <div key={e.id} className={`event-item ${diff < 0 ? 'event-passed' : ''} ${diff === 0 ? 'event-today' : ''}`}>
          <div className="event-date-box"><div className="event-day">{evDate.getDate()}</div><div className="event-month">{evDate.toLocaleString('default', { month: 'short' })}</div></div>
          <div className="event-details"><div className="event-title">{e.title}</div><div className="event-countdown-large">{diff === 0 ? 'Today' : diff < 0 ? 'Passed' : `${diff} days left`}</div></div>
        </div>
      );
    });
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear(), month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay(), totalDays = lastDay.getDate(), todayStr = getTodayString();
    const days: React.ReactNode[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(d => days.push(<div key={`header-${d}`} className="calendar-day-header">{d}</div>));
    for (let i = 0; i < startDayOfWeek; i++) days.push(<div key={`empty-${i}`} className="calendar-cell" style={{ background: 'transparent', boxShadow: 'none' }}></div>);
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d), dateStr = formatDate(date), isToday = dateStr === todayStr;
      const hasHabit = habitLog[dateStr]?.some(l => l.done);
      const hasJournal = journalEntries.some(e => e.date === dateStr);
      const hasMoney = transactions.some(t => t.date === dateStr);
      const hasRating = dailyRatings[dateStr] !== undefined;
      const hasTodo = todos.some(t => t.date === dateStr && !t.completed);
      days.push(
        <div key={`day-${d}`} className={`calendar-cell ${isToday ? 'today' : ''}`} onClick={() => showDayDetail(dateStr)}>
          <div className="calendar-day-number">{d}</div>
          <div className="calendar-dots">
            {hasHabit && <span className="dot habit" title="Habit done"></span>}
            {hasJournal && <span className="dot journal" title="Journal entry"></span>}
            {hasMoney && <span className="dot money" title="Transaction"></span>}
            {hasRating && <span className="dot rating" title="Rating"></span>}
            {hasTodo && <span className="dot todo" title="Todo"></span>}
          </div>
        </div>
      );
    }
    return days;
  };

  const renderDayDetail = () => {
    if (!selectedDate) return null;
    const habitDone = habitLog[selectedDate]?.filter(l => l.done).map(l => { const habit = habits.find(h => h.id === l.habitId); return habit ? { name: habit.name, id: habit.id } : null; }).filter(Boolean) as { name: string; id: string }[] || [];
    const journal = journalEntries.find(e => e.date === selectedDate);
    const transactionsDay = transactions.filter(t => t.date === selectedDate);
    const rating = dailyRatings[selectedDate];
    const dayTodos = todos.filter(t => t.date === selectedDate);
    return (
      <>
        <div className="detail-section">
          <h4>✅ Habits Done</h4>
          {habitDone.length ? habitDone.map(h => <div key={h.id} className="detail-item"><span>• {h.name}</span><div className="detail-actions"><button className="detail-btn detail-btn-edit" onClick={() => editHabitFromDetail(h.name)}>Edit</button></div></div>) : <div>None</div>}
        </div>
        <div className="detail-section"><h4>📝 Journal</h4>{journal ? <p>{journal.text.substring(0, 200)}{journal.text.length > 200 ? '...' : ''}</p> : <p>No entry</p>}</div>
        <div className="detail-section">
          <h4>💰 Transactions</h4>
          {transactionsDay.length ? transactionsDay.map(t => <div key={t.id} className="detail-item"><span>{t.desc}: ${t.amount} ({t.type})</span><div className="detail-actions"><button className="detail-btn detail-btn-edit" onClick={() => editTransactionFromDetail(t)}>Edit</button><button className="detail-btn detail-btn-delete" onClick={() => deleteTransactionFromDetail(t.id)}>Delete</button></div></div>) : <div>None</div>}
        </div>
        <div className="detail-section"><h4>✅ To-Dos</h4>{dayTodos.length ? dayTodos.map(t => <div key={t.id} className="detail-item"><span>{t.completed ? '✓' : '○'} {t.text} ({t.priority})</span></div>) : <div>None</div>}</div>
        <div className="detail-section"><h4>⭐ Rating</h4>{rating ? <div>{['😫', '😕', '😐', '🙂', '🤩'][rating - 1]} ({rating}/5)</div> : <div>Not rated</div>}</div>
      </>
    );
  };

  const headerStats = getHeaderStats();
  const yearProgress = getYearProgress();
  const todayChallenge = getTodayChallenge();
  const dailyQuote = getDailyQuote();

  return (
    <div className="container">
      <div className="bg-particles">{[...Array(20)].map((_, i) => <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s` }}></div>)}</div>
      {showMotivationalToast && <div className="motivational-toast"><div className="toast-header"><span className="toast-icon">🎉</span><span className="toast-title">{motivationalMessage.title}</span></div><div className="toast-message">{motivationalMessage.message}</div></div>}
      <div className="quick-access">
        <button className="fab fab-check fab-pulse" onClick={() => setActiveTab('habits')} title="Quick Habit Check">⚡</button>
        <button className="fab fab-journal" onClick={openJournal} title="Daily Journal">📝</button>
      </div>

      <div className="header animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="personal-name-badge">{userName}'s Dashboard</div>
        </div>
        <div className="header-top">
          <div className="datetime-section">
            <div className="time-display">{time.toLocaleTimeString('en-US', { hour12: false })}</div>
            <div className="date-display">{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="day-indicator">Day {yearProgress.dayOfYear} of 2026</div>
          </div>
          <div className="quote-section"><div className="quote-text">{dailyQuote.text}</div><div className="quote-author">— {dailyQuote.author}</div></div>
          <div className="year-progress-section">
            <div className="year-progress-label"><span>2026 Progress</span><span>{yearProgress.percent}%</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: yearProgress.percent + '%' }}></div></div>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><span>{yearProgress.remaining}</span> days remaining</div>
          </div>
        </div>
        <div className="daily-strip">
          <div className="status-card" onClick={() => setActiveTab('habits')}><div className="status-icon">✅</div><div className="status-label">Habits Today</div><div className="status-value">{headerStats.doneCount}/{headerStats.totalHabits}</div></div>
          <div className="status-card" onClick={openJournal}><div className="status-icon">📝</div><div className="status-label">Journal</div><div className="status-value">{headerStats.journalWritten ? 'Written' : 'Not written'}</div></div>
          <div className="status-card" onClick={() => setActiveTab('goals')}><div className="status-icon">🎯</div><div className="status-label">Active Goals</div><div className="status-value">{headerStats.activeGoals}</div></div>
          <div className="status-card" onClick={() => setActiveTab('money')}><div className="status-icon">💰</div><div className="status-label">Balance</div><div className="status-value">${headerStats.balance.toFixed(2)}</div></div>
        </div>
        <div className="streak-display">
          <div className="streak-item"><div className="streak-number">{computeOverallHabitStreak()}</div><div className="streak-label">Day Streak</div></div>
          <div className="streak-item"><div className="streak-number">{computeJournalStreak()}</div><div className="streak-label">Journal Streak</div></div>
          <div className="streak-item"><div className="streak-number">{computePerfectDays()}</div><div className="streak-label">Perfect Days</div></div>
        </div>
        <div className="header-bottom">
          <div className="events-preview">
            <h3>📅 Upcoming Events</h3>
            <div>{events.slice(0, 3).length ? events.slice(0, 3).map(e => { const evDate = new Date(e.date); const diff = Math.ceil((evDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)); return <div key={e.id} className="event-preview-item"><span>{e.title}</span><span className="event-countdown">{diff < 0 ? 'passed' : diff === 0 ? 'today' : diff + 'd'}</span></div>; }) : 'No upcoming events'}</div>
          </div>
          <div className="focus-section">
            <label className="focus-label">🎯 Today's Focus</label>
            <input type="text" className="focus-input" id="todayFocus" placeholder="What is your main focus for today?" onChange={saveFocus} />
          </div>
        </div>
      </div>

      <div className="nav-tabs">
        {['today', 'habits', 'goals', 'money', 'hobbies', 'schedule', 'calendar', 'settings'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'today' && '☀️ Today'}{tab === 'habits' && '🔄 Habits'}{tab === 'goals' && '🎯 Goals'}{tab === 'money' && '💰 Money'}
            {tab === 'hobbies' && '🎨 Hobbies'}{tab === 'schedule' && '📅 Schedule'}{tab === 'calendar' && '📆 Calendar'}{tab === 'settings' && '⚙️ Settings'}
          </button>
        ))}
      </div>

      {activeTab === 'today' && (
        <div className="tab-content active">
          <div className="daily-challenge">
            <h3>🏆 Daily Challenge</h3>
            <div className="challenge-text">{todayChallenge?.text}</div>
            <button className={`challenge-complete-btn ${todayChallenge?.completed ? 'completed' : ''}`} onClick={completeChallenge} disabled={todayChallenge?.completed}>{todayChallenge?.completed ? '✓ Completed!' : 'Mark Complete'}</button>
          </div>
          <div className="card">
            <h2 className="card-title">🌅 Morning Routine</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Start your day right. Check off items as you complete them.</p>
            <div className="routine-list">{renderRoutine()}</div>
            <button className="btn btn-primary" onClick={addRoutineItem} style={{ marginTop: '18px', width: '100%' }}>+ Add Routine Item</button>
          </div>
          <div className="card">
            <h2 className="card-title">✅ Today's To-Do List</h2>
            <div className="form-grid" style={{ marginBottom: '20px' }}>
              <div className="form-group" style={{ flex: 2 }}><label>Task</label><input type="text" id="todoText" placeholder="What needs to be done?" /></div>
              <div className="form-group"><label>Priority</label><select id="todoPriority"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}><button className="btn btn-primary" onClick={addTodo}>Add</button></div>
            </div>
            <div className="todo-list">{renderTodos()}</div>
          </div>
          <div className="daily-review">
            <h2 className="card-title" style={{ marginBottom: '12px' }}>🌙 Evening Review</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '18px' }}>How was your day? Rate it to track your mood over time.</p>
            <div className="review-grid">
              {[1, 2, 3, 4, 5].map(rating => <div key={rating} className={`review-item ${dailyRatings[getTodayString()] === rating ? 'selected' : ''}`} onClick={() => setDayRating(rating)}><div className="review-emoji">{['😫', '😕', '😐', '🙂', '🤩'][rating - 1]}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{['Tough', 'Okay', 'Neutral', 'Good', 'Amazing'][rating - 1]}</div></div>)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '18px', color: 'var(--text-secondary)' }}>{dailyRatings[getTodayString()] ? `Today's rating: ${['😫', '😕', '😐', '🙂', '🤩'][dailyRatings[getTodayString()] - 1]}` : 'No rating yet.'}</div>
          </div>
          <div className="card insights-card">
            <h2 className="card-title">💡 Daily Insights</h2>
            <div className="insight-item"><div className="insight-icon">🎯</div><div className="insight-content"><h4>Focus Reminder</h4><p>{localStorage.getItem(STORAGE_KEYS.FOCUS) || 'Set your daily focus in the header above!'}</p></div></div>
            <div className="insight-item"><div className="insight-icon">⏰</div><div className="insight-content"><h4>Up Next</h4><p>{events.length ? events[0].title : 'No upcoming events scheduled'}</p></div></div>
            <div className="insight-item"><div className="insight-icon">🔥</div><div className="insight-content"><h4>Motivation</h4><p>You're building great habits! Keep the momentum going.</p></div></div>
          </div>
          <div className="card">
            <h2 className="card-title">📊 Today's Snapshot</h2>
            <div className="goals-summary">
              <div className="summary-card"><div className="summary-value">{habitLog[getTodayString()]?.filter(l => l.done).length || 0}</div><div className="summary-label">Habits Done</div></div>
              <div className="summary-card"><div className="summary-value">{journalEntries.find(j => j.date === getTodayString())?.text.split(/\s+/).length || 0}</div><div className="summary-label">Journal Words</div></div>
              <div className="summary-card"><div className="summary-value">${transactions.filter(t => t.date === getTodayString() && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0).toFixed(0)}</div><div className="summary-label">Spent Today</div></div>
              <div className="summary-card"><div className="summary-value">{getWeekProgress()}%</div><div className="summary-label">Week Progress</div></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'habits' && (
        <div className="tab-content active">
          <div className="card">
            <h2 className="card-title">➕ Create New Habit</h2>
            <div className="form-grid">
              <div className="form-group"><label>Habit Name</label><input type="text" id="habitName" placeholder="e.g., Read 30 minutes" /></div>
              <div className="form-group"><label>Category</label><select id="habitCategory"><option value="Health">Health</option><option value="Productivity">Productivity</option><option value="Mindfulness">Mindfulness</option><option value="Learning">Learning</option><option value="Social">Social</option></select></div>
              <div className="form-group"><label>Target (times per week)</label><input type="number" id="habitTarget" defaultValue={7} min={1} max={7} /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}><button className="btn btn-primary" onClick={addHabit}>Create Habit</button></div>
            </div>
          </div>
          <div className="card"><h2 className="card-title">🔄 Your Habits</h2><div className="habits-grid">{renderHabits()}</div></div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="tab-content active">
          <div className="card">
            <h2 className="card-title">📊 Goals Overview</h2>
            <div className="goals-summary">
              <div className="summary-card"><div className="summary-value">{goals.length ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%</div><div className="summary-label">Average Progress</div></div>
              <div className="summary-card"><div className="summary-value">{goals.filter(g => g.completed).length}</div><div className="summary-label">Completed</div></div>
              <div className="summary-card"><div className="summary-value">{goals.length}</div><div className="summary-label">Total Goals</div></div>
            </div>
          </div>
          <div className="card">
            <h2 className="card-title">➕ Add New Goal</h2>
            <div className="form-grid">
              <div className="form-group"><label>Goal Title</label><input type="text" id="goalTitle" placeholder="Enter goal title" /></div>
              <div className="form-group"><label>Category</label><select id="goalCategory"><option value="Health">Health</option><option value="Career">Career</option><option value="Finance">Finance</option><option value="Learning">Learning</option><option value="Social">Social</option></select></div>
              <div className="form-group"><label>Due Date (Optional)</label><input type="date" id="goalDueDate" /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}><button className="btn btn-primary" onClick={addGoal}>Add Goal</button></div>
            </div>
          </div>
          <div className="card"><h2 className="card-title">📝 Your Goals</h2><div>{renderGoals()}</div></div>
        </div>
      )}

      {activeTab === 'money' && (
        <div className="tab-content active">
          <div className="balance-display"><div className="balance-label">Current Balance</div><div className="balance-amount">${getBalance().toFixed(2)}</div></div>
          <div className="card">
            <h2 className="card-title">➕ Add Transaction</h2>
            <div className="form-grid">
              <div className="form-group"><label>Description</label><input type="text" id="transDesc" placeholder="e.g., Grocery shopping" /></div>
              <div className="form-group"><label>Amount</label><input type="number" id="transAmount" placeholder="0.00" step="0.01" /></div>
              <div className="form-group"><label>Category</label><select id="transCategory"><option value="Food">Food</option><option value="Rent">Rent</option><option value="Fun">Fun</option><option value="Transport">Transport</option><option value="Income">Income</option><option value="Other">Other</option></select></div>
              <div className="form-group"><label>Type</label><select id="transType"><option value="expense">Expense</option><option value="income">Income</option></select></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}><button className="btn btn-primary" onClick={addTransaction}>Add Transaction</button></div>
            </div>
          </div>
          <div className="card">
            <h2 className="card-title">📈 Category Breakdown</h2>
            <div className="category-badges">{Object.entries(transactions.reduce((acc, t) => { if (t.type === 'expense') acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {} as { [key: string]: number })).map(([cat, amt]) => <span key={cat} className="badge">{cat}: ${amt.toFixed(2)}</span>)}</div>
          </div>
          <div className="card"><h2 className="card-title">🧾 Recent Transactions</h2><div className="transaction-list">{renderTransactions()}</div></div>
        </div>
      )}

      {activeTab === 'hobbies' && (
        <div className="tab-content active">
          <div className="card">
            <h2 className="card-title">➕ Add Custom Hobby</h2>
            <div className="form-grid">
              <div className="form-group"><label>Hobby Name</label><input type="text" id="hobbyName" placeholder="Enter hobby name" /></div>
              <div className="form-group"><label>Category</label><select id="hobbyCategory"><option value="Creative">Creative</option><option value="Active">Active</option><option value="Relaxing">Relaxing</option><option value="Learning">Learning</option><option value="Social">Social</option><option value="Other">Other</option></select></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}><button className="btn btn-primary" onClick={addCustomHobby}>Add Hobby</button></div>
            </div>
          </div>
          <div className="card">
            <h2 className="card-title">🎨 Your Hobbies</h2>
            <div className="filter-buttons">
              {['All', 'Interested', 'Trying', 'Mastered'].map(f => <button key={f} className={`filter-btn ${f === 'All' ? 'active' : ''}`} onClick={(e) => { document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); }}>{f}</button>)}
            </div>
            <div className="hobbies-grid">{renderHobbies('all')}</div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="tab-content active">
          <div className="card">
            <h2 className="card-title">➕ Add Event</h2>
            <div className="form-grid">
              <div className="form-group"><label>Event Title</label><input type="text" id="eventTitle" placeholder="e.g., Doctor Appointment" /></div>
              <div className="form-group"><label>Date</label><input type="date" id="eventDate" /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}><button className="btn btn-primary" onClick={addEvent}>Add Event</button></div>
            </div>
          </div>
          <div className="card"><h2 className="card-title">📅 All Events</h2><div className="event-list">{renderEvents()}</div></div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="tab-content active">
          <div className="card">
            <h2 className="card-title">📆 Your Data Calendar</h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
              <button className="btn btn-small btn-ghost" onClick={() => changeMonth(-1)}>◀ Prev</button>
              <span style={{ fontSize: '1.3rem', fontWeight: 600, flex: 1, textAlign: 'center' }}>{currentCalendarDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
              <button className="btn btn-small btn-ghost" onClick={() => changeMonth(1)}>Next ▶</button>
            </div>
            <div className="calendar-grid">{renderCalendar()}</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['habit', 'journal', 'money', 'rating', 'todo'].map(t => <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className={`dot ${t}`}></span> {t.charAt(0).toUpperCase() + t.slice(1)}</span>)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="tab-content active">
          <div className="card">
            <h2 className="card-title">👤 Personalization</h2>
            <div className="settings-card">
              <h3>Your Name</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input type="text" id="userNameInput" placeholder="Enter your name" style={{ flex: 1 }} defaultValue={userName.replace("'s Dashboard", "")} />
                <button className="btn btn-primary" onClick={setUserNameHandler}>Set Name</button>
              </div>
            </div>
            <div className="settings-card">
              <h3>Background Image</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>Upload an image to set as background (it will fit automatically).</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="file" id="bgUpload" accept="image/*" onChange={handleBgUpload} />
                <select id="bgFit" onChange={(e) => changeBgFit(e.target.value)} defaultValue="cover">
                  <option value="cover">Cover (fills screen)</option>
                  <option value="contain">Contain (fits entire image)</option>
                  <option value="fill">Fill (stretch)</option>
                </select>
                <button className="btn btn-danger" onClick={resetBg}>Reset to Default</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {journalModalOpen && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setJournalModalOpen(false); }}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">📝 Daily Journal</div><button className="modal-close" onClick={() => setJournalModalOpen(false)}>×</button></div>
            <div className="modal-body">
              <div className="journal-prompts">
                {['What made you smile today?', 'What challenged you today?', 'What are you grateful for?', 'What did you learn today?', 'How did you move closer to your goals?', ''].map((p, i) => <button key={i} className="prompt-btn" onClick={() => setJournalText(p ? p + '\n\n' : '')}>{['😊 What made you smile?', '💪 What challenged you?', '🙏 What are you grateful for?', '📚 What did you learn?', '🎯 Progress toward goals', '✍️ Free writing'][i]}</button>)}
              </div>
              <textarea className="journal-textarea" value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="Write your thoughts here..."></textarea>
              <div style={{ display: 'flex', gap: '14px', marginTop: '18px' }}><button className="btn btn-primary" onClick={saveJournal} style={{ flex: 1 }}>💾 Save Entry</button><button className="btn btn-small btn-ghost" onClick={() => setJournalModalOpen(false)}>Cancel</button></div>
              <div className="journal-history"><h3 style={{ marginBottom: '18px', color: 'var(--text-secondary)' }}>Recent Entries</h3>{renderJournalHistory()}</div>
            </div>
          </div>
        </div>
      )}

      {dayDetailModalOpen && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setDayDetailModalOpen(false); }}>
          <div className="modal day-detail-modal">
            <div className="modal-header"><div className="modal-title">📅 {selectedDate}</div><button className="modal-close" onClick={() => setDayDetailModalOpen(false)}>×</button></div>
            <div className="modal-body">{renderDayDetail()}</div>
          </div>
        </div>
      )}

      <div className="footer"><div className="footer-message">Small steps every day lead to extraordinary results</div><div>© 2026 Daily Command Center</div></div>
    </div>
  );
}

export default App;
