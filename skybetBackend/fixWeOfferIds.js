import mongoose from 'mongoose';
import JobPage from './models/JobPage.js';
import dotenv from 'dotenv';

dotenv.config();

const fixWeOfferIds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skybet');
    console.log('✅ Connected to MongoDB');

    // Get all JobPage documents
    const jobPages = await JobPage.find();
    console.log(`Found ${jobPages.length} JobPage document(s)`);

    for (const jobPage of jobPages) {
      if (jobPage.weOffer && jobPage.weOffer.length > 0) {
        console.log(`\nProcessing JobPage with ${jobPage.weOffer.length} weOffer items...`);
        
        // Regenerate array with new ObjectIds
        jobPage.weOffer = jobPage.weOffer.map((item) => {
          const itemObj = item.toObject ? item.toObject() : item;
          // Mongoose will auto-generate _id if missing
          return {
            _id: new mongoose.Types.ObjectId(),
            icon: itemObj.icon,
            title: itemObj.title,
            description: itemObj.description,
          };
        });

        // Save the document
        await jobPage.save();
        console.log(`✅ Updated ${jobPage.weOffer.length} weOffer items with new IDs`);
        
        // Show the updated data
        console.log('\nUpdated weOffer items:');
        jobPage.weOffer.forEach((item) => {
          console.log(`  - _id: ${item._id}, title: ${item.title}`);
        });
      }
    }

    console.log('\n✅ All weOffer IDs have been regenerated!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixWeOfferIds();
