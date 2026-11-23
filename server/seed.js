// seed script - populates the database with sample questions and users
// usage: node seed.js          -> seeds data
//        node seed.js --clear  -> clears everything first, then seeds

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import { DB_NAME } from './constants.js';
import User from './models/User.js';
import Question from './models/Question.js';
import TestAttempt from './models/TestAttempt.js';

const sampleQuestions = [
  // JavaScript
  {
    questionText: 'Which keyword is used to declare a constant in JavaScript?',
    options: ['var', 'let', 'const', 'define'],
    correctAnswer: 2,
  },
  {
    questionText: 'What does "===" operator check in JavaScript?',
    options: [
      'Value only',
      'Type only',
      'Value and type',
      'Reference equality',
    ],
    correctAnswer: 2,
  },
  {
    questionText: 'Which method converts a JSON string to a JavaScript object?',
    options: [
      'JSON.stringify()',
      'JSON.parse()',
      'JSON.convert()',
      'JSON.toObject()',
    ],
    correctAnswer: 1,
  },
  {
    questionText: 'What is the output of typeof null in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctAnswer: 2,
  },
  {
    questionText: 'Which array method creates a new array with the results of calling a function on every element?',
    options: ['forEach()', 'filter()', 'map()', 'reduce()'],
    correctAnswer: 2,
  },

  // React
  {
    questionText: 'What hook is used to manage state in a React functional component?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1,
  },
  {
    questionText: 'In React, what is the virtual DOM?',
    options: [
      'A direct copy of the real DOM',
      'A lightweight in-memory representation of the real DOM',
      'A browser extension for React',
      'A CSS framework for React',
    ],
    correctAnswer: 1,
  },
  {
    questionText: 'Which of the following is used to pass data from parent to child components in React?',
    options: ['State', 'Props', 'Context', 'Refs'],
    correctAnswer: 1,
  },
  {
    questionText: 'What does the useEffect hook do in React?',
    options: [
      'Manages component state',
      'Handles side effects like API calls',
      'Creates a new component',
      'Styles the component',
    ],
    correctAnswer: 1,
  },

  // Node.js / Express
  {
    questionText: 'Which module is used to create a web server in Node.js?',
    options: ['url', 'http', 'path', 'fs'],
    correctAnswer: 1,
  },
  {
    questionText: 'What does Express.js middleware do?',
    options: [
      'Directly modifies the database',
      'Processes requests before they reach route handlers',
      'Renders HTML pages',
      'Manages browser cookies only',
    ],
    correctAnswer: 1,
  },
  {
    questionText: 'Which command initializes a new Node.js project?',
    options: ['node start', 'npm init', 'node init', 'npm start'],
    correctAnswer: 1,
  },

  // MongoDB
  {
    questionText: 'What type of database is MongoDB?',
    options: ['Relational', 'NoSQL Document', 'Graph', 'Key-Value'],
    correctAnswer: 1,
  },
  {
    questionText: 'In MongoDB, what is a "collection" equivalent to in SQL?',
    options: ['Database', 'Table', 'Row', 'Column'],
    correctAnswer: 1,
  },
  {
    questionText: 'Which Mongoose method finds a single document by its ID?',
    options: ['find()', 'findOne()', 'findById()', 'getById()'],
    correctAnswer: 2,
  },

  // HTML / CSS
  {
    questionText: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<nav>'],
    correctAnswer: 1,
  },
  {
    questionText: 'What CSS property is used to change text color?',
    options: ['font-color', 'text-color', 'color', 'foreground'],
    correctAnswer: 2,
  },
  {
    questionText: 'Which CSS display value makes an element a flex container?',
    options: ['block', 'inline', 'flex', 'grid'],
    correctAnswer: 2,
  },

  // General Programming
  {
    questionText: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Applied Programming Integration',
      'Application Process Integration',
      'Automated Programming Interface',
    ],
    correctAnswer: 0,
  },
  {
    questionText: 'Which HTTP method is typically used to update an existing resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswer: 2,
  },
  {
    questionText: 'What does JWT stand for?',
    options: [
      'Java Web Technology',
      'JSON Web Token',
      'JavaScript Web Transfer',
      'JSON Web Toolkit',
    ],
    correctAnswer: 1,
  },
  {
    questionText: 'Which status code indicates a resource was successfully created?',
    options: ['200', '201', '204', '301'],
    correctAnswer: 1,
  },
  {
    questionText: 'What is the purpose of version control systems like Git?',
    options: [
      'To compile code faster',
      'To track changes and collaborate on code',
      'To deploy applications',
      'To design user interfaces',
    ],
    correctAnswer: 1,
  },
  {
    questionText: 'In a REST API, what does the GET method do?',
    options: [
      'Creates a new resource',
      'Retrieves a resource',
      'Updates a resource',
      'Deletes a resource',
    ],
    correctAnswer: 1,
  },
  {
    questionText: 'Which data structure uses FIFO (First In, First Out) ordering?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctAnswer: 1,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI.replace(/\/$/, '');
    await mongoose.connect(`${mongoUri}/${DB_NAME}`, { dbName: DB_NAME });
    console.log(`MongoDB connected for seeding (${mongoose.connection.db.databaseName})...`);

    // clear existing data if --clear flag is passed
    if (process.argv.includes('--clear')) {
      await Question.deleteMany({});
      await TestAttempt.deleteMany({});
      await User.deleteMany({});
      console.log('Cleared existing data.');
    }

    // seed questions
    const existingCount = await Question.countDocuments();
    if (existingCount === 0) {
      await Question.insertMany(sampleQuestions);
      console.log(`Inserted ${sampleQuestions.length} sample questions.`);
    } else {
      console.log(`${existingCount} questions already exist — skipping question seed.`);
    }

    // seed admin user
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user created: admin@test.com / admin123');
    } else {
      console.log('Admin user already exists — skipping admin seed.');
    }

    // seed a demo student user
    const studentExists = await User.findOne({ email: 'student@test.com' });
    if (!studentExists) {
      await User.create({
        name: 'Demo Student',
        email: 'student@test.com',
        password: 'student123',
        role: 'student',
      });
      console.log('Student user created: student@test.com / student123');
    } else {
      console.log('Student user already exists — skipping student seed.');
    }

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
