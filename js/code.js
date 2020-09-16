var urlBase = 'https://greengang-gg-4331.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doRegistration()
{
    var login = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;
    
    document.getElementById("registerResult").innerHTML = "";
    
    var jsonPayload = '{"loginName" : "' + login + '", "loginPassword" : "' + password + '"}';
    var url = urlBase + '/register.' + extension;
   
    var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
		
				if( jsonObject.error == "user already exists" )
				{
					document.getElementById("registerResult").innerHTML =
					    "That username already exists, please choose another.";
					return;
				}
				
				firstName = jsonObject.loginName;
				lastName = jsonObject.loginPassword;

				saveCookie();
			    
			  window.location.href = "add.html";
			}
		};
		
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
	    document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"loginName" : "' + login + '", "loginPassword" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				userId = jsonObject.Username;
		
				if( userId == "" )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
			
			    if (jsonObject.error == "NONE")
				    window.location.href = "add.html";
			}
		};
		
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doAddContact()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"loginName" : "' + login + '", "loginPassword" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				userId = jsonObject.Username;
		
				if( userId === "" )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
			
			    if (jsonObject.error == "NONE")
				    window.location.href = "add.html";
			}
		};
		
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}