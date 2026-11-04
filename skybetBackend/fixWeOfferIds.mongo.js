// MongoDB Shell Script - Regenerate weOffer IDs
// Run in MongoDB: mongosh skybet < fixWeOfferIds.mongo.js

db.jobpages.find().forEach((doc) => {
  if (doc.weOffer && doc.weOffer.length > 0) {
    print(`Processing JobPage with ${doc.weOffer.length} weOffer items...`);
    
    // Regenerate each item with new _id
    const updatedWeOffer = doc.weOffer.map((item) => ({
      _id: new ObjectId(),
      icon: item.icon,
      title: item.title,
      description: item.description,
    }));

    // Update the document
    db.jobpages.updateOne(
      { _id: doc._id },
      { $set: { weOffer: updatedWeOffer } }
    );

    print(`✅ Updated ${updatedWeOffer.length} items`);
    updatedWeOffer.forEach((item) => {
      print(`  - _id: ${item._id}, title: ${item.title}`);
    });
  }
});

print("\n✅ All weOffer IDs regenerated!");
