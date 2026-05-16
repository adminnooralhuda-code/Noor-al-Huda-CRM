import mongoose from 'mongoose';

// നിങ്ങളുടെ യഥാർത്ഥ MongoDB അറ്റ്‌ലസ് കണക്ഷൻ സ്ട്രിംഗ് ഇവിടെ നേരിട്ട് കൊടുക്കുക
const MONGODB_URI = "mongodb+srv://adminnooralhuda:നിങ്ങളുടെ_പാസ്‌വേഡ്@cluster.xxxx.mongodb.net/NoorAlHudaCRM?retryWrites=true&w=majority";

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