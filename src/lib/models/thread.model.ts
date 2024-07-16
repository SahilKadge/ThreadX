import mongoose from "mongoose";


const threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread', // recursion 
        }
    ]
})

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema)

export default Thread;


// children concept 
// -> Thread orignal parent 
//     -> comment -1  children
//     -> comment -2   this will be parent of bellow children 
//         -> comment -1 on comment -2
//         -> comment -2 on comment -2