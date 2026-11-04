// MongoDB Shell Script - Regenerate All Section IDs
// Run in MongoDB: mongosh skybet < fixAllSectionIds.mongo.js

db.jobpages.find().forEach((doc) => {
  let updated = false;
  
  // ===== FIX HERO SECTION (Give it an _id) =====
  if (doc.heroSection && !doc.heroSection._id) {
    print(`\n📝 Processing heroSection...`);
    doc.heroSection._id = new ObjectId();
    updated = true;
    print(`✅ heroSection now has _id: ${doc.heroSection._id}`);
  }

  // ===== FIX WE OFFER ARRAY (Regenerate all IDs) =====
  if (doc.weOffer && doc.weOffer.length > 0) {
    print(`\n🎁 Processing ${doc.weOffer.length} weOffer items...`);
    
    const updatedWeOffer = doc.weOffer.map((item) => ({
      _id: new ObjectId(),
      icon: item.icon,
      title: item.title,
      description: item.description,
    }));

    doc.weOffer = updatedWeOffer;
    updated = true;
    
    print(`✅ Updated ${updatedWeOffer.length} weOffer items:`);
    updatedWeOffer.forEach((item) => {
      print(`   - _id: ${item._id}, title: ${item.title}`);
    });
  }

  // ===== FIX ADDITIONAL SECTION (Give it an _id) =====
  if (doc.additionalSection && !doc.additionalSection._id) {
    print(`\n📋 Processing additionalSection...`);
    doc.additionalSection._id = new ObjectId();
    updated = true;
    print(`✅ additionalSection now has _id: ${doc.additionalSection._id}`);
  }

  // Save if any updates were made
  if (updated) {
    db.jobpages.replaceOne(
      { _id: doc._id },
      doc
    );
    print(`\n💾 Document saved!\n`);
  }
});

print("============================================");
print("✅ All sections have been updated!");
print("============================================");
