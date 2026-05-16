import mongoose from 'mongoose';

// നിങ്ങളുടെ ശരിക്കുള്ള പാസ്‌വേഡ് ആയ w2Ja-bB%xqvpiAZ ഇതിലേക്ക് കൃത്യമായി ചേർത്തിട്ടുണ്ട്
const MONGODB_URI = "mongodb+srv://adminnooralhuda_db_user:w2Ja-bB%25xqvpiAZ@cluster0.nx3eytq.mongodb.net/NoorAlHudaCRM?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI inside lib/mongodb.ts");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Database Connected Successfully to NoorAlHudaCRM");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

export default connectDB;