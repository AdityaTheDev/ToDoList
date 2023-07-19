const express=require('express')
const bodyParser=require('body-parser')
const date=require(__dirname+'/date.js')
const casechange=require(__dirname+'/namecasechange.js')
const mongoose=require('mongoose')


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});

const itemSchema={
    name:String
}


const Item=mongoose.model("Item",itemSchema)

const item1=new Item({
    name:"Welcome to TodoList"
})
const item2=new Item({
    name:"Hit the + button to add new item"
})
const item3=new Item({
    name:"Press <-- to Delete"
})

const listSchema={
    name:String,
    item:[itemSchema]
}

const List=mongoose.model("List",listSchema)

const app=express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

app.set('view engine' ,'ejs')

//Deleted var items=[]
//Deleted var workitems=[]

defaultItems=[item1, item2, item3]
app.get('/',function(req,res){

    
    var day=date();
    Item.find().then((founditems)=>{
         console.log("size is", +founditems.length);
        if(founditems.length <=0){
            Item.insertMany(defaultItems)
            res.redirect('/')
        }
        else{
            res.render("list",{listtitle:day,newitems:founditems})
        }

        
    });
    
 
})

app.post('/',function(req,res){
      
      const itemName=req.body.item;
      const listname=req.body.list;

      const newitem= new Item({
        name:itemName
      })

      if(listname===date()){
        newitem.save()
        res.redirect('/')
      }
      else{
        List.findOne({name:listname}).then((foundlist)=>{
            foundlist.item.push(newitem)
            foundlist.save();

            res.redirect("/"+listname)
        })
      }

      //res.redirect('/')

    //  var item=req.body.item
     
    //  if(req.body.list==="Work List"){
    //      workitems.push(item);
    //      res.redirect('/work')  
    //  }
    //  else{
    //     items.push(item)
    //     res.redirect('/')
    //  }
     
})

// app.get('/work',function(req,res){
//     res.render("list",{listtitle:"Work List",newitems:workitems})
// })

app.get('/:customList',function(req,res){
   const customList=casechange(req.params.customList);

   List.findOne({name:customList}).then((foundlist)=>{
    if(!foundlist){
    const list=new List({
    name:customList,
    item:defaultItems
   })
   list.save()
   res.redirect('/'+customList)
    }
    else{
        res.render("list",{listtitle:foundlist.name, newitems:foundlist.item})
    }
   })

   
})

// app.post('/work',function(req,res){

//     var item=req.body.item
//     workitems.push(item)
//     res.redirect('/work')
// })

app.post('/delete',function(req,res){
    const checkedItem=req.body.checkbox
    const listname=req.body.listname
    
    console.log(listname);
     
    if(listname===date()){
        Item.findByIdAndRemove(checkedItem).then((err)=>{
            if(!err){
                console.log("successfully deleted");
            }
        })
        res.redirect('/');
    }
    else{

        List.findOneAndUpdate({name:listname},{$pull:{item:{_id:checkedItem}}}).then((err)=>{
            if(!err){
                console.log("Successfully deleted");
            }
            res.redirect('/'+listname)
        })


    }

})
app.listen(3000,function(){
    console.log("server started");
})
