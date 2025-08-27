const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserAccounts = require('../models/UserAccounts');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://luslosjohnmark:schizoprenic96@cluster0.ktq6wku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0PORT=5000';

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);

  const adminEmail = 'admin@hr.com';
  const adminPassword = 'AdminPassword'; // Change this to a secure password
  const adminRole = 'HR';

  const existing = await UserAccounts.findOne({ email: adminEmail });
  if (existing) {
    console.log('HR admin already exists.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await UserAccounts.create({
    name: 'HR Admin',
    email: adminEmail,
    password: hashedPassword,
    role: adminRole,
  });

  console.log('HR admin seeded!');
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});