const mysql = require('mysql2');

const bcrypt = require('bcrypt');

const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { Voter,Eligibility } = require('./models');

dotenv.config();




const pool = mysql.createPool({
 mysql.createConnection({host:"sonavotingapp-server.mysql.database.azure.com", user:"vgnqykuftr", password:"K4$viQkXVEHIQiZi", database:"online_voting_application", port:3306, ssl:{ca:fs.readFileSync("{ca-cert filename}")}});
}).promise()

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'keerthikumar.21it@sonatech.ac.in',
    pass: process.env.MAIL_PASS
  }
});

// async function get_admin(username) {
//   if (username) {
//     const user = await pool.query("select admin_id,pass_word from admin where admin_id=?", [username]);
//     return user[0];
//   }
//   else {
//     console.log("Error in getting value from function parameter");
//   }
// }



async function insert_voters(reg_no, pass, name, year, section, dept,email) {
  bcrypt.hash(pass, 12, async function (err, hash) {
    try{
      const newVoter = await Voter.create({
        reg_no: reg_no,
        pass_word: hash,
        name: name,
        year: year,
        section: section,
        dept: dept,
        email: email
      });
      console.log(newVoter);
    if (newVoter) {
      if (year == 1 || year == 2) {
        await Eligibility.create({
          id: null,         
          reg_no: reg_no,
          roles: "REP",
          status: 0
        });
      }
      else if (year == 3) {
        await Eligibility.bulkCreate([
          {
            id: null,
            reg_no: reg_no,
            roles: "REP",
            status: 0
          },
          {
            id: null, 
            reg_no: reg_no,
            roles: "SC",
            status: 0
          }
        ]);
      }
      else if (year == 4) {
        await Eligibility.bulkCreate([
          {
            id: null, 
            reg_no: reg_no,
            roles: "REP",
            status: 0
          },
          {
            id: null, 
            reg_no: reg_no,
            roles: "CHM",
            status: 0
          }
        ]);
      }
      console.log("inserted sucessfully")
      
    }
    
    
    else {
      console.log("inserted failed")
    }
  }
    catch(error){
      console.log(error);
    }
    
    //   try{
    //     console.log(email);
    //     const mailOptions = {
    //       from: `"Depatment of IT&ADS" `, 
    //       to: email, 
    //       subject: 'Your Voter Credentials', 
    //       text: `Hello,${name}
    
    // Here are your voter credentials:
    
    // Username: ${reg_no}
    // Password: ${pass}
    
    // Please keep these credentials secure.
    
    // Best regards,
    // Your Service Name`, 
    //       html: `<p>Hello,</p>
    //              <p>Here are your voter credentials:</p>
    //              <p>Username: <b>${reg_no}</b></p>
    //              <p>Password: <b>${pass}</b></p>
    //              <p>Please keep these credentials secure.</p>
    //              <p>Best regards,<br>Election committe</p>`
    //     };
    //     await transporter.sendMail(mailOptions);
  
    //   }
    //   catch(error){
    //     console.log(error);
    //     console.log("Email not sent");
    //   }
      

      
  });
}



// async function insert_admin(user_name, pass) {
//   bcrypt.hash(pass, 12, async function (err, hash) {
//     const r = await pool.query('insert into admin values(?,?)', [user_name, hash]);
//     if (r) {
//       console.log("inserted sucessfully")
//     }
//     else {
//       console.log("inserted failed")
//     }
//   });
// }



//insert_voters("61781921106056","123456","Keerthi",4,"B","IT","keerthikumar.21it@sonatech.ac.in");


module.exports = {
 
  // get_admin,

}


