var express = require('express');
var router = express.Router();
let db = require('../db');
let multer = require('multer');
let upload = multer({
     storage: multer.diskStorage({
            destination:(req,file,done)=>{
                done(null, './public/photos')
            },
            filename:(req,file,done)=>{
                done(null, Date.now() + '_' + file.originalname);
            }
        })
});

//이미지 파일 업로드


/* 사용자 목록 */
router.get('/', function(req, res, next) {
    let sql = 'select *, date_format(join_date, "%Y-%m-%d %T") fmt_date from users order by join_date desc';
    db.get().query(sql,function(err,rows){
        res.send(rows);
    })
});

//사용자 정보 수정
router.post('/update',upload.single('file'),function(req,res){
    console.log('update..................')
    let uid=req.body.uid;
    let upass=req.body.upass;
    let uname=req.body.uname;
    let address=req.body.address;
    let phone=req.body.phone;
    let photo=req.body.photo;
    if(req.file !=null) {
       photo='/photos/'+req.file.filename;
    }
    let sql='update users set uname=?,upass=?,address=?,phone=?,photo=? where uid=?';
    db.get().query(sql,[uname,upass,address,phone,photo,uid],function(err,rows){
        console.log('error...........', err);
        res.sendStatus(200);
    })
})

//사용자 등록
router.post('/insert',upload.single('file'),function(req,res){
    let uid=req.body.uid;
    let upass=req.body.upass;
    let uname=req.body.uname;
    let address=req.body.address;
    let phone=req.body.phone;
    if(req.file !=null) {
       photo='/photos/'+req.file.filename;
    }
    let sql='insert into users(uid,upass,uname,address,phone,photo) values(?,?,?,?,?,?)';
    db.get().query(sql,[uid,upass,uname,address,phone,photo],function(err,rows){
        console.log('error...........', err);
        res.sendStatus(200);
    })
})

//특정 아이디에 대한 사용자 정보
router.get('/:uid', function(req,res){
    let uid=req.params.uid;
    let sql='select *, date_format(join_date, "%Y-%m-%d %T") fmt_date  from users where uid=?';
    db.get().query(sql,[uid],function(err,rows){
        res.send(rows[0]);
    });
});

//로그인
router.post('/login',function(req,res) {
    let uid=req.body.uid;
    let upass=req.body.upass;
    let sql = 'select * from users where uid=?';
    db.get().query(sql,[uid],function(err,rows){
        let result = 0;
        console.log('.........',uid, upass, rows[0])
        if(rows[0]){
            if(rows[0].upass==upass){
                result=1;
            }else {
                result=2;
            }
        }
        res.send({result:result});
    })
})

module.exports = router;
