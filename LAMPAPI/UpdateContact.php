<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	//$userId = $inData["userId"];
	$contactId = $inData["contactId"];
	$date = date("Y-m-d",strtotime($date));
	
	$conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else 
	{
    	$sql = "SELECT * FROM Contacts WHERE ID = '" . $contactId . "'";
    	if ($conn->query($sql)->num_rows == 0)
	    {
	        returnWithError("Contact not found");
	    }
	    else
	    {
    		$sql = "UPDATE Contacts SET FirstName = '" . $firstName . "', LastName = '" . $lastName . "', Phone = '" . $phone . "', Email = '" . $email . "' WHERE ID='". $contactId ."'";
    	   
    		if($conn->query($sql) != TRUE )
    		{
    			returnWithError( $conn->error );
    		}
    		else
    		{
    		    //$sql = "SELECT ID FROM Contacts WHERE ID='". $contactId ."'";
    		    //$result = $conn->query($sql)->fetch_assoc();
    		    returnWithInfo($firstName, $lastName, $phone, $email, $contactId);
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
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($firstName, $lastName, $phone, $email, $contactId )
	{
		$retValue = '{"FirstName":"' . $firstName . '", "LastName":"' . $lastName . '", "Phone":"' . $phone . '", "Email":"' . $email . '", "ContactID":"' . $contactId . '", "ContactUpdated":"True"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>