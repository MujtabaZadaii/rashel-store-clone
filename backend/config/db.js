import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'rashel_store';

// Auto-create database if not exists
try {
  const tempConnection = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword
  });
  await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await tempConnection.end();
  console.log(`Database "${dbName}" checked/created successfully.`);
} catch (err) {
  console.error('Warning: Could not auto-create database, attempting direct pool initialization:', err.message);
}

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Function to execute SQL file content statement by statement
async function executeSqlFile(filePath, connection) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let currentStatement = '';
  const statements = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('--') || trimmed.startsWith('#')) {
      continue;
    }
    currentStatement += line + '\n';
    if (trimmed.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }

  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  for (let statement of statements) {
    if (statement) {
      await connection.query(statement);
    }
  }
}

// Test connection and auto-initialize tables if empty
try {
  const connection = await pool.getConnection();
  console.log('MySQL Connection Pool initialized successfully.');
  
  // Check if tables need to be created
  const [rows] = await connection.query(`SHOW TABLES LIKE 'users'`);
  let needsSchema = (rows.length === 0);
  let needsSeed = false;
  
  if (!needsSchema) {
    // Check if the users table is empty
    try {
      const [userCountRows] = await connection.query(`SELECT COUNT(*) as count FROM users`);
      if (userCountRows[0].count === 0) {
        needsSeed = true;
      }
    } catch (e) {
      needsSchema = true;
    }
  }

  if (needsSchema || needsSeed) {
    console.log(`Database tables missing or empty (needsSchema: ${needsSchema}, needsSeed: ${needsSeed}). Initializing schema and seed data...`);
    const schemaPath = path.resolve(__dirname, '../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../database/seed.sql');
    
    if (needsSchema) {
      console.log('Executing schema...');
      await executeSqlFile(schemaPath, connection);
    }
    
    console.log('Executing seed data...');
    await executeSqlFile(seedPath, connection);
    
    console.log('Database tables and seed data initialized successfully.');
  } else {
    console.log('Database tables already exist. Upgrading banners column and checking seed...');
    
    try {
      await connection.query(`ALTER TABLE banners MODIFY COLUMN position VARCHAR(100) DEFAULT 'middle_promo'`);
      console.log('banners.position column verified/altered to VARCHAR(100).');
    } catch (err) {
      console.warn('Could not alter banners position column:', err.message);
    }

    const [bogoRows] = await connection.query(`SELECT COUNT(*) as count FROM banners WHERE position = 'bogo_deal'`);
    const [koreanBannerRows] = await connection.query(`SELECT COUNT(*) as count FROM banners WHERE position = 'korean_range_banner'`);
    const [koreanCardRows] = await connection.query(`SELECT COUNT(*) as count FROM banners WHERE position = 'korean_range_card'`);
    const [riceHeroRows] = await connection.query(`SELECT COUNT(*) as count FROM banners WHERE position = 'rice_water_hero'`);
    const [sliderRows] = await connection.query(`SELECT COUNT(*) as count FROM sliders`);

    // Safely insert only missing rows — never TRUNCATE existing data
    if (bogoRows[0].count === 0) {
      console.log('Inserting missing BOGO deal banners...');
      await connection.query(`
        INSERT INTO banners (title, image_url, link_url, position, status) VALUES
        ('Vitamin C Face Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-04.jpg_1.png', '/shop', 'bogo_deal', 'active'),
        ('Korean Glass Skin Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-06.jpg_1.png', '/shop', 'bogo_deal', 'active'),
        ('De-Tan Face Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.08PM_1.png', '/shop', 'bogo_deal', 'active'),
        ('Charcoal Scrub BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM.png', '/shop', 'bogo_deal', 'active'),
        ('Nose Strips Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM_1.png', '/shop', 'bogo_deal', 'active'),
        ('Sunscreen Gel BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.10PM.png', '/shop', 'bogo_deal', 'active')
      `);
    }

    if (koreanBannerRows[0].count === 0) {
      console.log('Inserting missing Korean Range main banner...');
      await connection.query(`
        INSERT INTO banners (title, image_url, link_url, position, status) VALUES
        ('NO DRAMA, ONLY FLAWLESS GLOW!', '/koren_products/korean_range_summer_theme-01_jpg.png', '/shop', 'korean_range_banner', 'active')
      `);
    }

    if (koreanCardRows[0].count === 0) {
      console.log('Inserting missing Korean Range offer cards...');
      await connection.query(`
        INSERT INTO banners (title, image_url, link_url, position, status) VALUES
        ('Korean Pack of 4 Flat 25% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM.png', '/shop', 'korean_range_card', 'active'),
        ('Korean CSMS Flat 46% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_1.png', '/shop', 'korean_range_card', 'active'),
        ('Korean Glass Skin Set Flat 43% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_2.png', '/shop', 'korean_range_card', 'active'),
        ('Explore Korean Range Flat 50% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_3.png', '/shop', 'korean_range_card', 'active')
      `);
    }

    if (riceHeroRows[0].count === 0) {
      console.log('Inserting missing Rice Water hero banners...');
      await connection.query(`
        INSERT INTO banners (title, image_url, link_url, position, status) VALUES
        ('Rice Water Serum Website Banner', '/hero_rice/Rice_Water_Serum_Website_Banner-01_11zon.png', '/shop', 'rice_water_hero', 'active'),
        ('Fab Five Banner', '/hero_rice/fab_five_Banner-1920x512_jpg.png', '/shop', 'rice_water_hero', 'active')
      `);
    }

    if (sliderRows[0].count === 0) {
      console.log('Inserting missing hero sliders...');
      await connection.query(`
        INSERT INTO sliders (title, subtitle, image_url, link_url, status) VALUES
        ('Rice Water Glow Serum', 'Advanced fermented formula', '/hero_rice_products/RiceWaterSerum_Website_Slide-01.png', '/shop', 'active'),
        ('K-Derma Glass Skin Set', 'Korean Glass Skin routine', '/hero_rice_products/KoreanGlassSkinSet_Slide-01.png', '/shop', 'active'),
        ('De-Tan Scrub', 'Get rid of stubborn tan', '/hero_rice_products/DeTan_Scrub_Slide-01.png', '/shop', 'active')
      `);
    }

    console.log('Homepage asset health check complete.');
  }

  // Ensure shop_by_categories table is created and seeded
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS shop_by_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active'
      )
    `);
    console.log('shop_by_categories table verified/created successfully.');
    
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM shop_by_categories');
    if (rows[0].count === 0) {
      console.log('Seeding shop_by_categories default rows...');
      await connection.query(`
        INSERT INTO shop_by_categories (name, slug, image_url, status) VALUES
        ('Scrub', 'scrub', '/Shop_By_Category/shop_by_category_summer_theme-02_jpg.png', 'active'),
        ('Face wash', 'face-wash', '/Shop_By_Category/shop_by_category_summer_theme-03_jpg.png', 'active'),
        ('Sunscreen', 'sunscreen', '/Shop_By_Category/shop_by_category_summer_theme-04_jpg.png', 'active'),
        ('Nose Strips', 'nose-strips', '/Shop_By_Category/shop_by_category_summer_theme-01.jpg_1.png', 'active'),
        ('K-Derma', 'k-derma', '/Range-08.png', 'active'),
        ('Shop Under 99', 'shop-under-99', '/Range.jpg_4.png', 'active')
      `);
      console.log('shop_by_categories seeded successfully.');
    }
  } catch (err) {
    console.warn('Could not verify/seed shop_by_categories table:', err.message);
  }
  
  // Always verify/update the admin user credentials to make sure it exists and uses the exact local bcrypt hash
  try {
    const [adminRows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@rashel.in']);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    if (adminRows.length === 0) {
      console.log('Inserting default admin user via JavaScript...');
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Super Admin', 'admin@rashel.in', hashedPassword, 'super_admin']
      );
      console.log('Default admin user inserted via JS.');
    } else {
      console.log('Admin user exists. Verifying/updating password hash...');
      const admin = adminRows[0];
      const isMatch = await bcrypt.compare('password123', admin.password);
      if (!isMatch) {
        console.log('Password hash mismatch. Updating admin password hash...');
        await connection.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hashedPassword, 'admin@rashel.in']
        );
        console.log('Admin password hash updated successfully.');
      } else {
        console.log('Admin password is correct and verified.');
      }
    }
  } catch (adminErr) {
    console.error('Failed to verify/update admin user password hash:', adminErr.message);
  }

  connection.release();
} catch (error) {
  console.error('Error connecting to or initializing MySQL database:', error.message);
  console.error('Please ensure MySQL is running.');
}

export default pool;
