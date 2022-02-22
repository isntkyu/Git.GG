var express = require('express')
var app = express()
var fs = require('fs');
var querystring = require('querystring');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  port     : '3308',
  database : 'o2'
});

//fetch 사용하기 위함
const fetch = require("node-fetch");
// 정적파일 등록

app.use(express.static('public'))
app.listen(3000, function () {
    console.log('connected nodejs')
});
//view엔진을 퍼그로 사용
app.set('view engine', 'pug')
app.set('views','./views')

// URL 라우팅
app.get('/', function (req, res) {
        res.sendFile(__dirname + "/public/index.html")
})

// 바디파서
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
 

//database 출력 rank

app.get('/rank', function (req, res) {

    var sql = 'SELECT @rownum := @rownum+1 AS RNUM,user,url,totalstar FROM ranking,(SELECT @rownum :=0) AS R order by totalstar desc'
connection.query(sql,function(err,topics,fields){

     res.render('rank.pug', { topics:topics});

}
)
})

app.get('/rankf', function (req, res) {

    var sql = 'SELECT @rownum := @rownum+1 AS RNUM,user,url,followers FROM ranking,(SELECT @rownum :=0) AS R order by followers desc'
connection.query(sql,function(err,topics2,fields){

     res.render('rankf.pug', { topics2:topics2});

}
)
})

app.get('/rankr', function (req, res) {

    var sql = 'SELECT user, round(avg(star),2) as cr, round(avg(star2),2) as hr from realreview group by user order by cr desc, hr desc';
connection.query(sql,function(err,top,fields){

     res.render('rankr.pug', { top:top});

}
)
})

app.get('/rankr2', function (req, res) {

    var sql = 'SELECT user, round(avg(star2),2) as hr from realreview group by user order by hr desc';
connection.query(sql,function(err,top2,fields){

     res.render('rankr2.pug', { top2:top2});

}
)
})

app.post('/starreview', function (req, res) {
    var name = req.body.nick;
    var sql = 'SELECT user,coment,star as ss,star2 as ss2 FROM realreview where user=? ';
    connection.query(sql,[name],function(err,topics3,fields){

     res.render('review.pug', { topics3:topics3});

}
)



})


app.post('/review', function(req, res){
    if(req.method == 'GET'){
        console.log('review GET');
    }
    else if(req.method == 'POST'){
        console.log('review POST');
        var nick = req.body.nick;
        console.log('search.pug에서' + nick)

        var user = req.body.nick;      
        var star = req.body.star;
        var star2 = req.body.star2;
        var coment = req.body.coment;
        
        var sql='INSERT INTO realreview (user,coment,star,star2) VALUES (?,?,?,?)';
        var params = [user,coment,star,star2];
        connection.query(sql,params,function(err,result,fields){
            if(err){
                console.log("등록중 에러가 발생했어요!!", err);
            } 
            else{
                console.log("result : ",result);
                

            }
        });
        
        
    }


});


//검색하면 database에 저장 & 사용자 정보 출력   

// app.post('/search_post', function(req,res){
//     var name2 = req.body.name2;

//     var sql = 'SELECT user,avg(star) as ss, avg(star2) as ss2 FROM realreview where user = ? group by user';
//     connection.query(sql,[name2],function(err,rows,fields){
    
//          res.render('search.pug', { rows:rows});
    
//     }
//     )
// })

app.post('/search_post', function (req, res) {  
    
    if(req.method == 'GET'){
        console.log('GET');
    }
    else if(req.method == 'POST'){

        console.log('POST');
        var name2 = req.body.name2;
        console.log('app.js에서' + name2)
        
//클래스선언        
        class GitHub {
            async getUser(user){
                const profileResponse = await fetch(`https://api.github.com/users/${user}`);
                const profilestar = await fetch(`https://api.github.com/users/${user}/repos`);
        
                const profile = await profileResponse.json();
                const star = await profilestar.json();
        
                // star.sort(function(a,b) {
        
                // 	return parseFloat(b.stargazers_count) - parseFloat(a.stargazers_count);
                
                // });
                
                return {
                    profile, star
                }
            }
        }

//객체생성
        const github = new GitHub();
        
        github.getUser(name2)
        
        .then(data => {

            var totalstar = 0;
            for(var i = 0; i<data.star.length;i++){
              totalstar+=data.star[i].stargazers_count;
            }
     
        var a= data.profile.login;
        var b= data.profile.html_url;
        var c= data.profile.followers;
        var d= totalstar;
        

    
var sql='INSERT INTO ranking (user,url,followers,totalstar) VALUES (?,?,?,?) on duplicate key update url=?,followers=?,totalstar=?';
var params = [a,b,c,d,b,c,d];
var topicc = [];
var sql2 = 'select user,round(avg(star),2) as ss, round(avg(star2),2) as ss2 from realreview where user=? group by user';

connection.query(sql,params,function(err,rows,fields){
if(err){
    console.log(err);
} else{
console.log(rows);

console.log(req.body.search)

connection.query(sql2,[name2],function(err,topicc,fields){
    if(err){
        console.log(err);
    } else{
    topicc.push(topicc);
   res.render('search.pug', { 'search': req.body.search, 'name' : name2, topicc:topicc})
   console.log(topicc)
    }

})


}



});

        })


    }
})

