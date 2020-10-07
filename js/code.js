var urlBase = 'https://greengang-gg-4331.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";


function doLogin()
{
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"loginName" : "' + login + '", "loginPassword" : "' + hash + '"}';
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
		        
				if( jsonObject.error != "No Error" )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
			
			    if (jsonObject.error == "No Error")
			    {
			        var id = jsonObject.ID;
			        localStorage.setItem("userID", id);
			        localStorage.setItem("loggedIn", "True");
			        window.location.href = "contacts.html";
			    }
			}
		};
		
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegistration()
{
    var login = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;
    var hash = md5( password );
    
    document.getElementById("registerResult").innerHTML = "";
    
    if (password.localeCompare(document.getElementById("confirmPassword").value) !== 0) {
        document.getElementById("registerResult").innerHTML = "Passwords do not match<br>";
        return;
    }
    
    var jsonPayload = '{"loginName" : "' + login + '", "loginPassword" : "' + hash + '"}';
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
		      
				if( jsonObject.Error == "User already exists" )
				{
					document.getElementById("registerResult").innerHTML =
					    "That username already exists, please choose another.<br>";
					return false;
				}
				
				firstName = jsonObject.loginName;
				lastName = jsonObject.loginPassword;

				saveCookie();
				document.getElementById("registerResult").innerHTML = "Account has been created.<br>";
				document.getElementById("registerResult").style = "background-color:#5ab190; color:#202225; border-radius: 2px; padding: 4px; margin: 24px;";
			    return;
			}
		};
		
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
	    document.getElementById("registerResult").innerHTML = err.message;
	    return;
	}
}

function doAddContact()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	
	var userId = localStorage.getItem("userID");
	
	var date = new Date();
	var dateCreated = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phone" : "' + phone + '", "email" : "' + email + '", "userId" : "' + userId + '", "dateCreated" : "' + dateCreated + '"}';
	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var response  = JSON.parse(xhr.responseText);
				if (response.ContactAdded == "True")
				    window.location.href = "contacts.html";
				else
				    alert("Contact with this phone number and email already exists.");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function getContacts(query, userID)
{
	var jsonPayload = '{"search" : "' + query + '", "userId" : "' + userID + '"}';
	var url = urlBase + '/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var contacts = JSON.parse( xhr.responseText );

			    if (contacts.error != "None" && contacts.error != "No records found")
				    window.location.href = "profile.html";
				    
				var contactResults = document.getElementById("contactResult");
				
				
				for (var i = 0; i < contacts.results.length; i++)
                {
                    var firstName = contacts.results[i].FirstName;
                    var lastName = contacts.results[i].LastName;
                    var phone = contacts.results[i].Phone;
                    var email = contacts.results[i].Email;
                    var contactID = contacts.results[i].ContactID;
                    var contactCard = createContactCard(firstName, lastName, phone, email, contactID);
                    contactResults.appendChild(contactCard);
                }
                localStorage.setItem("editMode", "false");
                return;
			}
		};
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		window.location.href = "index.html";
		return;
	}
}

function handleSearchQuery()
{
    var query = document.getElementById("query").value;
    document.getElementById("contactResult").innerHTML = "";
    var userID = localStorage.getItem("userID");
    getContacts(query, userID);
}

function doEdit(element)
{
    var contactID = element.getAttribute("data-id");
    var firstName = document.getElementById("firstName-" + contactID).value;
    var lastName = document.getElementById("lastName-" + contactID).value;
    var phone = document.getElementById("phone-" + contactID).value;
    var email = document.getElementById("email-" + contactID).value;
    
    var jsonPayload = '{"contactId" : "' + contactID + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + 
    '", "email" : "' + email + '", "phone" : "' + phone + '"}';
	var url = urlBase + '/UpdateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var response = JSON.parse( xhr.responseText );

			    if (response.ContactUpdated == "False")
			        alert("Failed to update contact. Try again");
			    window.location.href = "contacts.html";
			}
		};
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		window.location.href = "contacts.html";
		return;
	}
}

function changeToEdit(element)
{
    if (localStorage.getItem("editMode") == "true")
        return;
    var contactID = element.getAttribute("data-id");
    element.className = "btn btn-sm blue";
    element.style = "text-align: center; border-width: 0px; height: 38px; width: 38px; font-size: 16px;";
    element.title = "Save Changes";
    
    var saveIcon = document.createElement("i");
    saveIcon.className = "ion-checkmark";
    saveIcon.style = "color:white"; 
    
    // something is wrong here, its not getting rid of the edit icon before replacing
    element.innerHTML = "";
    element.appendChild(saveIcon);
    
    document.getElementById("firstName-" + contactID).disabled = false;
    document.getElementById("firstName-" + contactID).style = "background: #cccccc; border-width: 0px; text-color:black;";
    document.getElementById("firstName-" + contactID).className = "form-control font-weight-bold";
    
    document.getElementById("lastName-" + contactID).disabled = false;
    document.getElementById("lastName-" + contactID).style = "background: #cccccc; border-width: 0px; text-color:black;";
    document.getElementById("lastName-" + contactID).className = "form-control font-weight-bold";
    
    document.getElementById("phone-" + contactID).disabled = false;
    document.getElementById("phone-" + contactID).style = "background: #cccccc; border-width: 0px; text-color:black;";
    document.getElementById("phone-" + contactID).className = "form-control font-weight-bold";
    
    document.getElementById("email-" + contactID).disabled = false;
    document.getElementById("email-" + contactID).style = "background: #cccccc; border-width: 0px; text-color:black;";
    document.getElementById("email-" + contactID).className = "form-control font-weight-bold";
    
    
    
    localStorage.setItem("editMode", "true");
    element.setAttribute("onclick", "doEdit(this);");
}

