import mongoose, { Model, Schema } from "mongoose";

// Define the interface for the restaurant
interface ProductData extends Document {
  title: string,
  desc: string;
  product_img: string
  price: number;
  color: string;
  size: string;
  stock: number, 
  createdAt: string;
  }

// Define the schema for the restaurant collection
const productSchema: Schema<ProductData> = new mongoose.Schema({
  title:{
    type: String,
    // required: [true, "please provide product title"],
    // unique : true
   
  },
  desc: {
    type: String,
    // required: [true, "please provide product description"],
  },
  product_img:
  {
    type: String,
    // required: [true, "please provide product image"],
    
  },
  price:
  {
    type: Number,
    // required: [true, "please provide product price"],
    // min: 0
  },
  color: {
    type: String,
    // required: [true, "please provide product color"]
  },
  size: {
    type : String,
    // required: [true, "please provide product size"]  
},
  stock:
  {
    type: Number,
    // required: [true, "please provide product stock"] , 
    // min: 0
  },

}, {timestamps : true});  // define time in mongodb like this  "createdAt": "2024-12-11T10:30:00.123Z","updatedAt": "2024-12-11T10:35:00.456Z", // Automatically updated

// Create the restaurant model

//Make sure that the collection name in your MongoDB database is "products" (plural) because Mongoose automatically looks for the plural, lowercased version of your model name.
//mongoose.model takes to parameter first collection name which is define at mongodb collection (here is products) and second is schema name by which our schema is created at above
export const ProductModel: Model<ProductData> =
  mongoose.models.products || //condition for check collection is created already or not-> if collection created already then not create second time   and execute it otherwise 
  mongoose.model("products", productSchema );  //create collection
