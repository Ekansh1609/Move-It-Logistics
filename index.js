import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";

const app=express();
const port=3000;
const saltRounds=5;

app.use(
    session({
        secret:"EKANSH",
        resave: false,
        saveUninitialized:true,
        
    })
);

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "PackerAndMover",
    password: "1234",
    port: 5432,
  });
  db.connect();
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
app.get("/", (req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("registration.ejs")
});
app.get("/login",(req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("login.ejs");
});
app.get("/forgot",(req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("forgot.ejs");
});

app.get("/index",(req,res)=>{
    
    if(req.isAuthenticated()){
        console.log(req.user.username);
        console.log(req.user.id);
        res.render("index.ejs");
    }
    else{
        res.redirect("login.ejs");
    }
});

app.get("/bikecheckout", async (req,res)=>{
    const user_id=req.user.id;
    console.log("user id:",user_id);
    const username = req.user.username;
    console.log(username); 
    try{
        const result=await db.query("SELECT users.id, bike.pick_up, bike.drop, bike.name, bike.distance, bike.id From bike JOIN users ON users.id=bike.user_id WHERE users.id=$1 ORDER BY bike.id DESC LIMIT 1",
        [user_id]);
        console.log("bike user detail",result);
        if(result.rows.length>0){
            const userDetails=result.rows[0];
            const cost=userDetails.distance;
            const total_cost=cost*20;
            res.render("bikecheckout.ejs",{userDetails, total_cost,user:username});
        }
        else{
            res.send("NO entry");
        }
    }
    catch(err){
        console.error("Error executing query:", err);
        
    }
});

app.get("/truckcheckout", async (req,res)=>{
    const username = req.user.username;
    console.log(username); 
   
    const user_id=req.user.id;
    console.log("user id:",user_id);
    try{
        const result=await db.query("SELECT users.id, truck.pick_up, truck.drop, truck.name, truck.distance, truck.id From truck JOIN users ON users.id=truck.user_id WHERE users.id=$1 ORDER BY truck.id DESC LIMIT 1",
        [user_id]);
        console.log("bike user detail",result);
        if(result.rows.length>0){
            const userDetails=result.rows[0];
            const cost=userDetails.distance;
            const total_cost=cost*50;
            res.render("truckcheckout.ejs",{userDetails, total_cost,user : username});
        }
        else{
            res.send("NO entry");
        }
    }
    catch(err){
        console.error("Error executing query:", err);
        
    }
});

app.get("/checkoutpage", async (req,res)=>{
    const username = req.user.username;
    console.log(username); 
    const user_id=req.user.id;
    console.log("user id :",user_id);
    try{
       const result= await db.query("SELECT  users.id,  book_now.pickup,  book_now.drop, book_now.email, book_now.phone_no, book_now.date,  book_now.distance,book_now.name, (electronic.television + electronic.fridge + electronic.ac + electronic.kitchen + electronic.fan) AS total_ele, (furniture.sofa + furniture.bed + furniture.mattress + furniture.wardroble + furniture.chair + furniture.accessories) AS total_fur FROM users LEFT JOIN (   SELECT user_id, id, pickup, drop, email, phone_no, date, distance, name FROM book_now ORDER BY id DESC LIMIT 1) AS book_now ON book_now.user_id = users.id LEFT JOIN ( SELECT user_id, id, sofa, bed, mattress, wardroble, chair, accessories FROM furniture ORDER BY id DESC LIMIT 1 ) AS furniture ON furniture.user_id = users.id LEFT JOIN (SELECT user_id, id, television, fridge, ac, kitchen, fan FROM electronic ORDER BY id DESC LIMIT 1) AS electronic ON electronic.user_id = users.id WHERE users.id=$1",
       [user_id]);
       console.log("Query result:", result);
       if(result.rows.length>0){
        const userDetails=result.rows[0];
        const cost=userDetails.distance;
        const total_cost=cost*90;
        
        console.log(userDetails);
        console.log(total_cost);
        res.render("checkoutpage.ejs",{ userDetails ,total_cost,user:username });
       }
       else{
        res.send("no Entry");
       }
    }
    catch(err){
        console.error("Error executing query:", err);
        
    }
});


