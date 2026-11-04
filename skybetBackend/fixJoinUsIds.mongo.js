// MongoDB Shell Script - Regenerate JoinUs nested document IDs
// Run in MongoDB: mongosh skybet < fixJoinUsIds.mongo.js

db.joinus.find().forEach((doc) => {
  let updated = false;
  
  // ===== FIX HERO JOIN (Add _id if missing) =====
  if (doc.heroJoin && !doc.heroJoin._id) {
    print(`📝 Adding _id to heroJoin...`);
    doc.heroJoin._id = new ObjectId();
    updated = true;
    print(`✅ heroJoin._id: ${doc.heroJoin._id}`);
  }

  // ===== FIX HOW WE WORK (Add _id if missing) =====
  if (doc.howWeWork && !doc.howWeWork._id) {
    print(`💼 Adding _id to howWeWork...`);
    doc.howWeWork._id = new ObjectId();
    updated = true;
    print(`✅ howWeWork._id: ${doc.howWeWork._id}`);
  }

  // ===== FIX TEAM MEMBERS (Regenerate all IDs) =====
  if (doc.teamMembers && doc.teamMembers.length > 0) {
    print(`👥 Processing ${doc.teamMembers.length} team members...`);
    
    const updatedMembers = doc.teamMembers.map((member) => ({
      _id: new ObjectId(),
      name: member.name,
      img: member.img,
      designation: member.designation,
      description: member.description,
    }));

    doc.teamMembers = updatedMembers;
    updated = true;
    
    print(`✅ Updated ${updatedMembers.length} team members:`);
    updatedMembers.forEach((member) => {
      print(`   - _id: ${member._id}, name: ${member.name}`);
    });
  }

  // Save if any updates were made
  if (updated) {
    db.joinus.replaceOne(
      { _id: doc._id },
      doc
    );
    print(`💾 Document saved!\n`);
  }
});

print("============================================");
print("✅ All JoinUs documents have been updated!");
print("============================================");
