#!/usr/bin/env node

/**
 * Database Setup & Management Script untuk RuangPena
 * 
 * Usage:
 *   node scripts/db-setup.js [command]
 * 
 * Commands:
 *   setup     - Setup database pertama kali
 *   reset     - Reset database dan setup ulang
 *   seed      - Seed database dengan data contoh
 *   check     - Check koneksi database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n🔄 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} berhasil!`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} gagal!`, 'red');
    console.error(error.message);
    return false;
  }
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ File .env tidak ditemukan!', 'red');
    log('Silakan copy .env.example ke .env dan isi kredensial database', 'yellow');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('DATABASE_URL') || envContent.includes('your-database-url-here')) {
    log('⚠️  DATABASE_URL belum dikonfigurasi di .env', 'yellow');
    log('Silakan update DATABASE_URL dengan kredensial PostgreSQL Anda', 'yellow');
    return false;
  }
  
  log('✅ File .env sudah dikonfigurasi', 'green');
  return true;
}

function setupDatabase() {
  log('🚀 Setup Database RuangPena', 'bold');
  
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  // Generate Prisma client
  if (!execCommand('npx prisma generate', 'Generate Prisma client')) {
    process.exit(1);
  }
  
  // Push schema to database
  if (!execCommand('npx prisma db push', 'Push schema ke database')) {
    process.exit(1);
  }
  
  log('\n🎉 Database setup berhasil!', 'green');
  log('Anda bisa menjalankan:', 'blue');
  log('  npm run dev          - Start development server', 'blue');
  log('  npm run db:studio    - Buka Prisma Studio', 'blue');
}

function resetDatabase() {
  log('🔄 Reset Database RuangPena', 'bold');
  log('⚠️  Ini akan menghapus SEMUA data!', 'yellow');
  
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  // Reset database
  if (!execCommand('npx prisma migrate reset --force', 'Reset database')) {
    process.exit(1);
  }
  
  // Generate client
  if (!execCommand('npx prisma generate', 'Generate Prisma client')) {
    process.exit(1);
  }
  
  log('\n🎉 Database reset berhasil!', 'green');
}

function seedDatabase() {
  log('🌱 Seed Database dengan data contoh', 'bold');
  
  // Check if seed file exists
  const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
  if (!fs.existsSync(seedPath)) {
    log('❌ File seed tidak ditemukan!', 'red');
    log('Silakan buat file prisma/seed.ts terlebih dahulu', 'yellow');
    return;
  }
  
  if (!execCommand('npx prisma db seed', 'Seed database')) {
    process.exit(1);
  }
  
  log('🎉 Database seeding berhasil!', 'green');
}

function checkDatabase() {
  log('🔍 Check koneksi database...', 'blue');
  
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
    log('✅ Koneksi database berhasil!', 'green');
  } catch (error) {
    log('❌ Koneksi database gagal!', 'red');
    log('Periksa kredensial DATABASE_URL di file .env', 'yellow');
    console.error(error.message);
  }
}

function showHelp() {
  log('🗄️  Database Setup & Management Script untuk RuangPena', 'bold');
  log('\nUsage:', 'blue');
  log('  node scripts/db-setup.js [command]');
  log('\nCommands:', 'blue');
  log('  setup     - Setup database pertama kali');
  log('  reset     - Reset database dan setup ulang');
  log('  seed      - Seed database dengan data contoh');
  log('  check     - Check koneksi database');
  log('  help      - Show this help message');
  log('\nContoh:', 'blue');
  log('  node scripts/db-setup.js setup');
  log('  node scripts/db-setup.js check');
}

// Main script
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'reset':
    resetDatabase();
    break;
  case 'seed':
    seedDatabase();
    break;
  case 'check':
    checkDatabase();
    break;
  case 'help':
  case undefined:
    showHelp();
    break;
  default:
    log(`❌ Command "${command}" tidak dikenal!`, 'red');
    showHelp();
    process.exit(1);
}
