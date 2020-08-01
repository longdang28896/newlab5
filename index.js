var express = require("express");
var multer = require("multer");
var bodyPaser = require("body-parser");
var path = require("path");

var app = express();

app.use(bodyPaser.urlencoded({
    extended:false
}));
var stogageConfig = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'./uploads');

    },
     filename(req, file, callback) {
        var d = new Date();
        var n = d.getTime();
        callback(null,n+file.originalname);
     }
});

var upload = multer({
    storage:stogageConfig,fileFilter(req, file, callback) {
        let anh = path.extname(file.originalname);
        if (!anh.endsWith(".jpg")){
            return callback("Vui lòng chỉ up file jpg");
        }
        callback(null,anh);

    },limits:{fileSize: 1*1024*1024}
});
var expresshbs = require("express-handlebars");
app.engine(".hbs",expresshbs({
    extname:"hbs",
    defaultLayout: false,
    layoutsDir: "views"
}));

app.set("view engine",".hbs");
app.listen(1999);
app.get("/",function (req,res) {
    res.render("upload");
});
var uploadI = upload.array("avatar",3);
app.post('/upload', (req, res) => {
    uploadI(req,res,function (err){
        if (err instanceof multer.MulterError){
            if (err.code == "LIMIT_UNEXPECTED_FILE"){
                return res.send("Tối đa 3 file");
            }else
                return res.send("Dung lương không quá 1MB");
        }
        var email = req.body.email;
        var password = req.body.password;
        var sdt = req.body.sdt;
        var name = req.body.name;
        res.send("Đăng ký thành công: " + "\n Email của bạn là: " + email + "\n Mật khẩu:  " + password+ "\n Tên: " +name + "\n Số điện thoại :" +sdt );

    })

});