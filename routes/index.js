var express = require('express');
var router = express.Router();
const createUser=require('./users')
const createTask=require('./tasks')
const excel=require('exceljs')
const mime =require('mime')
const validator=require('email-validator')

/* GET home page. */
router.get('/', function(req, res, next) {
  createUser.find()
  .then(function(data){
    res.render('index',{data})
  })
});

router.post('/createUser', function(req, res, next) {
  let regx =/^[6-9]\d{9}$/
  if(validator.validate(req.body.email)&& regx.test(req.body.mobile) ){

    createUser.create({
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
    })
   .then((data)=>{
     res.redirect('/')
   })
  }
  else{
    res.send("error")
  }
  
});

router.post('/addtask',function(req,res){
  // let arr=[]
  // req.body.user.forEach(element => {
  //   arr.push(element)
  // });
  // res.send(typeof(req.body.user))
  // console.log(typeof(req.body.user))
  createTask.create({
    taskname:req.body.taskname,
    tasktype:req.body.tasktype, 
  })
  .then(function(data){
    console.log(data)
    createTask.findOne({_id:data._id})
    .then(function(e){
      if(typeof(req.body.user)=='string'){
        e.userss.push(req.body.user)
        e.save()
        .then(function(da){
          res.send(da)
        })
      }
      else{
        req.body.user.forEach(element => {
          e.userss.push(element)
          e.save()
          .then(function(finale){
            res.send(finale)
          })
        });
      }
    })
  })
})

router.get('/dowwn',function(req,res){
  createUser.find()
  .then(function(data){
    createTask.find()
    .then(function(d){
      let tableArray=[]
      data.forEach((elem)=>{
        tableArray.push({
          name:elem.name,
          email:elem.email,
          mobile:elem.mobile
        })
      })

      let table2=[]
      d.forEach((elem)=>{
        elem.userss.forEach((e)=>{
          table2.push({
          taskname:elem.taskname,
          tasktype:elem.tasktype,
          assignTo:e
          })
        })
        
      })
      console.log(table2,tableArray)
      // **********
      let workbook=new excel.Workbook()
    let createUser=workbook.addWorksheet("createdUsers")
    let taskExcel=workbook.addWorksheet("Tasks")
    createUser.columns=[
      {header:"Name",key:"name",width:35},
      {header:"Email",key:"email",width:35},
      {header:"Mobile",key:"mobile",width:35},
    ]
    taskExcel.columns=[
      {header:"TaskName",key:"taskname",width:25},
      {header:"TaskType",key:"tasktype",width:25},
      {header:"AssignedTo",key:"assignTo",width:55},
    ]
    createUser.addRows(tableArray)
    taskExcel.addRows(table2)
    workbook.xlsx.writeFile('log.xlsx')
    .then(function(){
      const file='log.xlsx'
      console.log(file)
      const mimeType=mime.getType(file)
      console.log(mimeType)
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "log.xlsx"
        );
        res.setHeader(
          "Content-Type",
          mimeType
        );
        res.download(file)
    })
      // **********

    })
  })
})

module.exports = router;
