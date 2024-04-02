const Report = require("../models/Report.model")
const { request } = require('express')
const ReportRouter = require('express').Router()
const SubGreddit = require("../models/SubGreddit.model")
const config = require('../utils/config')
var nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: "greddit172@gmail.com",
        pass: config.SMTP_PASSWORD
    }
})
ReportRouter.post('/', async (request, response) => {
    console.log(request.body)
    const {
        Concern,
        Post,
        By,
        On,
        SubGredditID } = request.body
    const date = Date.parse(request.body.date)
    if (!Concern) {
        return response.status(400).json({
            error: 'Concern is empty in Login'
        })
    }
    if (!Post || !On || !By || !SubGredditID) {
        return response.status(400).json({
            error: 'Some Fields are missing in Report Creation'
        })
    }
    const timeseconds = Date.now()
    const report = new Report({
        Concern,
        Post,
        By,
        On,
        date,
        Ignored: false,
        creationdate:timeseconds
    })
    const savedreport = await report.save()
    const currentsubgreddit = await SubGreddit.findById(SubGredditID)
    currentsubgreddit.Reports = currentsubgreddit.Reports.concat(savedreport._id)
    currentsubgreddit.Reported = currentsubgreddit.Reported.concat(savedreport._id)
    const savedsubgreddit = await currentsubgreddit.save()
    console.log(savedreport)
    response.status(201).json(savedreport)
})

// ReportRouter.get('/', async (request, response) => {
//     const AllReports = await Report
//         .find({}).populate('Post').populate('By').populate('On')
//     response.json(AllReports)
// })

ReportRouter.get('/SubGreddit/:id', async (request, response) => {
    const AllReports = await Report
        .find({}).populate('Post').populate('By').populate('On')
    const currentsubgreddit = await SubGreddit.findById(request.params.id)
    console.log("All Reports are", AllReports)
    const currenttime = Date.now()
    const myreports = AllReports.filter(element => currentsubgreddit.Reports.includes(element._id))
    const expiredreports = myreports.filter(report => (currenttime-report.creationdate>=config.TIME_PERIOD))
    console.log("expired reports",expiredreports)
    const unexpiredreports = myreports.filter(report => (currenttime-report.creationdate<config.TIME_PERIOD))
    console.log("unexpired reports",unexpiredreports)
    const ReportIDs = expiredreports.map(element => element._id)
    console.log("These ID's will be Deleted",ReportIDs)
    const deleteexpiredReports = await Report.deleteMany({ _id: { $in: ReportIDs } })
    // TODO: Have to update individual subgreddits as well
    // TODO: TESTING PENDING
    console.log("Delete Expired Reports", deleteexpiredReports)
    response.json(unexpiredreports)
    console.log("My reports are", unexpiredreports)
})

ReportRouter.get('/:id', async (request, response) => {
    const ID = request.params.id
    const report = await Report
        .findById(ID).populate('Post').populate('By').populate('On')
    const currenttime = Date.now()
    if(currenttime-report.creationdate >= config.TIME_PERIOD)
    {
        // TODO: TESTING PENDING
        const SubGredditID = report.Post.In
        const deletedreport = await Report.findByIdAndDelete(ID)
        console.log("deletedreport",deletedreport)
        const subgreddit = await SubGreddit.findById(SubGredditID)
        console.log("subgreddit",subgreddit)
        subgreddit.Reports = subgreddit.Reports.filter(element => element!=ID)
        const updatedsubgreddit = await SubGreddit.findByIdAndUpdate(SubGredditID, subgreddit, { new: true })
        console.log("updatedsubgreddit",updatedsubgreddit)
        return response.status(400).json({
            error: `Report has Expired the limit of ${config.TIME_PERIOD}`
        })
    }
    console.log(report)
    response.status(200).json(report)
})
// TODO: Update body required for email in Frontend
ReportRouter.put('/ignore/:id', async (request, response) => {
    console.log(request.body)
    const {
        ReportedByEmail, ReportedOnUsername
    } = request.body
    if (!ReportedByEmail) {
        return response.status(400).json({
            error: 'Email fields are empty in Ignore in Reports'
        })
    }
    const report = await Report.findById(request.params.id)
    report.Ignored = true
    const updatedreport = await Report.findByIdAndUpdate(report._id, report, { new: true })
    // const updatedreport = await report.save()
    let mailOptions = {
        from: "greddit172@gmail.com",
        to: ReportedByEmail,
        subject: "Your Report has been Ignored",
        text: `Welcome Gredditian!!!!
        Your Report on ${ReportedOnUsername} has been analyzed
        and your Report is ignored due to Community
        Guidelines`
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
    console.log(updatedreport)
    response.status(201).json(updatedreport)
})

ReportRouter.delete('/:id', async (request, response) => {
    const ID = request.params.id
    const DeleteReport = await Report.findByIdAndDelete(ID)
    response.json(DeleteReport)
})

module.exports = ReportRouter