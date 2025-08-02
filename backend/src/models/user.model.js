import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    } ,
    email:{
        type: String,
        required: true,
        unique: true,
    } ,
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    bio:{
        type: String,
        default: "",
    },
    profilePhoto:{
        type: String,
        default: "",
    },
    nativeLang:{
        type: String,
        default: "",
    },
    learningLang:{
        type: String,
        default: "",
    },
    location:{
        type: String,
        default: "",
    },
    isOnboarded:{
        type: Boolean,
        default: false,
    },
    friends:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    }
},{
    timestamps: true,
})



//pre hook
// manu@gmail.com 1234556 =>&*#_m_955@$

userSchema.pre('save', async function(next) {
    try{
        if (this.isModified('password')) {
            // Hash the password before saving => 1: create salt 2: hash it with password
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    }catch(err){
        next(err);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

export const User = mongoose.model('User', userSchema);
