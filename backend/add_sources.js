const mysql = require('mysql2/promise');
async function run() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gpt_earn'
    });
    
    try {
        await pool.query(`
            INSERT INTO offerwall_networks (name, display_name, description, offerwall_url, status, payout_percent) 
            VALUES 
            ('hideout', 'Hideout.tv', 'Watch videos and earn rewards passively.', 'https://hideout.co/viewerlp.php?siteID={wall_id}&user={user_id}', 'active', 70),
            ('loottv', 'Loot.tv', 'Watch your favorite content and earn points.', 'https://loot.tv/affiliate/{pub_id}/{user_id}', 'active', 70)
            ON DUPLICATE KEY UPDATE status='active'
        `);
        
        await pool.query(`
            INSERT INTO tasks (title, description, task_link, reward, max_completions_per_user, cooldown_hours, task_type, icon)
            VALUES 
            ('Join Telegram', 'Join our official channel for promo codes', 'https://t.me/PrimeLoot', 0.25, 1, 9999, 'social_tasks', 'send'),
            ('Follow Instagram', 'Follow us to stay updated', 'https://instagram.com/PrimeLoot', 0.15, 1, 9999, 'social_tasks', 'instagram')
        `);
        
        console.log('Successfully added new earning sources!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}
run();
