// Quick migration script to safely insert missing banner rows
import pool from './config/db.js';

async function migrate() {
  const conn = await pool.getConnection();
  try {
    // Check each group and insert if missing
    const checks = [
      {
        position: 'bogo_deal',
        rows: [
          ['Vitamin C Face Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-04.jpg_1.png', '/shop', 'bogo_deal'],
          ['Korean Glass Skin Wash BOGO', '/byone_getfree/Buy1Get1Free_V2-06.jpg_1.png', '/shop', 'bogo_deal'],
          ['De-Tan Face Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.08PM_1.png', '/shop', 'bogo_deal'],
          ['Charcoal Scrub BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM.png', '/shop', 'bogo_deal'],
          ['Nose Strips Pack BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.09PM_1.png', '/shop', 'bogo_deal'],
          ['Sunscreen Gel BOGO', '/byone_getfree/WhatsAppImage2026-05-22at1.27.10PM.png', '/shop', 'bogo_deal'],
        ]
      },
      {
        position: 'korean_range_banner',
        rows: [
          ['NO DRAMA, ONLY FLAWLESS GLOW!', '/koren_products/korean_range_summer_theme-01_jpg.png', '/shop', 'korean_range_banner'],
        ]
      },
      {
        position: 'korean_range_card',
        rows: [
          ['Korean Pack of 4 Flat 25% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM.png', '/shop', 'korean_range_card'],
          ['Korean CSMS Flat 46% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_1.png', '/shop', 'korean_range_card'],
          ['Korean Glass Skin Set Flat 43% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_2.png', '/shop', 'korean_range_card'],
          ['Explore Korean Range Flat 50% Off', '/koren_products/WhatsApp_Image_2026-05-29_at_1.12.37_PM_3.png', '/shop', 'korean_range_card'],
        ]
      },
      {
        position: 'super_saver_combo',
        rows: [
          ['Combos @ 749', '/Super_Saver_Combos/Combos_749_jpg.png', '/shop', 'super_saver_combo'],
          ['Combos @ 1099', '/Super_Saver_Combos/Combos_1099.jpg_1.png', '/shop', 'super_saver_combo'],
          ['Combos @ 1499', '/Super_Saver_Combos/Combos_1499.jpg_1.png', '/shop', 'super_saver_combo'],
        ]
      },
      {
        position: 'rice_water_hero',
        rows: [
          ['Rice Water Serum Website Banner', '/hero_rice/Rice_Water_Serum_Website_Banner-01_11zon.png', '/shop', 'rice_water_hero'],
          ['Fab Five Banner', '/hero_rice/fab_five_Banner-1920x512_jpg.png', '/shop', 'rice_water_hero'],
        ]
      }
    ];

    for (const { position, rows } of checks) {
      const [[{ count }]] = await conn.query(
        `SELECT COUNT(*) as count FROM banners WHERE position = ?`, [position]
      );
      if (count === 0) {
        console.log(`Inserting ${rows.length} rows for position: ${position}`);
        for (const [title, image_url, link_url, pos] of rows) {
          await conn.query(
            `INSERT INTO banners (title, image_url, link_url, position, status) VALUES (?, ?, ?, ?, 'active')`,
            [title, image_url, link_url, pos]
          );
        }
      } else {
        console.log(`✓ ${position} already has ${count} rows — skipping`);
      }
    }

    // Show summary
    const [summary] = await conn.query(
      `SELECT position, COUNT(*) as count FROM banners GROUP BY position ORDER BY position`
    );
    console.log('\n=== Banners in DB ===');
    summary.forEach(r => console.log(`  ${r.position}: ${r.count} rows`));

  } finally {
    conn.release();
    process.exit(0);
  }
}

migrate().catch(err => { console.error(err); process.exit(1); });
