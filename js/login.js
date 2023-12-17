window.onload = loginLoad;

function loginLoad()
{
	var form = document.getElementById("myLogin");
	form.onsubmit = checkLogin;
}
const user = 
    {
        username:'',
        password:'',
    };


function registerLoad() //กลับไปหน้าสมัคร
{
	onclick=location.href='register.html';
}
function checkLogin()
{
	
	//ถ้าตรวจสอบแล้วพบว่ามีการ login ไม่ถูกต้อง ให้ return false ด้วย
	getUserFromRegister();
	const userInput = document.forms["myLogin"]["username"];
	const passwordInput = document.forms["myLogin"]["password"];
	if(userInput.value == user.username && passwordInput.value == user.password)
	{
		alert("OK!!!");
		return true;
		//เพิ่มที่ไปยังหน้าหลัก
	}
	else
	{
		alert("ไม่พบบัญชีผู้ใช้!!!");
		return false;
	}

}
function getUserFromRegister()
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	user.username = urlParams.get('username');
	user.password = urlParams.get('password');
}
const labels = document.querySelectorAll
