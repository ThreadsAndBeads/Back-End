const crypto = require("crypto");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const socialMediaSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: {
            values: ["facebook", "instagram", "google", "twitter"],
            message: "Social media is in: facebook, instagram, google and twitter",
        },
    },
    link: {
        type: String,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        validate: [isEmail, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6 characters"],
        select: false,
    },
    type: {
        type: String,
        required: [true, "Account type is required"],
        enum: {
            values: ["customer", "seller"],
            message: "Account type is either: customer or seller",
        },
    },
    image: {
        type: String,
    },
    address: {
        appartmentNo: {
            type: Number,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    phone: {
        type: String,
    },
    socialMediaLinks: {
        type: [socialMediaSchema],
    },
    isEmailVerified: {
        type: Boolean,
    },
    verificationToken: {
        type: String,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
});

//fire function before user is saved to database
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
