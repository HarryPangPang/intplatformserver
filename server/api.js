// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
// 引入文件模块
const fs = require('fs');
// const email = require('./email')

/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/

// 创建账号接口
router.post('/api/login/createAccount',(req,res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    let newAccount = new models.Login({
        username : req.body.username,
        useremail: req.body.useremail,
        password : req.body.password
    });

    let existUserName = {
        username :req.body.username,
    }
    let existUserEmail = {
        useremail :req.body.useremail,
    }

    let ifexistUserName = models.Login.find(existUserName).exec()
    let ifexistUserEmail = models.Login.find(existUserEmail).exec()

    Promise.all([ifexistUserName,ifexistUserEmail]).then((results) => {
        if(results[0].length === 0 && results[1].length === 0){
            newAccount.save((err,data) => {
                if(err){
                    res.send(err)
                }else{
                    res.send('0');
                }
            })
        }else{
            res.send('1')
        }
    })
    

});
// 获取已有账号接口
router.post('/api/login/getAccount',(req,res) => {
    // 通过模型去查找数据库
    let existUser = {
        useremail :req.body.useremail,
        password :req.body.password
    }
    models.Login.find(existUser,(err,data) => {
        if (err) {
            res.send(err);
        } else{
            if(data.length == 0){
                res.send('1');
            }
            else{
                res.send(data);
            }
        }
    });
});
router.post('/api/login/getAccountbyemail',(req,res) => {
    // 通过模型去查找数据库
    let existUser = {
        useremail :req.body.useremail,
    }
    models.Login.find(existUser,(err,data) => {
        if (err) {
            res.send(err);
        } else{
            res.send(data)
        }
    });
});

//更新账户
router.post('/api/login/updateAccount',(req,res) => {

    models.Login.update({useremail:req.body.useremail},
    {
        username : req.body.username,
        password: req.body.newpassword
    },(err) =>{
        res.send(err)
    }
    )
});
// 创建消息
router.post('/api/commet/createcommet',(req,res) => {

    let imgcollections = JSON.parse(req.body.imgcollections);
    let userimglists = [];
    imgcollections.forEach((value,i) => {
        let base64Data = imgcollections[i].newimglistsrc.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        let randomcode = Math.random().toString(36).substr(2);
        userimglists.push(`${imgcollections[i].newimglistlastModified}${randomcode}.png`)
        fs.writeFile(`../dist/static/imgdb/${imgcollections[i].newimglistlastModified}${randomcode}.png`, dataBuffer, function(err) {
            if(err){
              console.log(err);
            }else{
                console.log("保存成功！");
            }
        });  
    });
 
    let newUserCommet = new models.Usercontent({
        username : req.body.username,
        useremail: req.body.useremail,
        userimglist : JSON.stringify(userimglists),
        content: req.body.content,
        editdate: req.body.editdate,
    });

    newUserCommet.save((err,data) => {
        if(err){
            res.send('1')
        }
        else{
            res.send('0')
        }
    });
});

// 获取消息
router.post('/api/commet/getcommet',(req,res) => {
    models.Usercontent.find((err,data) => {
        if (err) {
            res.send(err);
        } else{
             res.send(data);
        }
    });
});


// 创建头像
router.post('/api/headinfo/createheadinfo',(req,res) => {
    let headimage = JSON.parse(req.body.headimage);
    let headimagelastModified = req.body.headimagelastModified
    let base64Data = headimage.src.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    console.log(typeof(headimagelastModified))
    let randomcode = Math.random().toString(36).substr(2);
    fs.writeFile(`../dist/static/imgdb/${headimagelastModified}${randomcode}.png`, dataBuffer, function(err) {
        if(err){
            console.log(err);
        }else{
            console.log("保存成功！");
        }
    });  

    let newUserinfo = new models.Userhead({
        username : req.body.username,
        useremail: req.body.useremail,
        headimageUrl:`../dist/static/imgdb/${headimagelastModified}${randomcode}.png`,
        headimg : JSON.stringify(headimage)
    });

    newUserinfo.save((err,data) => {
        if(err){
            res.send('1')
        }
        else{
            res.send(data)
        }
    });
});
// 获取头像
router.post('/api/headinfo/getheadinfo',(req,res) => {
    models.Userhead.find({ useremail: req.body.useremail},(err,data) => {
        if (err) {
            res.send(err);
        } else{
            res.send(data)
        }
    });   
});
// 更新头像
router.post('/api/headinfo/updateheadinfo',(req,res) => {

    let headimage = JSON.parse(req.body.headimage);
    let headimagelastModified = req.body.headimagelastModified
    let base64Data = headimage.src.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    console.log(typeof(headimagelastModified))
    let randomcode = Math.random().toString(36).substr(2);
    fs.writeFile(`../dist/static/imgdb/${headimagelastModified}${randomcode}.png`, dataBuffer, function(err) {
        if(err){
            console.log(err);
        }else{
            console.log("保存成功！");
        }
    });  
    models.Userhead.update({useremail:req.body.useremail},
    {
        username : req.body.username,
        useremail: req.body.useremail,
        headimageUrl:`../dist/static/imgdb/${headimagelastModified}${randomcode}.png`,
        headimg : JSON.stringify(headimage)
    },(err) =>{}
    )
});
















// 邮箱注册
// router.get('/api/login/sendsms',(req,res) => {
//     let eamilTxt = {
//      // 发件人
//      from: 'HarryZhangV@126.com',
//      // 主题
//      subject: '测试',
//      // 收件人
//      to: '1562055324@qq.com',
//      // 邮件内容，HTML格式
//      text: '<p>验证码：1212</p>' //接收激活请求的链接       
//     }

//     email(eamilTxt)
// });

module.exports = router;