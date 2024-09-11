const Item = require("../Models/item");
const { z } = require("zod");

const itemSchemaValidate = z.object({
    name: z
        .string({
            required_error: "Item Name is required",
            invalid_type_error: "Item Name must be a string",
        }),
    description: z
        .string({
            required_error: "Item Description is required",
            invalid_type_error: "Item Description must be a string",
        }),
    category: z
        .string({ required_error: "Category is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category ObjectId" }),
    images: z.array(
        z.object({
            url: z
                .string({ required_error: "Image URL is required" })
                .regex(/^https?:\/\/(www\.)?[\w\-]+\.[\w\-]+(\/[\w\-.,@?^=%&:/~+#]*)?$/, {
                    message: "Invalid Image URL.",
                }),
        }),
    ),
    status: z.enum(['lost', 'found', 'returned'], {
        required_error: "Item Status is required",
        invalid_type_error: "Invalid Item Status",
    }),
    dateReported: z.date().optional(),
    returnedOn: z.date().optional(),
    returnedToOwner: z.boolean().optional(),
    reportedBy: z
        .string({ required_error: "User ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ObjectId" }),
    returnedTo: z
        .string({ required_error: "User ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ObjectId" })
        .optional(),
});

const itemUpdateSchemaValidate = z.object({
    status: z.enum(['lost', 'found', 'returned'], {
        required_error: "Item Status is required",
        invalid_type_error: "Invalid Item Status",
    }),
    returnedTo: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ObjectId" }),
    returnedOn: z.date().optional(),
    returnedToOwner: z.boolean({required_error:"Return Status Required", message:"Invalid Boolean for Return Status"}),
});


const handleAddItem = async(req,res)=>{
    try {
        const {name, description, category, images, status, reportedBy} = req.body;

        const validate = itemSchemaValidate.safeParse({name, description, category, images, status, reportedBy});
        
        if(validate.success){

            const item = new Item({
                name,
                description,
                category,
                images,
                status,
                reportedBy,
            });

            await item.save();

            return res.status(201).json({
                success: true,
                message: "Item Added Successfully",
            });
        }
        else{
            return res.status(400).json({
                success: false,
                message: validate.error.issues.map((err)=>err.message).join(", "),
            });
        }

    } catch (error) {
        console.error("Error Adding Item",error);
        return res.status(500).json({
            success:false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}


const handleUpdateItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Item Id.",
            });
        }

        const { name, description, category, images, status, reportedBy } = req.body;

        const validate = itemSchemaValidate.safeParse({
            name,
            description,
            category,
            images,
            status,
            reportedBy,
        });

        if (validate.success) {
            const updateFields = {
                name,
                description,
                category,
                images,
                status,
                reportedBy,
            };

            const item = await Item.findByIdAndUpdate(itemId, { $set: updateFields }, { new: true });

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Item Updated Successfully",
                item,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: validate.error.issues.map((err) => err.message).join(", "),
            });
        }
    } catch (error) {
        console.error("Error Updating Item", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
};

const handleUpdateItemStatus = async (req, res) => {
    try {
        const itemId = req.params.id;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Item Id.",
            });
        }

        const { status, returnedTo, returnedToOwner } = req.body;

        const validate = itemUpdateSchemaValidate.safeParse({status, returnedTo, returnedToOwner});

        if (validate.success) {
            const returnedOn = new Date.now();
            const updateFields = {
                status,
                returnedTo,
                returnedOn,
                returnedToOwner
            };

            const item = await Item.findByIdAndUpdate(itemId, { $set: updateFields }, { new: true });

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Item Status Updated Successfully",
                item,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: validate.error.issues.map((err) => err.message).join(", "),
            });
        }
    } catch (error) {
        console.error("Error Updating Item Status", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
};


const handleDeleteItem = async(req,res)=>{
    try {
        const itemId = req.params.id;

        if(!itemId){
            return res.status(409).json({
                success:false,
                message:"Invalid Item Id.",
            })
        }
        
        const item = await Item.findByIdAndDelete(itemId);

        if(!item){
            return res.status(409).json({
                success:false,
                message:"Item not Found.",
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message:"Item Deleted Successfully.",
            }) 
        }

    } catch (error) {
        console.error("Error Deleting Item",error);
        return res.status(500).json({
            success:false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}


const handleGetItems = async (req,res)=>{
    try {
        const items = await Item.find({});

        if (!items || items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Items Fetched Successfully",
            items,
        });

    } catch (error) {
        console.error("Error Fetching Items",error);
        return res.status(500).json({
            success:false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}

const handleGetItemsByCategory = async(req,res)=>{
    try {
        const items = await Item.aggregate([
            {
                $addFields:{
                    "reportedBy": { "$toObjectId": "$reportedBy" }
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "_id",
                    as: "reportedBy"
                }
            },
            {
                $addFields:{
                    reportedBy:{
                          $arrayElemAt: ["$reportedBy",0]
                    }
                }
            },
            {
                $addFields:{
                    "returnedTo": { "$toObjectId": "$returnedTo" }
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "returnedTo",
                    foreignField: "_id",
                    as: "returnedTo"
                }
            },
            {
                $addFields:{
                    returnedTo:{
                          $arrayElemAt: ["$returnedTo",0]
                    }
                }
            },
            {
                $group:{
                    _id: "$category",
                    items: { 
                      $push:{  
                            _id:"$_id",
                            name: "$name", 
                            description: "$description", 
                            images: "$images", 
                            status: "$status", 
                            reportedBy: "$reportedBy", 
                            location: "$location", 
                            dateReported: "$dateReported", 
                            returnedTo: "$returnedTo",
                            returnedOn: "$returnedOn",
                            returnedToOwner: "$returnedToOwner",
                        } 
                    },
                    totalItems:{$sum:1}
                }
            },
            {
                $addFields:{
                    "_id": { "$toObjectId": "$_id" }
                }
            },
            {
                $lookup:{
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $addFields:{
                    categoryDetails:{
                          $arrayElemAt: ["$categoryDetails",0]
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Items Fetched By Category Successfully",
            items,
        });        

    } catch (error) {
        console.error("Error Fetching Items By Category",error);
        return res.status(500).json({
            success:false,
            message: "Internal Server Issue, Please try again!",
        });
    }
} 


const handleGetItemsOfACategory = async(req,res)=>{
    try {
        const categoryId = req.params.id;

        if(!categoryId){
            return res.status(409).json({
                success:false,
                message: "Invalid Category ID!",
            });
        }

        const items = await Item.aggregate([
              {
                $match:{
                    category: categoryId,
                }
              },
              {
                $addFields:{
                    "reportedBy": { "$toObjectId": "$reportedBy" }
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "_id",
                    as: "reportedBy"
                }
            },
            {
                $addFields:{
                    reportedBy:{
                          $arrayElemAt: ["$reportedBy",0]
                    }
                }
            },
            {
                $addFields:{
                    "returnedTo": { "$toObjectId": "$returnedTo" }
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "returnedTo",
                    foreignField: "_id",
                    as: "returnedTo"
                }
            },
            {
                $addFields:{
                    returnedTo:{
                          $arrayElemAt: ["$returnedTo",0]
                    }
                }
            },
            {
                $group:{
                    _id: "$category",
                    items: { 
                      $push:{  
                            _id:"$_id",
                            name: "$name", 
                            description: "$description", 
                            images: "$images", 
                            status: "$status", 
                            reportedBy: "$reportedBy", 
                            location: "$location", 
                            dateReported: "$dateReported", 
                            returnedTo: "$returnedTo",
                            returnedOn: "$returnedOn",
                            returnedToOwner: "$returnedToOwner",
                        } 
                    },
                    totalItems:{$sum:1}
                }
            },
            {
                $addFields:{
                    "_id": { "$toObjectId": "$_id" }
                }
            },
            {
                $lookup:{
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $addFields:{
                    categoryDetails:{
                          $arrayElemAt: ["$categoryDetails",0]
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Items Fetched By Category Successfully",
            items,
        }); 
    } catch (error) {
        console.error("Error Fetching Category Items",error);
        return res.status(500).json({
            success:false,
            message: "Internal Server Issue, Please try again!",
        });
    }
} 


module.exports = {handleAddItem,handleUpdateItem, handleDeleteItem, handleUpdateItemStatus, handleGetItems, handleGetItemsByCategory, handleGetItemsOfACategory};