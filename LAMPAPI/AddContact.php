<?php
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'); 
    
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$userId = $inData["userId"];
	$date = $inData["dateCreated"];
	$date = date("Y-m-d",strtotime($date));

	$conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
	    $sql = "SELECT * FROM Users WHERE ID = '" . $userId . "'";
	    if ($conn->query($sql)->num_rows == 0)
	    {
	        returnWithError("UserId '" . $userId . "' not found. Cannot add contact");
	    } 
	    else if ($conn->query("SELECT * FROM Contacts WHERE Phone = '" . $phone . "' AND Email = '" . $email . "' AND UserID = '" . $userId . "'")->num_rows == 1) 
	    {
	        returnWithError("Contact already exists for UserId: '" . $userId . "'");
	    }
	    else
	    {
    		$sql = "INSERT INTO Contacts (FirstName, LastName, Phone, Email, DateCreated, UserID) VALUES ('" . $firstName . "','" . $lastName . "', '" . $phone . "', '" . $email . "', '" . $date . "', '" . $userId . "')";
    	   
    		if($conn->query($sql) != TRUE )
    		{
    			returnWithError( $conn->error );
    		}
    		else
    		{
    		    $sql = "SELECT ID FROM Contacts WHERE Phone = '" . $phone . "' AND Email = '" . $email . "' AND UserID = '" . $userId . "'";
    		    $result = $conn->query($sql)->fetch_assoc();
    		    returnWithInfo($result["ID"], $date);
    		}
	    }
	    $conn->close();
	}
	
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithInfo($contactId)
	{
	    $retVal = '{"ContactId":"' . $contactId . '", "ContactAdded":"True"}';
	   sendResultInfoAsJson($retVal);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '", "ContactAdded":"False"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>