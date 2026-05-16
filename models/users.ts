import mongoose from 'mongoose';

// യൂസർ സ്കീമ ഡിഫൈൻ ചെയ്യുന്നു
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'staff',
    },
  },
  {
    timestamps: true,
  }
);

// പ്രൊഡക്ഷൻ സെർവറിൽ എറർ വരാതിരിക്കാനുള്ള ഫിക്സ്
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;