app.get("/changepassword",async(req,res)=>{
    
    
    const username = req.user.username;
    console.log(username); 
    res.render("changepassword.ejs",{user : username});
});

app.get('/mover', (req, res) => {
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("mover.ejs"); // Render the mover.ejs file dynamically
});
app.get('/quantity', (req, res) => {
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("quantity.ejs"); // Render the mover.ejs file dynamically
});
app.get("/delivery",(req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("delivery.ejs");
});
app.get("/twowheeler",(req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("twowheeler.ejs");
});
app.get("/packer",(req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("packer.ejs");
});
app.get("/truck",(req,res)=>{
    console.log("Session ID:", req.sessionID); // Log the session ID
    res.render("truck.ejs");
});
app.get("/logout",(req,res)=>{
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
});

app.post("/checkoutpage", async (req,res)=>{
    const user_id=req.user.id;
    console.log("user id :",user_id);
    try{
       const result= await db.query("SELECT  users.id,  book_now.pickup,  book_now.drop, book_now.email, book_now.phone_no, book_now.date,  book_now.distance,book_now.name, (electronic.television + electronic.fridge + electronic.ac + electronic.kitchen + electronic.fan) AS total_ele, (furniture.sofa + furniture.bed + furniture.mattress + furniture.wardroble + furniture.chair + furniture.accessories) AS total_fur FROM users LEFT JOIN (   SELECT user_id, id, pickup, drop, email, phone_no, date, distance, name FROM book_now ORDER BY id DESC LIMIT 1) AS book_now ON book_now.user_id = users.id LEFT JOIN ( SELECT user_id, id, sofa, bed, mattress, wardroble, chair, accessories FROM furniture ORDER BY id DESC LIMIT 1 ) AS furniture ON furniture.user_id = users.id LEFT JOIN (SELECT user_id, id, television, fridge, ac, kitchen, fan FROM electronic ORDER BY id DESC LIMIT 1) AS electronic ON electronic.user_id = users.id WHERE users.id=$1",
       [user_id]);
       console.log("Query result:", result);
       if(result.rows.length>0){
        const userDetails=result.rows[0];
        const cost=userDetails.distance;
        const total_cost=cost*80;
        
        console.log(userDetails);
        console.log(total_cost);
        
        await db.query("INSERT INTO packercheckout (user_id,name,email,pickup,drop,phoneno,distance,cost, furniture,electronics) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
        [userDetails.id,userDetails.name,userDetails.email,userDetails.pickup,userDetails.drop,userDetails.phone_no,userDetails.distance,total_cost,
        userDetails.total_fur,userDetails.total_ele]);
        res.redirect("/index");
        console.log("checkout successful");

       }
       else{
        res.send("no Entry");
       }
    }
    catch(err){
        console.error("Error executing query:", err);
        
    }   
});
app.post("/bikecheckout", async (req,res)=>{
    const user_id=req.user.id;
    console.log("user id:",user_id);
    try{
        const result=await db.query("SELECT users.id, bike.pick_up, bike.drop, bike.name, bike.distance, bike.id From bike JOIN users ON users.id=bike.user_id WHERE users.id=$1 ORDER BY bike.id DESC LIMIT 1",
        [user_id]);
        
        if(result.rows.length>0){
            const userDetails=result.rows[0];
            const cost=userDetails.distance;
            const total_cost=cost*20;
            
            await db.query("INSERT INTO bikecheckout (user_id , name ,pickup ,drop,cost) VALUES($1,$2,$3,$4,$5) ",
            [user_id,userDetails.name,userDetails.pick_up,userDetails.drop,total_cost]);
            console.log("entry successfull in bike checkout");
            res.redirect("/index");
        }
        else{
            res.send("NO entry");
        }
    }
    catch(err){
        console.error("Error executing query:", err);
        
    }
});

