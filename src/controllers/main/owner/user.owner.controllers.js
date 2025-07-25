import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { UserOwner } from "../../../models/main/userOwners/userOwner.owner.model.js";
import { uploadOnCloudinary } from "../../../utils/cloudinary.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const registerUserOwner = asyncHandler( async(req, res) => {
  
    // get UserOwner details from frontend
    const { fullName, email, password, UserOwnername} = req.body
    console.log("email: ", email);

    // validation - not empty
    if (
        [fullName, email, UserOwnername, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }

    // check if UserOwner already exists: UserOwnername, email
    const existedUserOwner = await UserOwner.findOne({
        $or: [{ UserOwnername }, { email }]

    })

    if (existedUserOwner) {
        throw new ApiError(409, "UserOwner with email or UserOwnername already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar on cloud file is required")  
    }

    // check for UserOwner creation
    const UserOwner = await UserOwner.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        UserOwnername: UserOwnername.toLowerCase()
    })

    const createdUserOwner = await UserOwner.findById(UserOwner._id).select(
        "-password -refreshToken"
    )

    if (!createdUserOwner){
        throw new ApiError(500, "Something went wrong while registring the UserOwner")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUserOwner, "UserOwner registered successfully")
    )

} )

// login UserOwner Controller

const loginUserOwner = asyncHandler(async (req, res) => {


    // get UserOwner details from frontend
    const { email, UserOwnername, password} = req.body
    console.log(email);
    
    // validation - not empty
    if (!(email || UserOwnername)) {
        throw new ApiError(400, "UserOwnername or email is required for login")
    }

    // check if UserOwner exists: UserOwnername, email
    const UserOwner = await UserOwner.findOne({
        $or: [{UserOwnername},{email}]

    }) 
    

    if (!UserOwner) {
        throw new ApiError(404, "UserOwner does not exist")
        
    }

    // check for password
    const isPasswordVaild = await UserOwner.isPasswordCorrect(password)

    if (!isPasswordVaild) {
        throw new ApiError(401, "Invalid UserOwner credentials")        
    }

    // create access token and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(UserOwner._id)

    const loggedInUserOwner = await UserOwner.findById(UserOwner._id)
    .select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true
    }

    // return res
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            UserOwner: loggedInUserOwner, accessToken, refreshToken
        }, "UserOwner logged In Successfully"
    ))   
})

// logout UserOwner Controller

const logoutUserOwner = asyncHandler(async(req, res) => {
    await UserOwner.findByIdAndUpdate(
        req.UserOwner._id,
        {
            $unset: {
                refreshToken:  "" // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "UserOwner logged Out"))
})

// Endpoint for refreshAccessToken

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthoried request")

    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
            )

            const UserOwner = await UserOwner.findById(decodedToken?._id)

            if (!UserOwner) {
                throw new ApiError(401, "Invalid  Refresh Token")
                
            }

            if (incomingRefreshToken !== UserOwner?.refreshToken) {
                throw new ApiError(401, "Refresh Token Is Expired or used")
                
            }

            const{accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(UserOwner._id)

            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )

        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid Refresh Token")
        
    }
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const UserOwner = await UserOwner.findById(req.UserOwner?._id)
    const isPasswordCorrect = await UserOwner.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    UserOwner.password = newPassword
    await UserOwner.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUserOwner = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.UserOwner,
        "UserOwner fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const UserOwner = await UserOwner.findByIdAndUpdate(
        req.UserOwner?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, UserOwner, "Account details updated successfully"))
});

const updateUserOwnerAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const UserOwner = await UserOwner.findByIdAndUpdate(
        req.UserOwner?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, UserOwner, "Avatar image updated successfully")
    )
})

const updateUserOwnerCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const UserOwner = await UserOwner.findByIdAndUpdate(
        req.UserOwner?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, UserOwner, "Cover image updated successfully")
    )
})


export { 
   registerUserOwner,
   loginUserOwner,
   logoutUserOwner,
   refreshAccessToken,
   changeCurrentPassword
}