import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Transaction.deleteMany();
    console.log('[Seed] Cleared existing Users, Books, and Transactions.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Chief Librarian',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 555-0199',
      memberId: 'ADM-001',
    });

    const member1 = await User.create({
      name: 'Alex Johnson',
      email: 'student@lms.com',
      password: 'student123',
      role: 'member',
      phone: '+1 555-0142',
      memberId: 'MEM-1001',
    });

    const member2 = await User.create({
      name: 'Sophia Patel',
      email: 'sophia@example.com',
      password: 'password123',
      role: 'member',
      phone: '+1 555-0188',
      memberId: 'MEM-1002',
    });

    console.log('[Seed] Created default Admin and Member accounts.');

    // 2. Create Books
    const books = await Book.create([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Computer Science',
        totalCopies: 5,
        availableCopies: 4, // 1 borrowed
        shelfLocation: 'Shelf CS-101',
        coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37271?auto=format&fit=crop&w=400&q=80',
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
        publishedYear: 2008,
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        isbn: '978-0201633610',
        category: 'Computer Science',
        totalCopies: 3,
        availableCopies: 3,
        shelfLocation: 'Shelf CS-102',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions.',
        publishedYear: 1994,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0060935467',
        category: 'Fiction',
        totalCopies: 4,
        availableCopies: 3, // 1 overdue
        shelfLocation: 'Shelf FIC-03',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        publishedYear: 1960,
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0553380163',
        category: 'Science',
        totalCopies: 6,
        availableCopies: 6,
        shelfLocation: 'Shelf SCI-07',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
        description: 'A landmark volume in science writing by one of the great minds of our time, exploring black holes, time, and space.',
        publishedYear: 1988,
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0062316097',
        category: 'History',
        totalCopies: 4,
        availableCopies: 4,
        shelfLocation: 'Shelf HIS-14',
        coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80',
        description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution.',
        publishedYear: 2015,
      },
      {
        title: 'Zero to One: Notes on Startups, or How to Build the Future',
        author: 'Peter Thiel, Blake Masters',
        isbn: '978-0804139298',
        category: 'Business',
        totalCopies: 5,
        availableCopies: 5,
        shelfLocation: 'Shelf BIZ-09',
        coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be7f7a26?auto=format&fit=crop&w=400&q=80',
        description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create.',
        publishedYear: 2014,
      },
    ]);

    console.log(`[Seed] Created ${books.length} initial books in catalog.`);

    // 3. Create Sample Transactions
    // (a) Active borrow (Alex borrowed Clean Code)
    await Transaction.create({
      book: books[0]._id,
      member: member1._id,
      issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // in 9 days
      status: 'issued',
      notes: 'Initial assignment reading',
    });

    // (b) Overdue borrow (Sophia borrowed To Kill a Mockingbird)
    await Transaction.create({
      book: books[2]._id,
      member: member2._id,
      issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days overdue
      status: 'overdue',
      fine: 30, // 6 days * $5
      notes: 'English class literature review',
    });

    console.log('[Seed] Sample transaction records generated successfully.');
    console.log('----------------------------------------------------');
    console.log('Admin credentials:  admin@lms.com   / admin123');
    console.log('Member credentials: student@lms.com / student123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
