const commonFunction = require("../functions/commonFunctions")
const categoryModel = require("../models/categories")
const channelModel = require("../models/channels")
const blogModel = require("../models/blogs")
const videoModel = require("../models/videos")
const playlistModel = require("../models/playlists")
const userModel = require("../models/users")
exports.index = async (req, res) => {
    await commonFunction.getGeneralInfo(req, res, 'search')
    let type = req.params.type
    if (!type) {
        type = "video"
    }
    let response = {}
    let text = req.query.h ? req.query.h : ''
    let sort = req.query.filter ? req.query.filter : ''
    let filter = req.query.sort ? req.query.sort : ''
    let category = req.query.category ? req.query.category : ''
    req.query.showForm = false
    if(!text){
        req.query.showForm = true
        req.query.type = "video"
        if (req.query.data) {
            res.send({ data: req.query })
            return
        }
        req.app.render(req, res, '/search', req.query);
        return
    }
    let isValid = false
    let data = {}
    data.title = text
    req.query.title = text
    response = {
        pagging: false,
        results: []
    }

    if (type == "video") {
        await commonFunction.updateMetaData(req,{title:text+" in videos"})
        data.limit = 13;
        if (!filter) {
            filter = ""
        }
        await categoryModel.findAll(req, { type: "video" }).then(result => {
            if (result)
                req.query.categories = result
        }).catch(error => {
            
        })
        if(category){
            data.category_id = category
        }
        if(sort == "featured"){
            data.is_featured = 1
        }else if(sort == "sponsored"){
            data.is_sponsored = 1
        }else if(sort == "hot"){
            data.is_hot = 1
        }
        if (filter == "") {
            isValid = true
            data.orderby = "videos.creation_date DESC"
        }else if (filter == "view") {
            isValid = true
            data.orderby = "videos.view_count DESC"
        } else if (filter == "favourite" && req.appSettings["video_favourite"]) {
            isValid = true
            data.orderby = "videos.favourite_count DESC"
        } else if (filter == "like" && req.appSettings["video_like"]) {
            isValid = true
            data.orderby = "videos.like_count DESC"
        } else if (filter == "comment" && req.appSettings["video_comment"]) {
            isValid = true
            data.orderby = "videos.comment_count DESC"
        } else if (filter == "dislike" && req.appSettings["video_dislike"]) {
            isValid = true
            data.orderby = "videos.dislike_count DESC"
        } else if (filter == "rated" && req.appSettings["video_rating"]) {
            isValid = true
            data.orderby = "videos.rating DESC"
        }
        if (isValid) {
            await videoModel.getVideos(req, data).then(result => {
                pagging = false
                if (result.length > data.limit - 1) {
                    result = result.splice(0, data.limit - 1);
                    pagging = true
                }
                response = {
                    pagging: pagging,
                    results: result
                }
            })
        }
    } else if (type == "blog") {
        await commonFunction.updateMetaData(req,{title:text+" in blogs"})
        if (!filter) {
            filter = ""
        }
        await categoryModel.findAll(req, { type: "blog" }).then(result => {
            if (result)
                req.query.categories = result
        }).catch(error => {
            
        })
        if(category){
            data.category_id = category
        }
        if(sort == "featured"){
            data.is_featured = 1
        }else if(sort == "sponsored"){
            data.is_sponsored = 1
        }else if(sort == "hot"){
            data.is_hot = 1
        }
        if (filter == "") {
            isValid = true
            data.orderby = "blogs.creation_date DESC"
        }else if (filter == "view") {
            isValid = true
            data.orderby = "blogs.view_count DESC"
        } else if (filter == "favourite" && req.appSettings["blog_favourite"]) {
            isValid = true
            data.orderby = "blogs.favourite_count DESC"
        } else if (filter == "comment" && req.appSettings["blog_comment"]) {
            isValid = true
            data.orderby = "blogs.comment_count DESC"
        } else if (filter == "like" && req.appSettings["blog_like"]) {
            isValid = true
            data.orderby = "blogs.like_count DESC"
        } else if (filter == "dislike" && req.appSettings["blog_dislike"]) {
            isValid = true
            data.orderby = "blogs.dislike_count DESC"
        } else if (filter == "rated" && req.appSettings["blog_rating"]) {
            isValid = true
            data.orderby = "blogs.rating DESC"
        }
        if (isValid) {
            data.limit = 13;
            await blogModel.getBlogs(req, data).then(result => {
                pagging = false
                if (result.length > data.limit - 1) {
                    result = result.splice(0, data.limit - 1);
                    pagging = true
                }
                response = {
                    pagging: pagging,
                    results: result
                }
            })
        }
    } else if (type == "playlist") {
        await commonFunction.updateMetaData(req,{title:text+" in playlists"})

        if (!filter) {
            filter = ""
        }
        if(sort == "featured"){
            data.is_featured = 1
        }else if(sort == "sponsored"){
            data.is_sponsored = 1
        }else if(sort == "hot"){
            data.is_hot = 1
        }
        if (filter == "") {
            isValid = true
            data.orderby = "playlists.creation_date DESC"
        }else if (filter == "view") {
            isValid = true
            data.orderby = "playlists.view_count DESC"
        } else if (filter == "favourite" && req.appSettings["playlist_favourite"]) {
            isValid = true
            data.orderby = "playlists.favourite_count DESC"
        } else if (filter == "like" && req.appSettings["playlist_like"]) {
            isValid = true
            data.orderby = "playlists.like_count DESC"
        } else if (filter == "comment" && req.appSettings["playlist_comment"]) {
            isValid = true
            data.orderby = "playlists.comment_count DESC"
        } else if (filter == "dislike" && req.appSettings["playlist_dislike"]) {
            isValid = true
            data.orderby = "playlists.dislike_count DESC"
        } else if (filter == "rated" && req.appSettings["playlist_rating"]) {
            isValid = true
            data.orderby = "playlists.rating DESC"
        }
        if (isValid) {
            data.limit = 17;
            await playlistModel.getPlaylists(req, data).then(result => {
                pagging = false
                if (result.length > data.limit - 1) {
                    result = result.splice(0, data.limit - 1);
                    pagging = true
                }
                response = {
                    pagging: pagging,
                    results: result
                }
            })
        }
    } else if (type == "member") {
        await commonFunction.updateMetaData(req,{title:text+" in members"})

        if (!filter) {
            filter = ""
        }
        if(sort == "featured"){
            data.is_featured = 1
        }else if(sort == "sponsored"){
            data.is_sponsored = 1
        }else if(sort == "hot"){
            data.is_hot = 1
        }else if(sort == "verified"){
            data.verified = 1
        }
        if (filter == "") {
            isValid = true
            data.orderby = "users.creation_date DESC"
        }else if (filter == "view") {
            isValid = true
            data.orderby = "userdetails.view_count DESC"
        }  else if (filter == "favourite" && req.appSettings["member_favourite"]) {
            isValid = true
            data.orderby = "userdetails.favourite_count DESC"
        } else if (filter == "like" && req.appSettings["member_like"]) {
            isValid = true
            data.orderby = "userdetails.like_count DESC"
        } else if (filter == "comment" && req.appSettings["member_comment"]) {
            isValid = true
            data.orderby = "userdetails.comment_count DESC"
        } else if (filter == "dislike" && req.appSettings["member_dislike"]) {
            isValid = true
            data.orderby = "userdetails.dislike_count DESC"
        } else if (filter == "rated" && req.appSettings["member_rating"]) {
            isValid = true
            data.orderby = "userdetails.rating DESC"
        }
        if (isValid) {
            data.limit = 13;
            if (req.user) {
                data.not_user_id = req.user.user_id
            }
            await userModel.getMembers(req, data).then(result => {
                pagging = false
                if (result.length > data.limit - 1) {
                    result = result.splice(0, data.limit - 1);
                    pagging = true
                }
                response = {
                    pagging: pagging,
                    results: result
                }
            })
        }
    } else if (type == "channel") {
        await commonFunction.updateMetaData(req,{title:text+" in channels"})

        if (!filter) {
            filter = ""
        }
        await categoryModel.findAll(req, { type: "channel" }).then(result => {
            if (result)
                req.query.categories = result
        }).catch(error => {
            
        })
        if(category){
            data.category_id = category
        }
        if(sort == "featured"){
            data.is_featured = 1
        }else if(sort == "sponsored"){
            data.is_sponsored = 1
        }else if(sort == "hot"){
            data.is_hot = 1
        }else if(sort == "verified"){
            data.verified = 1
        }
        if (filter == "") {
            isValid = true
            data.orderby = "channels.creation_date DESC"
        }else if (filter == "view") {
            isValid = true
            data.orderby = "channels.view_count DESC"
        }  else if (filter == "favourite" && req.appSettings["channel_favourite"]) {
            isValid = true
            data.orderby = "channels.favourite_count DESC"
        } else if (filter == "like" && req.appSettings["channel_like"]) {
            isValid = true
            data.orderby = "channels.like_count DESC"
        } else if (filter == "comment" && req.appSettings["channel_comment"]) {
            isValid = true
            data.orderby = "channels.comment_count DESC"
        } else if (filter == "dislike" && req.appSettings["channel_dislike"]) {
            isValid = true
            data.orderby = "channels.dislike_count DESC"
        } else if (filter == "rated" && req.appSettings["channel_rating"]) {
            isValid = true
            data.orderby = "channels.rating DESC"
        }
        if (isValid) {
            data.limit = 13;
            await channelModel.getChannels(req, data).then(result => {
                pagging = false
                if (result.length > data.limit - 1) {
                    result = result.splice(0, data.limit - 1);
                    pagging = true
                }
                response = {
                    pagging: pagging,
                    results: result
                }
            })
        }
    }
    if (!isValid) {
        if (req.query.data) {
            res.send({data: req.query,pagenotfound:1});
            return
        }
        req.app.render(req, res, '/page-not-found', req.query);
        return
    }
    req.query.category  = category
    req.query.type = type
    req.query.sort = filter
    req.query.filter = sort
    req.query.items = response
    if (req.query.data) {
        res.send({ data: req.query })
        return
    }
    req.app.render(req, res, '/search', req.query);
}