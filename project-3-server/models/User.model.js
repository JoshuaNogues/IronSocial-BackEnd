const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
      type: String,
      required: true,
    },
    friends: {
        type: Array,
        default: [],
    },
    location: String,
    occupation: String,
    profile_image: {
        type: String,
        default: "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png"
    },
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
