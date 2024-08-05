const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'lpdwjfghsojeds', resave: true, rolling: true, saveUninitialized: true, cookie: {
        maxAge: 7 * 24 * 3600 * 1000,
    }
}))
const { get_admin} = require("./database.js");
const upload = multer({ storage: multer.memoryStorage() });

const { sequelize, Rep, Sc, Chm, Eligibility,Voter } = require('./models');




app.get('/voting_page', async (req, res) => {
    try {
        if (!req.session.user.username) {
            return res.redirect('/');
        }
    }
    catch (e) {
        return res.redirect('/');
    }

    const voter_regno = req.session.user.username;


    const is_voted = await Eligibility.findOne({
        attributes: ['roles'],
        where: {
            is_voted: 0,
            reg_no: voter_regno
        }
    });


    if (!is_voted) {
        return res.render('success', { message: "Your vote is saved successfully or \nYou've already voted!!" });
    }
    console.log(req.session.user.username);

    console.log(req.session.user.year);
    console.log(req.session.user.section);
    var cd = 0;
    var role="";
    if (is_voted) {
        if (is_voted.roles == "REP") {
            cd = await Rep.findAll({
                attributes: ['reg_no', 'name'],
                where: {
                    year: req.session.user.year,
                    sec: req.session.user.section,
                    dept:req.session.user.dept
                }
            });
            role="Representative"
        }
        else if (is_voted.roles == "CHM") {
            cd = await Chm.findAll({
                attributes: ['reg_no', 'name'],
                where: {
                    year: req.session.user.year,
                    

                }
                
            });
            role="Chairman"
        }
        else if (is_voted.roles == "SC") {
            cd = await Sc.findAll({
                attributes: ['reg_no', 'name'],
                where: {
                    year: req.session.user.year,

                }
            });
            role="Secreratry"
        }
        cd = cd.map(cd => cd.toJSON())
        console.log(cd);
    }


    return res.render('voter', { cd: cd,role });
})

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/admin", async (req, res) => {
    res.render("admin");
});

app.get("/admin_dashboard", async (req, res) => {
    try {
        console.log(req.session.user.username && req.session.user.role == "admin")
        if (req.session.user.username && req.session.user.role == "admin") {
            return res.render('admin_dashboard');
        }
        else {
            return res.redirect('/admin');
        }
    }
    catch (error) {
        return res.redirect('/admin');
    }
});

app.post("/add_candidates", upload.single('profile'), async (req, res) => {
    const { reg_no, name, year, sec, dept, role } = req.body;
    //const profile = req.file.buffer.toString('base64');
    const payload = {
        reg_no: reg_no,
        name: name,
        year: year,
        sec: sec,
        dept: dept,
        role: role,
        votes: 0,
        //profile: profile
    }
    var r;
    if (role == "REP") {
        r = await Rep.create(payload);
    }
    else if (role == "SC") {
        r = await Sc.create(payload);
    }
    else if (role == "CHM") {
        r = await Chm.create(payload);
    }


    if (r) {
        return res.redirect("/add_candidates");
    }
    else {
        console.log("Not inserted");
    }
})

app.get("/add_candidates", async (req, res) => {
    try {
        
        if (req.session.user.username && req.session.user.role == "admin") {
            var candi = await Rep.findAll();
            const candiJson = candi.map(record => record.toJSON());
            
            return res.render("add_candidates", { candidate: candiJson });
        }
        else {
            return res.redirect('/admin');
        }
    }
    catch (error) {
        return res.redirect('/admin');
    }
})

app.get("/admin_result", async (req, res) => {
    try {
        console.log(req.session.user.username && req.session.user.role == "admin")
        if (req.session.user.username && req.session.user.role == "admin") {
            var candi = await Sc.findAll({
                attributes: ['name', 'votes','year','sec']
              });
              candi = candi.map(cd => cd.toJSON());
              var rep = await Rep.findAll({
                attributes: ['name', 'votes','year','sec'],
                
              });
              rep = rep.map(cd => cd.toJSON());
              
              rep = rep.filter(item => item.year == 4 && item.sec =="B");
             
              var chm = await Chm.findAll({
                attributes: ['name', 'votes']
              });
              chm = chm.map(cd => cd.toJSON())
            return res.render('result_admin', { scs: candi ,rep4b:rep,chms:chm});
        }
        else {
            return res.redirect('/admin');
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect('/admin');
    }


});

app.post("/login_voter", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    var voter=await Voter.findAll({
        attributes: ['reg_no', 'pass_word', 'year', 'section', 'dept'],
        where: {
          reg_no: username
        }
    });
    voter = voter.map(vt => vt.toJSON());
    if (voter.length==1) {

        const valid = await bcrypt.compare(password, voter[0].pass_word);

        console.log(valid)
        if (valid) {
            req.session.user = { username: username, year: voter[0].year, section: voter[0].section, role: "voter" ,dept:voter[0].dept};


            res.redirect('/voting_page');
            console.log("user found")

        }
        else {
            res.redirect('/');
            console.log("incorrect");
        }

    }
    else {
        res.redirect('/');
        console.log("user not found")
    }

});


