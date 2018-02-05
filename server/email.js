//email.js

// 引入 nodemailer
const nodemailer = require('nodemailer');

// 创建一个SMTP客户端配置
var config = {
        host: 'smtp.126.com',
        secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息） 
        port: 25,
        auth: {
            user: 'HarryZhangV@126.com', //刚才注册的邮箱账号
            pass: '1562055324zq'  //邮箱的授权码，不是注册时的密码
        }
    };

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);

// 发送邮件
module.exports = function (eamilTxt){
    transporter.sendMail(eamilTxt, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};