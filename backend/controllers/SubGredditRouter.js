const SubGreddit = require("../models/SubGreddit.model")
const config = require('../utils/config')
const Posts = require("../models/Posts.model")
const Report = require("../models/Report.model")
const { request } = require('express')

// const fs = require("fs");
const SubGredditRouter = require('express').Router()
var nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: "greddit172@gmail.com",
        pass: config.SMTP_PASSWORD
    }
})
const ImageKit = require('imagekit');
const imageKit = new ImageKit({
    publicKey: "public_IJLi9UAoKESgixezLLWdRZIoYlM=",
    privateKey: "private_vA7l2KfiHmMR5ETWryTRlgWLYS8=",
    urlEndpoint: "https://imagekit.io/dashboard/url-endpoints/lksjdf7sd"
})
SubGredditRouter.post('/', async (request, response) => {
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    }
    console.log("req.files", request.files)
    var modifiedUrl = null
    let image = request.files.image;
    imageKit.upload({
        file: image.data,
        fileName: image.name,
        useUniqueFileName: false,
        tags: ['express-fileupload', 'Imagekit'],

    }, async (err, result) => {
        if (err) {
            return response.status(500).send(err);
        }
        console.log("result", result)
        const { url } = result
        modifiedUrl = imageKit.url({
            src: url
        })
        console.log(request.body)
        console.log("modifiedUrl", modifiedUrl)
        const { Name,
            Description,
            Tags,
            Banned,
            Moderator,
            Followers } = request.body
        // Tags
        var parsedtags , parsedwords
        if (!Tags) {
            parsedtags = []
        }
        else
        {
            parsedtags = JSON.parse(Tags)
        }
        const time = Date.now()
        // Banned
        if (!Banned) {
            parsedwords = []
        }
        else
        {
            parsedwords = JSON.parse(Banned)
        }
        const date = Date.parse(request.body.date)
        if (!Name || !Description) {
            return response.status(400).json({
                error: 'Name or Description is Null'
            })
        }
        const subgreddit = new SubGreddit({
            Name,
            Description,
            Tags:parsedtags,
            Banned:parsedwords,
            Moderator,
            Followers,
            date,
            JoinRequests: [],
            Blocked: [],
            Reports: [],
            Post: [],
            Reported: [],
            Clicks: 0,
            PostGrowthData: [],
            ClickGrowthData: [],
            ImageURL: modifiedUrl
        })
        const savedsubgreddit = await subgreddit.save()
        savedsubgreddit.GrowthData = [{ date: new Date(), Join: true, User: savedsubgreddit._id }]
        const timeseconds = Date.now()
        savedsubgreddit.creationdate = timeseconds
        const postsavedsubgreddit = await savedsubgreddit.save()
        console.log(postsavedsubgreddit)
        response.status(201).json(postsavedsubgreddit)

    });
})

SubGredditRouter.get('/', async (request, response) => {
    const AllSubGreddits = await SubGreddit
        .find({}).populate('Post').populate('Moderator').populate('Followers').populate('Reports').populate('Followed').populate('JoinRequests').populate('Blocked')
    response.json(AllSubGreddits)
})

SubGredditRouter.get('/:id', async (request, response) => {
    const ID = request.params.id
    const subgreddit = await SubGreddit
        .findById(ID).populate('Post').populate('Moderator').populate('Followers').populate('Reports').populate('Followed').populate('JoinRequests').populate('Blocked')
    console.log(subgreddit)
    const currenttime = Date.now()
    const myreports = subgreddit.Reports
    const expiredreports = myreports.filter(report => (currenttime-report.creationdate>=config.TIME_PERIOD))
    console.log("expired reports",expiredreports)
    const unexpiredreports = myreports.filter(report => (currenttime-report.creationdate<config.TIME_PERIOD))
    console.log("unexpired reports",unexpiredreports)
    const ReportIDs = expiredreports.map(element => element._id)
    const deleteexpiredReports = await Report.deleteMany({ _id: { $in: ReportIDs } })
    console.log("Delete Expired Reports", deleteexpiredReports)
    const ModeratorID = subgreddit.Moderator._id
    subgreddit.Reports = unexpiredreports
    // TODO: TESTING PENDING
    const userid = request.user._id
    if (ModeratorID == userid) {
        response.json(subgreddit)
    }
    else {
        const Blockedids = subgreddit.Blocked.map(element => element._id)
        const UpdatedPosts = subgreddit.Post.map(element => Blockedids.includes(element._id) ? { ...element, By: { ...By, Username: "Blocked User" } } : element)
        subgreddit.Post = UpdatedPosts
        response.json(subgreddit)
    }
})