app.post("/truckcheckout",async (req,res)=>{
    const user_id=req.user.id;
    console.log("user id:",user_id);
    try{
        const result=await db.query("SELECT users.id, truck.pick_up, truck.drop, truck.name, truck.distance, truck.id From truck JOIN users ON users.id=truck.user_id WHERE users.id=$1 ORDER BY truck.id DESC LIMIT 1",
        [user_id]);
        console.log("bike user detail",result);
        if(result.rows.length>0){
            const userDetails=result.rows[0];
            const cost=userDetails.distance;
            const total_cost=cost*50;

            await db.query("INSERT INTO truckcheckout (user_id , name ,pickup ,drop,cost) VALUES($1,$2,$3,$4,$5) ",
            [user_id,userDetails.name,userDetails.pick_up,userDetails.drop,total_cost]);
            console.log("successful truck checkout entry");
            res.redirect("/index");
            
        }
        else{
            res.send("NO entry");
        }
    }
    catch(err){
        console.error("Error executing query:", err);
        
    }
});
app.post("/registration", async (req,res)=>{
    const {email ,password ,username}=req.body;
    try{
        const result=await db.query("SELECT * FROM users WHERE email=$1",[email]);
        if(result.rows.length>0){
            res.redirect("/login");
            
        }
        else{
            bcrypt.hash(password,saltRounds,async (err,hash)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("hash password",hash);
                    const result=await db.query("INSERT INTO users (email,password,username) VALUES ($1,$2,$3) RETURNING *",
                    [email,hash,username]);
                    console.log(result);
                    const user=result.rows[0];
                    req.login(user,(err)=>{
                        console.log(err);
                        res.redirect("/index");
                    });
                }
            });
        }
    }
    catch(err){
        console.log(err);
    }
});
app.post("/login", (req, res, next) => {
    console.log(req.body);
    passport.authenticate("local", (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            
            return res.redirect("/login");
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/index");
        });
    })(req, res, next);
});


passport.use(
    new Strategy 
    (async function verify(username, password ,cb){
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
            if (result.rows.length > 0) {
              const user = result.rows[0];
              const storedHashedPassword = user.password;
              //verifying the password
              bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                if (err) {
                  console.error("Error comparing passwords:", err);
                  return cb(err);
                } else {
                  if (valid) {
                    console.log("success");
                    return cb(null,user);
                    
                  } else {
                    console.log("fail");
                   return cb(null,false);
                  }
                }
              });
            } else {
              return cb("User not Found");
            }
          } catch (err) {
            return cb(err);
          }
    }));


    app.post("/changepassword", async (req,res)=>{
        const {oldpassword,newpassword}=req.body;
        
        console.log(oldpassword,newpassword);
        try{
            const validpassword=await bcrypt.compare(oldpassword,req.user.password);
            console.log(validpassword);
            if (validpassword){
                const newHash=await bcrypt.hash(newpassword,saltRounds);
                console.log(newHash);
                await db.query("UPDATE users SET password=$1 WHERE id=$2",[newHash,req.user.id]);
                console.log("password changed successfully");
                res.redirect("/index");
            }
        }
        catch(err){
            console.log("Server error",err);
        }
    });

