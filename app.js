// // import swal from 'sweetalert';
// import alert from 'alert-node';

//var createError = require('http-errors');

var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
// var popup = require('popups');
var app = express();
var session =require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'afcaknwjhnjyghcaka',
  resave: true,
  saveUninitialized: true
  // cookie: { secure: true } 
}));
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//__________________________________________________________________________
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
  //next(createError(404));
//});

// error handler
//app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
 // res.render('error');
//});
//______________________________________________________________________________
const fs = require('fs');

app.post('/continue',function(req,res){
  res.render('login',{error1 : ""})
});


app.post('/register', function(req,res){
  let user = 
{
  username: req.body.username,
  password: req.body.password,
  wl:[]
}
  addTask(user,res)
})

app.post('/show', function(req,res){
  let task1 = loadTasks();
  var temp =[];
  for(var x in task1){
    if(task1[x].username==req.session.user){
      temp=task1[x].wl;
    }
  }
  if(temp.length==0){
    res.render("watcherror");
  }
  else{
    res.render("watchlist",{movieArray:temp});
  }
  
});

app.post('/watch', function(req,res){
  var d = req.body.d;
  let task1 = loadTasks();
  // if(d== task1[1].wl[0]){
  //   console.log(1);
  // }
  var watch_Array =[];
  var idx=0;

  for(var i=0;i<task1.length;i++){
    if(task1[i].username == req.session.user){
      watch_Array=task1[i].wl;
      idx=i;
      break;
    }
  }
  var f=true;
  for(var x in watch_Array){
    if(watch_Array[x] == d){
      f=false;
    }
  }
  if(f){
  task1[idx].wl.push(d);
  fs.writeFileSync('tasks.json', JSON.stringify(task1))
  }

  else{
    res.render(d ,{error1: "you have add it before"});
    // alert("hello");
  }

})



let addTask = function(task,res){
  //load tasks array
  let tasks = loadTasks()
  //push new task in array
  let flag =true ;
  for(var x in tasks){
    if(tasks[x].username == task.username){
      flag=false;
      break;
    }
  }
  if(flag){
    tasks.push(task);
    res.render('reg_complete');
  }
  else{
    // user is already exist 
    res.render('registration',{name: "user is already exist"})
    // res.send('user is already exist ');
  }
  // //save array back in file
  fs.writeFileSync('tasks.json', JSON.stringify(tasks))
};

app.post('/search', function(req,res){
    var str=req.body.Search.toLowerCase();
    let movies = loadMovies();
   
    var temp =[];
    for(var x in movies){
      if(movies[x].includes(str)){
        temp.push(movies[x]);
      }
    }
    if(temp.length==0){
      res.render("searcherror");
    }
    else{
      res.render("searchresults",{movieArray:temp});
    }
});

let loadMovies = function(){
  try {
      let bufferedData = fs.readFileSync('movie.json')
      let dataString = bufferedData.toString()
      let tasksArray = JSON.parse(dataString)
      return tasksArray
  } catch (error) {
      return []
  }
}

let loadTasks = function(){
  try {
      let bufferedData = fs.readFileSync('tasks.json')
      let dataString = bufferedData.toString()
      let tasksArray = JSON.parse(dataString)
      return tasksArray
  } catch (error) {
      return []
  }
 
};

app.get('/action',function(req,res){
  res.render('action')
});

app.get('/registration',function(req,res){
  res.render('registration',{name:""})
});

app.get('/drama',function(req,res){
  res.render('drama')
});

app.get('/godfather',function(req,res){
  res.render('godfather',{error1:""})
});

app.get('/godfather2',function(req,res){
  res.render('godfather2',{error1:""})
});

app.get('/scream',function(req,res){
  res.render('scream',{error1:""})
});

app.get('/conjuring',function(req,res){
  res.render('conjuring',{error1:""})
});

app.get('/horror',function(req,res){
  res.render('horror')
});

app.get('/watchlist',function(req,res){
  res.render('watchlist',{movieArray:[]});
});


app.get('/darkknight',function(req,res){
  res.render('darkknight',{error1:""})
});
app.get('/fightclub',function(req,res){
  res.render('fightclub',{error1:""});
});
app.listen(3500);


app.post('/login', function(req,res){
  let user = 
{
  username: req.body.username,
  password: req.body.password
}
  checkuser(user,res,req)
})
let checkuser = function(user,res,req){
  //load tasks array
  let tasks = loadTasks()

  let flag =false ;
  for(var x in tasks){
    if(tasks[x].username == user.username && tasks[x].password == user.password){
      flag=true;
      break;
    }
  }
  if(flag){
    
    req.session.user=user.username;
    // console.log(req.session.user);
    res.render('home');
  }
  else{
    // user is already exist 
    // console.log("hello")
    res.render('login',{error1 : "the user or the password is wrong"})
  }
  // /+/save array back in file
  fs.writeFileSync('tasks.json', JSON.stringify(tasks))
}

app.get('/',function(req,res){
  let datasession =req.session;
  datasession.user={};
  res.render('login',{error1 : "",user : req.session.username})
})

// var watchlist = document.getElementById("watchlist");

// watchlist.onclick= function(res,req){
//   res.render("watchlist");
// }


// app.get('/home',function(req,res){
//   console.log(req.session.username);
//   if(!req.session.username){
//     res.render('home')
//   }
//   else {
//     res.render('login',{error1 : "the user or the password is wrong"})
//   }

// })
//_____________________________________________________
module.exports = app;
