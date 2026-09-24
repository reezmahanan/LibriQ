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
    console.log('[Seed] Connected to Sri Lankan Library Database (MongoDB)...');

    // Clear existing data & old indexes
    await User.deleteMany();
    await Book.deleteMany();
    await Transaction.deleteMany();
    await Book.collection.dropIndexes().catch(() => {});
    console.log('[Seed] Cleared existing library records and indexes.');

    // 1. Create Staff & Student Accounts
    const adminUser = await User.create({
      name: 'Dr. Senarath Bandara (Senior Assistant Librarian)',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
      phone: '+94 11 265 0301',
      memberId: 'LIB-ADM-01',
      indexNo: 'STAFF-LIB-01',
      faculty: 'Main University Library & Information Services',
      nic: '197829104820',
    });

    const student1 = await User.create({
      name: 'Reezma Hanan',
      email: 'student@lms.com',
      password: 'student123',
      role: 'member',
      phone: '+94 77 123 4567',
      memberId: '23IT0480',
      indexNo: '23IT0480',
      faculty: 'Faculty of Information Technology',
      nic: '200219403812',
    });

    const student2 = await User.create({
      name: 'Kavindu Perera',
      email: 'kavindu@lms.com',
      password: 'password123',
      role: 'member',
      phone: '+94 71 892 3411',
      memberId: '22CS0142',
      indexNo: '22CS0142',
      faculty: 'Faculty of Engineering',
      nic: '200128405910',
    });

    const student3 = await User.create({
      name: 'Fathima Nuha',
      email: 'nuha@lms.com',
      password: 'password123',
      role: 'member',
      phone: '+94 76 543 9081',
      memberId: '23TM0210',
      indexNo: '23TM0210',
      faculty: 'Faculty of Technology',
      nic: '200358401923',
    });

    console.log('[Seed] Created default Sri Lankan Librarian and Student accounts.');

    // 2. Create Books Collection with Sri Lankan and International University Catalog
    const books = await Book.create([
      {
        title: 'Database System Concepts (6th Edition)',
        author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
        isbn: '978-0073523323',
        category: 'Computer Science & IT',
        accessionNo: 'ACC-2023-0481',
        callNumber: '005.74 SIL',
        lendingType: 'Lending',
        language: 'English',
        totalCopies: 6,
        availableCopies: 5, // 1 borrowed by Reezma Hanan
        shelfLocation: 'Stack Area 2 - Shelf IT-04',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        description: 'Comprehensive undergraduate textbook covering relational databases, SQL, transaction processing, and concurrency control.',
        publishedYear: 2019,
        publisher: 'McGraw-Hill Education',
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Computer Science & IT',
        accessionNo: 'ACC-2022-1092',
        callNumber: '005.133 MAR',
        lendingType: 'Scheduled Reference (SR)',
        language: 'English',
        totalCopies: 4,
        availableCopies: 3, // 1 borrowed by Kavindu
        shelfLocation: 'SR Counter - Shelf CS-01',
        coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37271?auto=format&fit=crop&w=400&q=80',
        description: 'Recommended for software development project modules (IT2308/CS3040). Focuses on best practices, clean design, and test-driven code.',
        publishedYear: 2008,
        publisher: 'Prentice Hall',
      },
      {
        title: 'A History of Sri Lanka',
        author: 'Prof. K. M. de Silva',
        isbn: '978-0144000159',
        category: 'Sri Lankan Studies & Heritage',
        accessionNo: 'ACC-2021-0814',
        callNumber: '954.93 SIL',
        lendingType: 'Permanent Reference (PR)',
        language: 'English',
        totalCopies: 3,
        availableCopies: 3,
        shelfLocation: 'Sri Lanka Collection Room - Shelf SL-02',
        coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80',
        description: 'Definitive historical survey tracing Sri Lanka from antiquity through ancient hydraulic civilizations, colonial eras, to independence.',
        publishedYear: 2005,
        publisher: 'Penguin India / Vijitha Yapa Publications',
      },
      {
        title: 'ගම්පෙරළිය (Gamperaliya)',
        author: 'Martin Wickramasinghe (මාර්ටින් වික්‍රමසිංහ)',
        isbn: '978-9555130011',
        category: 'Sinhala Literature',
        accessionNo: 'ACC-2020-0312',
        callNumber: '891.483 WIC',
        lendingType: 'Lending',
        language: 'Sinhala',
        totalCopies: 5,
        availableCopies: 5,
        shelfLocation: 'National Literature - Shelf SIN-01',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
        description: 'Celebrated realistic masterpiece of Sinhala fiction depicting socio-economic transformation in southern Sri Lanka.',
        publishedYear: 1944,
        publisher: 'Sarasa Publishers Colombo',
      },
      {
        title: 'Computer Networks (5th Edition)',
        author: 'Andrew S. Tanenbaum, David J. Wetherall',
        isbn: '978-0132126953',
        category: 'Engineering & Technology',
        accessionNo: 'ACC-2023-1180',
        callNumber: '004.6 TAN',
        lendingType: 'Lending',
        language: 'English',
        totalCopies: 5,
        availableCopies: 4, // 1 overdue by Fathima
        shelfLocation: 'Stack Area 1 - Shelf NW-03',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
        description: 'Core reading for Wireless and Mobile Communications and Computer Network Engineering modules.',
        publishedYear: 2011,
        publisher: 'Pearson Education',
      },
      {
        title: 'IT2308 Database Systems - Past Examination Papers & Model Answers (2020-2025)',
        author: 'Department of Information Technology, ITUM / Moratuwa',
        isbn: '978-9550000231',
        category: 'Past Exam Papers & Repositories',
        accessionNo: 'ACC-2025-EX01',
        callNumber: 'EXAM-IT2308',
        lendingType: 'Permanent Reference (PR)',
        language: 'English',
        totalCopies: 4,
        availableCopies: 4,
        shelfLocation: 'Reserve Section - Counter Desk',
        coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be7f7a26?auto=format&fit=crop&w=400&q=80',
        description: 'Archived semester examination question papers, marking rubrics, and model answers for student revision.',
        publishedYear: 2025,
        publisher: 'University Examination Division',
      },
    ]);

    console.log(`[Seed] Created ${books.length} Sri Lankan library catalog titles.`);

    // 3. Create Sample Transaction Records (in Sri Lankan Rupees)
    // (a) Active borrow (Reezma Hanan - 23IT0480 borrowed Database System Concepts)
    await Transaction.create({
      book: books[0]._id,
      member: student1._id,
      issueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // in 10 days
      status: 'issued',
      notes: 'Issued against Student Card (Reg No: 23IT0480) for IT2308 Project',
    });

    // (b) Active SR Borrow (Kavindu Perera borrowed Clean Code)
    await Transaction.create({
      book: books[1]._id,
      member: student2._id,
      issueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // in 6 days
      status: 'issued',
      notes: 'Scheduled Reference overnight loan',
    });

    // (c) Overdue borrow (Fathima Nuha - 23TM0210 overdue on Computer Networks)
    await Transaction.create({
      book: books[4]._id,
      member: student3._id,
      issueDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
      dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days overdue
      status: 'overdue',
      fine: 40, // 4 days * Rs. 10.00 = Rs. 40.00
      notes: 'First overdue SMS reminder sent to +94 76 543 9081',
    });

    console.log('[Seed] Sample Sri Lankan loan transactions generated successfully.');
    console.log('================================================================');
    console.log('🇱🇰 SRI LANKAN UNIVERSITY LIBRARY MANAGEMENT SYSTEM (LMS) SEED');
    console.log('Librarian Login: admin@lms.com   / admin123 (Dr. Senarath Bandara)');
    console.log('Student Login:   student@lms.com / student123 (Reezma Hanan - 23IT0480)');
    console.log('Default Fine Rate: Rs. 10.00 per day');
    console.log('================================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding Sri Lankan LMS data:', error);
    process.exit(1);
  }
};

seedData();
