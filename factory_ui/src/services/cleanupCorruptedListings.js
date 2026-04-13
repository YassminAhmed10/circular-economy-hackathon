/**
 * 🗑️ Cleanup corrupted listings from database
 * Run in browser console: cleanupCorruptedListings()
 */

const CORRUPTED_IDS = [
    // First batch of garbled Arabic text listings
    4037, 4036, 4035, 4034, 4033, 4032, 4031, 4030, 4029, 4028, 4027, 4026, 4025, 4024, 4023, 4022, 4021, 4020, 4019, 4018,
    // Second batch
    3995, 3994, 3993, 3992, 3991, 3990
];

export const cleanupCorruptedListings = async () => {
    console.log('🗑️ Starting cleanup of', CORRUPTED_IDS.length, 'corrupted listings...');
    
    let deleted = 0;
    let failed = 0;
    
    for (const id of CORRUPTED_IDS) {
        try {
            const response = await fetch(`https://localhost:54464/api/marketplace/waste-listings/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                console.log(`✅ Deleted listing ${id}`);
                deleted++;
            } else {
                console.warn(`⚠️ Failed to delete ${id}: ${response.status}`);
                failed++;
            }
        } catch (error) {
            console.error(`❌ Error deleting ${id}:`, error.message);
            failed++;
        }
    }
    
    console.log(`\n📊 Cleanup complete: ${deleted} deleted, ${failed} failed`);
    window.location.reload();
};

// Make it globally accessible
window.cleanupCorruptedListings = cleanupCorruptedListings;