app.post("/forgot", async (req,res)=>{
    const {email ,username,password}=req.body;
    try{
        const result=await db.query("SELECT * FROM users WHERE email=$1 AND username=$2",[email,username]);
        console.log(result);
        if(result.rows.length===0){
            res.send("User doesn't exists!Please Enter valid username and email ");
            
        }
        else{
            bcrypt.hash(password,saltRounds,async (err,hash)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("hash password",hash);
                    await db.query("UPDATE users SET password=$1 WHERE email=$2 AND username=$3",[hash,email,username]);
                    res.render("login.ejs");
                }
            });
        }
    }
    catch(err){
        console.log(err);
    } 
});
app.post("/bike",async(req,res)=>{
    const  {name, pickupLocation,dropLocation,distance,phoneNumber,user } =req.body;
    const user_id = req.user.id;
    const distanceString = distance.toString();
    const distanceFloat = parseFloat(distanceString);
    const distanceInt = parseInt(distanceFloat); // Rounds down to the nearest integer
    console.log(name,pickupLocation,dropLocation,phoneNumber,user,distance);
    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO bike (name,pick_up,drop,phone_no,user_type,distance,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
         [name,pickupLocation,dropLocation,phoneNumber,user,distanceInt,user_id]);
         
        console.log('Entry  successfully');
        res.redirect("/bikecheckout");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});
app.post("/truck",async(req,res)=>{
    const  {name, pickupLocation,dropLocation,distance,phoneNumber,user } =req.body;
    const user_id = req.user.id;
    const distanceString = distance.toString();
    const distanceFloat = parseFloat(distanceString);
    const distanceInt = parseInt(distanceFloat); // Rounds down to the nearest integer

    console.log(name,pickupLocation,dropLocation,phoneNumber,user,distance,user_id);
    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO truck (name,pick_up,drop,phone_no,user_type,distance,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
         [name,pickupLocation,dropLocation,phoneNumber,user,distanceInt,user_id]);
         
        console.log('Entry  successfully');
        res.redirect("/truckcheckout");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});
app.post("/delivery", async(req,res)=>{
    const  { name, phoneNumber, email, state, ve, flexRadioDefault } =req.body;
    console.log(name, phoneNumber, email, state, ve, flexRadioDefault);
    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO Delivery_patner (name,phone_no,email,state,vehcile,gender) VALUES ($1,$2,$3,$4,$5,$6)",
         [name,phoneNumber,email, state, ve, flexRadioDefault]);
        console.log('Registration  successfully');
        res.redirect("/delivery");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


app.post("/furniture",async(req,res)=>{
    const item1=req.body.quantity1;
    const item2=req.body.quantity2;
    const item3=req.body.quantity3;
    const item4=req.body.quantity4;
    const item5=req.body.quantity5;
    const item6=req.body.quantity6;
    const user_id = req.user.id;
    console.log(item1,item2,item3,item4,item5,item6);
    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO furniture (sofa,bed,mattress,wardrobLe,chair,accessories,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
         [item1,item2,item3,item4,item5,item6,user_id]);
        console.log('Data inserted successfully In Furniture Table');
        res.redirect("quantity");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


app.post("/packer", async(req,res)=>{
    const  {name, pickupLocation,dropLocation,distance,phoneNumber,email,date } =req.body;
    const user_id = req.user.id;
    console.log(name,pickupLocation,dropLocation,phoneNumber,email,date,distance);
    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO book_now (pickup,drop,email,date,distance,name,phone_no,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
         [pickupLocation,dropLocation,email,date,distance,name,phoneNumber,user_id]);
         
        console.log('Entry  successfully');
        res.redirect("/quantity");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});
app.post("/electronic",async(req,res)=>{
    const item1=req.body.quantity1;
    const item2=req.body.quantity2;
    const item3=req.body.quantity3;
    const item4=req.body.quantity4;
    const item5=req.body.quantity5;
    const user_id = req.user.id;

    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO electronic (television,fridge,ac,kitchen,fan,user_id) VALUES ($1,$2,$3,$4,$5,$6)",
         [item1,item2,item3,item4,item5,user_id]);
        console.log('Data inserted successfully Electronics');
        res.redirect("/checkoutpage");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
   
});




app.post("/footer", async (req, res) => {
    const email = req.body.email;
    console.log(email);

    try {
        // Use async/await to wait for the query to complete
        await db.query("INSERT INTO footer (email) VALUES ($1)", [email]);
        console.log('Data inserted successfully');
        res.redirect("/");
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
    
});

passport.serializeUser((user, cb) => {
    cb(null, user);
  });
passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
  

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});