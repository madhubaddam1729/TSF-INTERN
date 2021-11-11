require('dotenv').config();

const express=require("express");

const mongoose=require("mongoose");

const app=express();

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+ process.env.NAME +":"+ encodeURIComponent(process.env.PASSWORD) +"@cluster0.lvknf.mongodb.net/customersDB1", {useNewUrlParser:true, useUnifiedTopology:true});

const customerSchema=new mongoose.Schema({ 
    Name:{ type: String},
    Email:{ type: String},
    Balance:{ type: Number}
});

const Customer=new mongoose.model("Customer",customerSchema);

const TransactionSchema=new mongoose.Schema({
    From:{ type: String},
    To:{ type: String},
    Amount:{ type: Number},
    Time: {type: Date, default: Date.now()}
});

const Transaction=new mongoose.model("Transaction",TransactionSchema);
  
var fromId=0,toId=0,amount1=0;

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html");
})

app.get("/viewCustomers",function(req,res)
{
     Customer.find({},function(err,items)
    {
        res.render("viewCustomersAll",{users:items});
    })
})

app.post("/viewCustomers",function(req,res)
{
     res.redirect("/viewCustomers");
})

app.get("/makeTransaction",function(req,res)
{
     Customer.find({},function(err,items)
    {
        res.render("customers",{users:items});
    })
})

app.post("/makeTransaction",function(req,res)
{
     res.redirect("/makeTransaction");
})

app.get("/viewTransactions",function(req,res)
{
     Transaction.find({},function(err,items)
    {
        res.render("transaction",{trans:items});
    })
})

app.post("/viewTransactions",function(req,res)
{
     res.redirect("/viewTransactions");
})

app.get("/selectedCustomer",function(req,res)
{   
    Customer.find({},function(err,items)
    {
        res.render("receiver",{users:items});
    })
})

app.post("/selectedCustomer",function(req,res)
{
    fromId=req.body.button;
   
    res.redirect("/selectedCustomer");
})

app.get("/toCustomer",function(req,res)
{
     if(fromId==toId)
     {
         res.render("failure",{text:"You cannot send money to same account"});
     }
     else
     { 
         res.render("result",{x1:fromId,y1:toId});
    }
})

app.post("/toCustomer",function(req,res)
{
     toId=req.body.button1;

     res.redirect("/toCustomer");
})

app.get("/transaction",function(req,res)
{
    var s1=fromId,s2=toId;
    
    while(s1.charAt(0)==" ")
    {
        s1=s1.substring(1);
    }
    while(s2.charAt(0)==" ")
    {
        s2=s2.substring(1);
    }
    while(s1.charAt(s1.length-1)==" ")
    {
        s1=s1.substring(0,s1.length-1);
    }
    while(s2.charAt(s2.length-1)==" ")
    {
        s2=s2.substring(0,s2.length-1);
    }

    const t1=new Transaction({From:s1,To:s2,Amount:amount1});

    t1.save();

    var updatedBalance1=0,updatedBalance2=0;


    Customer.updateOne({Name:s1},{$inc:{Balance:-amount1}},function(err,items)
    {
        Customer.find({Name:s1},function(err,items)
        {
           updatedBalance1=items[0].Balance;

           Customer.updateOne({Name:s2},{$inc:{Balance:amount1}},function(err,items)
           {
               Customer.find({Name:s2},function(err,items)
               {
                  updatedBalance2=items[0].Balance;
       
                  res.render("success",{text:"Transaction Successful",z1:s1,z2:s2,x1:updatedBalance1,x2:updatedBalance2}); 
       
               })
              
           })

        })
    })
   
  
})

app.post("/transaction",function(req,res)
{
     amount1=(Number)(req.body.amount);

     res.redirect("/transaction");
});

app.listen(process.env.PORT||3000,function(req,res)
{
    console.log("Server running on port 3000");
})


/*
 const c1=new Customer({Name: "Virat Kohli", Email:"kohli@gmail.com",Balance: 5000});

  const c2=new Customer({Name: "Rohit Sharma", Email:"rohithsharma@gmail.com",Balance: 10000});

  const c3=new Customer({Name: "SuryaKumar", Email:"suryaKumar@gmail.com",Balance: 15000});

  const c4=new Customer({Name: "Shreyas Iyer", Email:"rhreyasiyer@gmail.com",Balance: 8000});

  const c5=new Customer({Name: "Rishab Pant", Email:"rishabpant@gmail.com",Balance: 12000});

  const c6=new Customer({Name: "M.S.Dhoni", Email:"msdhoni@gmail.com",Balance: 11000});

  const c7=new Customer({Name: "Bhuvaneshwar", Email:"bhuvaneshwar@gmail.com",Balance: 9000});

  const c8=new Customer({Name: "Bumrah", Email:"bumrah@gmail.com",Balance: 10000});

  const c9=new Customer({Name: "Shardul Thakur", Email:"shardulthakur@gmail.com",Balance: 13000});

  const c10=new Customer({Name: "Shami", Email:"shami@gmail.com",Balance: 14000});

    Customer.insertMany([c1,c2,c3,c4,c5,c6,c7,c8,c9,c10],function(err)
    {
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Successfully add items");
    }
    });

    */
  