function deleteContact(element)
{
    var contactID = element.getAttribute("data-id");
    
    var result = confirm("Are you sure you want to delete this contact?");
    
    if (!result)
        return;
    
    var jsonPayload = '{"contactID" : "' + contactID + '"}';
	var url = urlBase + '/DeleteContact.' + extension;
  
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var response = JSON.parse( xhr.responseText );

			    if (response.Delete == "False")
			        alert("Failed to delete contact. Try again");
			    window.location.href = "contacts.html";
			}
		};
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		window.location.href = "contacts.html";
		return;
	}
}

function createContactCard(fName, lName, phoneNumber, emailAddress, contactID)
{
    var contactCard = document.createElement("div");
    contactCard.className = "col-sm-6 col-xl-3";
    contactCard.style = "border-width: 0px; margin-top: 8px;"
    contactCard.setAttribute("data-id", contactID);
    
    var cardShadow = document.createElement("div");
    cardShadow.className = "card mb-3";
    cardShadow.style = "border-width: 0px;";
    
    var cardHeader3 = document.createElement("div");
    cardHeader3.className = "card-header py-3";
    cardHeader3.style = "height: 57px; background: #2f3136; border-width: 0px;";
    
    var firstNameText = document.createElement("input");
    firstNameText.className = "form-group text-light font-weight-bold";
    firstNameText.type = "text";
    firstNameText.style = "background: rgba(64,68,75,0); border-width: 0px;";
    firstNameText.defaultValue = fName;
    firstNameText.disabled = true;
    firstNameText.setAttribute("data-id", contactID);
    firstNameText.setAttribute("id", "firstName-" + contactID);
    cardHeader3.appendChild(firstNameText);
    
    var cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.style = "height: 63px; background: #2f3136; border-width: 0px;";
    
    var lastNameText = document.createElement("input");
    lastNameText.className = "form-group text-light font-weight-bold";
    lastNameText.type = "text";
    lastNameText.style = "height: 50px; background: #2f3136; border-width: 0px; padding-bottom:-20px;";
    lastNameText.defaultValue = lName;
    lastNameText.disabled = true;
    lastNameText.setAttribute("id", "lastName-" + contactID);
    cardHeader.appendChild(lastNameText);
    
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.style = "background: #36393f;";
    
    var form = document.createElement("form");
    
    var phoneDiv = document.createElement("div");
    phoneDiv.className = "form-group text-light";
    
    var phoneLabel = document.createElement("label");
    phoneLabel.innerHTML = "Phone Number <br>";
    
    var phone = document.createElement("input");
    phone.className = "form-control text-light";
    phone.type = "text";
    phone.style = "background: #40444b; border-width: 0px;";
    phone.defaultValue = phoneNumber;
    phone.disabled = true;
    phone.setAttribute("id", "phone-" + contactID);
    
    phoneDiv.appendChild(phoneLabel);
    phoneDiv.appendChild(phone);
    
    var emailDiv = document.createElement("div");
    emailDiv.className = "form-group text-light";
    
    var emailLabel = document.createElement("label");
    emailLabel.innerHTML = "Email <br>";
    
    var email = document.createElement("input");
    email.className = "form-control text-light";
    email.type = "text";
    email.style = "background: #40444b; border-width: 0px;";
    email.defaultValue = emailAddress;
    email.disabled = true;
    email.setAttribute("id", "email-" + contactID);
    
    phoneDiv.appendChild(phoneLabel);
    phoneDiv.appendChild(phone);
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(email);
    
    var editButtonDiv = document.createElement("div");
    editButtonDiv.className = "form-group";
    editButtonDiv.style = "margin: 0px; height: 37px;";
    
    var editButton = document.createElement("button");
    editButton.className = "btn btn-sm blue";
    editButton.type = "button";
    editButton.style = "text-align: center; border-width: 0px; height: 38px; width: 38px; font-size: 16px;";
    editButton.title = "Edit";
    editButton.setAttribute("data-id", contactID);
    editButton.setAttribute("onclick", "changeToEdit(this);");
    
    var editIcon = document.createElement("i");
    editIcon.className = "ion-edit";
    editIcon.style = "color:white";
    
    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-sm green";
    deleteButton.type = "button";
    deleteButton.style = "text-align: center; border-width: 0px; height: 38px; width: 38px; font-size: 16px; margin-left: 10px";
    deleteButton.title = "Delete";
    deleteButton.setAttribute("data-id", contactID);
    deleteButton.setAttribute("onclick", "deleteContact(this);");
    
    var deleteIcon = document.createElement("i");
    deleteIcon.className = "ion-android-delete";
    deleteIcon.style = "color:white";
    
    editButtonDiv.appendChild(editButton);
    editButtonDiv.appendChild(deleteButton);
    
    editButton.appendChild(editIcon);
    deleteButton.appendChild(deleteIcon);
    
    form.appendChild(phoneDiv);
    form.appendChild(emailDiv);
    form.appendChild(editButtonDiv);
    
    cardBody.appendChild(form);
    cardShadow.appendChild(cardHeader3);
    cardShadow.appendChild(cardHeader);
    cardShadow.appendChild(cardBody);
    
    contactCard.appendChild(cardShadow);
    return contactCard;
}

function displayContacts(userID) 
{
    var contactResults = document.getElementById("contactResult");
  //  contactResults.setAttribute("style", "height:1000px; overflow: auto;");
    var contacts = getContacts("@", userID);
    
    return;
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