SubGredditRouter.get('/User/:id', async (request, response) => {
    // ! For 
    const ID = request.params.id
    const AllSubGreddits = await SubGreddit
        .find({}).populate('Post').populate('Moderator').populate('Followers').populate('Reports').populate('Followed').populate('JoinRequests').populate('Blocked')
    console.log(AllSubGreddits)
    const MySubGreddits = AllSubGreddits.filter(subgreddit => subgreddit.Moderator._id == ID)
    console.log(MySubGreddits)
    response.json(MySubGreddits)
})

// * Related to joining Subgreddit
SubGredditRouter.put('/join/:id', async (request, response) => {
    console.log(request.body)
    const { UserID } = request.body
    if (!UserID) {
        return response.status(400).json({
            error: 'UserID is empty in Join Request'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    if(subgreddit.JoinRequests.includes(UserID))
    {
        return response.status(400).json({
            error: 'User is already part of SubGreddit'
        })
    }
    const BlockedIDs = subgreddit.Blocked
    if(BlockedIDs.includes(UserID))
    {
        return response.status(400).json({
            error: 'User cannot send Join Request as they are already Blocked'
        })
    }
    subgreddit.JoinRequests = subgreddit.JoinRequests.concat(UserID)
    // const updatedsubgreddit = await subgreddit.save()
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})


SubGredditRouter.put('/leave/:id', async (request, response) => {
    console.log(request.body)
    const { UserID } = request.body
    if (!UserID) {
        return response.status(400).json({
            error: 'UserID is empty in Leave Request'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    subgreddit.Followers = subgreddit.Followers.filter(element => element != UserID)
    subgreddit.GrowthData = subgreddit.GrowthData.concat({ date: new Date(), User: UserID, Join: false })
    // const updatedsubgreddit = await subgreddit.save()
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

// * Related to Accepting/Rejecting Join Requests
SubGredditRouter.put('/accept/:id', async (request, response) => {
    console.log(request.body)
    const { UserID } = request.body
    if (!UserID) {
        return response.status(400).json({
            error: 'UserID is empty in Accept Request'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    if(subgreddit.Moderator==UserID)
    {
        return response.status(400).json({
            error: 'Moderator cannot send Join Request to his own SubGreddit'
        })
    }
    subgreddit.Followers = subgreddit.Followers.concat(UserID)
    subgreddit.JoinRequests = subgreddit.JoinRequests.filter(element => element != UserID)
    subgreddit.Followed = subgreddit.Followed.concat(UserID)
    subgreddit.GrowthData = subgreddit.GrowthData.concat({ date: new Date(), User: UserID, Join: true })
    // const updatedsubgreddit = await subgreddit.save()
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

SubGredditRouter.put('/reject/:id', async (request, response) => {
    console.log(request.body)
    const { UserID } = request.body
    if (!UserID) {
        return response.status(400).json({
            error: 'UserID is empty in Reject Request'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    if(subgreddit.Moderator==UserID)
    {
        return response.status(400).json({
            error: 'Moderator cannot send Join Request to his own SubGreddit'
        })
    }
    subgreddit.JoinRequests = subgreddit.JoinRequests.filter(element => element != UserID)
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    // const updatedsubgreddit = await subgreddit.save()
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})


// * Block Users
// TODO: Update body required for email in Frontend
SubGredditRouter.put('/block/:id', async (request, response) => {
    console.log(request.body)
    const { UserID, ReportOnUsername, ReportedByUsername, ReportByEmail, ReportOnEmail, SubGredditName } = request.body
    if (!UserID) {
        return response.status(400).json({
            error: 'UserID is empty in Leave Request'
        })
    }
    if (!ReportByEmail || !ReportOnEmail) {
        return response.status(400).json({
            error: 'Email Fields are empty in Block Request'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    if(subgreddit.Blocked.includes(UserID))
    {
        return response.status(400).json({
            error: 'User is Already Blocked in the SubGreddit'
        })
    }
    if(subgreddit.Moderator == UserID)
    {
        return response.status(400).json({
            error: 'Cannot Block Moderator of a SubGreddit'
        })
    }
    subgreddit.Blocked = subgreddit.Blocked.concat(UserID)
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    // const updatedsubgreddit = await subgreddit.save()
    console.log(updatedsubgreddit)
    let mailOptions = {
        from: "greddit172@gmail.com",
        to: ReportByEmail,
        subject: "Action is taken based on your Report",
        text: `Welcome Gredditian!!!!
        Your Report on ${ReportOnUsername} has been analyzed
        and ${ReportOnUsername} has been banned from the SubGreddit ${SubGredditName}`
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
    mailOptions = {
        from: "greddit172@gmail.com",
        to: ReportOnEmail,
        subject: "Action is taken on you Based on a Report",
        text: `Welcome Gredditian!!!!
        Based on a Report from  ${ReportedByUsername} and after thorough Analysis
        You haved been banned from the SubGreddit ${SubGredditName}`
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
    response.status(201).json(updatedsubgreddit)
})

// Delete Report
SubGredditRouter.put('/Reports/:id', async (request, response) => {
    console.log(request.body)
    const { ReportID } = request.body
    if (!ReportID) {
        return response.status(400).json({
            error: 'ReportID is empty in Reports Request in SubGreddit'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    subgreddit.Reports = subgreddit.Reports.filter(element => element != ReportID)
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    // const updatedsubgreddit = await subgreddit.save()
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

// Delete Post
// TODO: Update body for Email Requests
SubGredditRouter.put('/Posts/:id', async (request, response) => {
    console.log(request.body)
    const { PostID, ReportOnUsername, ReportedByUsername, ReportByEmail, ReportOnEmail, SubGredditName } = request.body
    if (!PostID) {
        return response.status(400).json({
            error: 'PostID is empty in Posts Request in SubGreddit'
        })
    }
    if (!ReportByEmail || !ReportOnEmail) {
        return response.status(400).json({
            error: 'Email Fields are empty in Posts Request in SubGreddit'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    subgreddit.Post = subgreddit.Post.filter(element => element != PostID)
    // const updatedsubgreddit = await subgreddit.save()
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    let mailOptions = {
        from: "greddit172@gmail.com",
        to: ReportByEmail,
        subject: "Action is taken based on your Report",
        text: `Welcome Gredditian!!!!
        Your Report on ${ReportOnUsername} has been analyzed
        and the Reported Post has been deleted from the SubGreddit ${SubGredditName}`
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
    mailOptions = {
        from: "greddit172@gmail.com",
        to: ReportOnEmail,
        subject: "Action is taken on you Based on a Report",
        text: `Welcome Gredditian!!!!
        Based on a Report from  ${ReportedByUsername} and after thorough Analysis
        Your post has been deleted  from the SubGreddit ${SubGredditName}`
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

// Update Clicks 
SubGredditRouter.put('/Click/:id', async (request, response) => {
    console.log(request.body)
    const subgreddit = await SubGreddit.findById(request.params.id)
    const date = new Date()
    subgreddit.Clicks = subgreddit.Clicks.concat(date)
    const timeseconds = Date.now()
    subgreddit.ClickGrowthData = subgreddit.ClickGrowthData.concat(Number(timeseconds))
    // const updatedsubgreddit = await subgreddit.save()
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

// To update GrowthData via API call
SubGredditRouter.put('/GrowthData/:id', async (request, response) => {
    console.log(request.body)
    const subgreddit = await SubGreddit.findById(request.params.id)
    const { newelement } = request.body
    if (!newelement) {
        return response.status(400).json({
            error: 'newelement is empty in GrowthData Request in SubGreddit'
        })
    }
    subgreddit.GrowthData = subgreddit.GrowthData.concat(newelement)
    const updatedsubgreddit = await subgreddit.save()
    // const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id,subgreddit,{new:true})
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

SubGredditRouter.delete('/RemoveUser/:id', async (request, response) => {
    console.log(request.body)
    const { UserID } = request.body
    if (!UserID) {
        return response.status(400).json({
            error: 'UserID is empty in RemoveUser Request'
        })
    }
    const subgreddit = await SubGreddit.findById(request.params.id)
    subgreddit.Followers = subgreddit.Followers.filter(element => element != UserID)
    subgreddit.Reports = subgreddit.Reports.filter(element => element.On != UserID)
    // const updatedsubgreddit = await subgreddit.save()
    const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(subgreddit._id, subgreddit, { new: true })
    console.log(updatedsubgreddit)
    response.status(201).json(updatedsubgreddit)
})

SubGredditRouter.delete('/:id', async (request, response) => {
    const ID = request.params.id
    const subgreddit = await SubGreddit
        .findById(ID).populate('Followers').populate('Post').populate('Reports').populate('Reported')
    const PostIDs = subgreddit.Post.map(element => element._id)
    const ReportIDs = subgreddit.Reports.map(element => element._id)
    const deleteallPosts = await Posts.deleteMany({ _id: { $in: PostIDs } })
    console.log("Delete all Posts", deleteallPosts)
    const deleteallReports = await Report.deleteMany({ _id: { $in: ReportIDs } })
    console.log("Delete all Reports", deleteallReports)
    // TODO: Delete Followers ?
    const DeleteSubGreddit = await SubGreddit.findByIdAndDelete(ID)
    response.json(DeleteSubGreddit)
})

module.exports = SubGredditRouter










