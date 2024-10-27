const Item = require("../Models/item");
const User = require("../Models/user");
const ClaimItem = require("../Models/claimItem");
const { z } = require("zod");

const claimSchemaValidate = z.object({
    item: z
        .string({ required_error: "Item is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Item Id" }),
    claimBy: z
        .string({ required_error: "Person Claimed not Found" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ObjectId" }),
    claimVerified: z.boolean().optional(),
    dateReported: z.date().optional(),
});

const handleClaimItem = async (req, res) => {
    try {
        const { item } = req.body;
        const claimBy = req.user._id.toString();
        const validate = claimSchemaValidate.safeParse({ item, claimBy });
        const user = await User.findById(claimBy);
        const itemClaimed = await Item.findById(item);
        if (!user || !itemClaimed) {
            return res.status(401).json({
                success: false,
                message: "Invalid Claim Request",
            });
        }

        if (validate.success) {

            const claim = new ClaimItem({
                item,
                claimBy,
                dateReported: new Date(),
            });
            

            await claim.save();

            return res.status(201).json({
                success: true,
                message: "Claim Request Submitted Succesfully",
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: validate.error.issues.map((err) => err.message).join(", "),
            });
        }

    } catch (error) {
        console.error("Error Processing Claim Request", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}


const handleClaimVerification = async (req, res) => {
    try {
        const { claimId, status } = req.body;
        if (!claimId || !status) {
            return res.status(401).json({
                success: false,
                message: "Invalid Request",
            });
        }

        const claim = await ClaimItem.findById(claimId);
        if (!claim) {
            return res.status(401).json({
                success: false, 
                message: "Invalid Claim Request",
            });
        }

        const claimBy = claim.claimBy;
        const itemClaimed = await Item.findById(claim.item);

        claim.status = status;

        if (status.toLowerCase() === "accepted") {
            await ClaimItem.updateMany(
                { item: claim.item, _id: { $ne: claimId } }, 
                { $set: { status: "rejected" } }
            );

            itemClaimed.returnedOn = new Date();
            itemClaimed.returnedTo = claimBy;
            itemClaimed.returnedToOwner = true;
        }

        await claim.save();
        await itemClaimed.save();

        return res.status(201).json({
            success: true,
            message: "Claim Processed Successfully",
        });

    } catch (error) {
        console.error("Error Processing Claim Request", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}


const handleGetClaims = async (req, res) => {
    try {
        const claims = await ClaimItem.find({}).sort({ dateReported: -1 });
        if (!claims || claims.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Claim Requests Found",
                claims: [],
            });
        }
        return res.status(200).json({
            success: true,
            message: "Claim Requests Fetched Successfully",
            claims,
        })
    } catch (error) {
        console.error("Error Getting Claim Requests", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}

const handleUserClaims = async (req, res) => {
    try {
        const claims = await ClaimItem.find({ claimBy: req.user._id }).sort({ dateReported: -1 });
        if (!claims || claims.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Claim Requests Found",
                claims: [],
            });
        }
        return res.status(200).json({
            success: true,
            message: "Claim Requests Fetched Successfully",
            claims,
        })
    } catch (error) {
        console.error("Error Getting Claim Requests", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}



module.exports = { handleClaimItem, handleClaimVerification, handleGetClaims, handleUserClaims };