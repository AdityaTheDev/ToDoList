
module.exports=()=>{
    var today=new Date();
    var currday=today.getDay();

    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }

    var day=today.toLocaleDateString("en-US",options)

    return day;
}
