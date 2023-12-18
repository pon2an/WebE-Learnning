window.onload = pageLoad;
var user = 
   {
       username:'',
       email:'',
       password:'',
       r_password:''
   }
function pageLoad()
{
    var form = document.getElementById("myForm");
    form.onsubmit = validateForm;
}

function validateForm() 
{
    //ถ้าตรวจสอบแล้วว่ามีการ register ไม่ถูกต้องให้ return false ด้วย
    //Sett_user();
    var password = document.forms["myForm"]["password"].value;
    var r_password = document.forms["myForm"]["r_password"].value;
   if (password != r_password)
   {
        document.getElementById("errormsg").innerHTML = '...What password your?'
        return false;
   }
   else
   {
        alert("Welcome To E-Learning D Hub!!!");
   } 

}
//function Sett_user()
//{
 //user.firstname = document.forms["myForm"]["firstname"].value;
 //user.lastname = document.forms["myForm"]["lastname"].value;
 //user.gender = document.forms["myForm"]["gender"].value;
 //user.bday = document.forms["myForm"]["bday"].value;
 //user.username = document.forms["myForm"]["username"].value;
 //user.password = document.forms["myForm"]["password"].value;
 //user.r_password = document.forms["myForm"]["r_password"].value;
//}