app.post("/login_admin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const user = await get_admin(username);
    console.log(user.length)
    if (user.length == 1) {

        const valid = await bcrypt.compare(password, user[0][1]);

        console.log(valid)
        if (valid) {
            req.session.user = { username: username, role: "admin" };
            console.log("user found");
            res.redirect('/admin_dashboard');

        }
        else {
            res.redirect('/admin')
            console.log("incorrect");
        }

    }
    else {
        console.log("user not found");
        res.redirect('/admin');
    }

});

app.post("/insert_vote", async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    if (!req.session.user.username) {
        return res.redirect('/');
    }
    const cd_regno = req.body.data;
    const voter_regno = req.session.user.username;
    const is_voted = await Eligibility.findOne({
        attributes: ['roles'],
        where: {
            is_voted: 0,
            reg_no: voter_regno
        }
    });


    if (is_voted) {
        if (is_voted.roles == "REP") {
            const rep1 = await Rep.findOne({
                attributes: ['votes'],
                where: {
                    reg_no: cd_regno,
                    year: req.session.user.year,
                    sec: req.session.user.section
                }
            });

            const currentVotes = rep1.votes;


            await Rep.update(
                { votes: currentVotes + 1 },
                { where: { reg_no:  cd_regno,year: req.session.user.year,
                    sec: req.session.user.section} }
            );
            const [affectedRows] = await Eligibility.update(
                { is_voted: 1 },
                {
                    where: {
                        reg_no: voter_regno,
                        roles: is_voted.roles
                    }
                }
            );
            if (affectedRows == 1) {
                return res.redirect("/voting_page");
            }
            else {
                res.render('success', { message: "Failed to vote" });
               
            }


        }
        else if(is_voted.roles=="SC"){
            const rep1 = await Sc.findOne({
                attributes: ['votes'],
                where: {
                    reg_no: cd_regno,
                    year: req.session.user.year,

                }
            });

            const currentVotes = rep1.votes;


            await Sc.update(
                { votes: currentVotes + 1 },
                { where: { reg_no: cd_regno } }
            );
            const [affectedRows] = await Eligibility.update(
                { is_voted: 1 },
                {
                    where: {
                        reg_no: voter_regno,
                        roles: is_voted.roles
                    }
                }
            );
            if (affectedRows == 1) {
                return res.redirect("/voting_page");
            }
            else {
                res.render('success', { message: "Failed to vote" });
                
            }

        }
        else if(is_voted.roles=="CHM"){
            const rep1 = await Chm.findOne({
                attributes: ['votes'],
                where: {
                    reg_no: cd_regno,
                    year: req.session.user.year,
                }
            });

            const currentVotes = rep1.votes;


            await Chm.update(
                { votes: currentVotes + 1 },
                { where: { reg_no: cd_regno } }
            );
            const [affectedRows] = await Eligibility.update(
                { is_voted: 1 },
                {
                    where: {
                        reg_no: voter_regno,
                        roles: is_voted.roles
                    }
                }
            );
            if (affectedRows == 1) {
                return res.redirect("/voting_page");
            }
            else {
                res.render('success', { message: "Failed to vote" });
                
            }

        }
       
    }
    else {
        res.render('success', { message: "Vote saved successfully..." });
        
    }
});

app.get("/sub_detials",async (req,res)=>{
    const reg_no=req.body.reg_no;
    
    const response=await Voter.findOne({
        attributes: ['name','year','section','dept'],
        where: {
            reg_no: reg_no
        }
    });
    
    return res.json({name:response.name})

})


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Connection has been established successfully.');
        app.listen(8000,process.env.IP_ADDRESS);

    })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

