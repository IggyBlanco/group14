<?php 
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    $inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userID = $inData["userID"];
    
    $conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");

    // Check connection
    if ($conn -> connect_error) 
        returnWithError( $conn->connect_error );
    
    $sql = "SELECT * FROM Users WHERE ID = '" . $userID . "'";
    $result = $conn->query($sql);
	if ($result->num_rows == 0)
	{
	    returnWithError("userID does not exist");
	}
	else
	{
	    $sql = "SELECT * FROM Contacts WHERE FirstName = '" . $firstName . "' AND Phone = '" . $phone . "' AND Email = '" . $email . "' AND UserID = '" . $userID . "'";
	    if ($conn->query($sql)->num_rows == 0)
	    {
	        returnWithError("Contact not found");
	    }
	    else 
	    {
            $sql = "DELETE FROM Contacts WHERE FirstName = '" . $firstName . "' AND Phone = '" . $phone . "' AND Email = '" . $email . "' AND UserID = '" . $userID . "'";
            if ($conn->query($sql) === TRUE) 
                returnWithInfo($firstName, $phone, $email, $userID);
            else 
                returnWithError("Failed to delete user. Try Again");
	    }
	}
    $conn->close();
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
		$retValue = '{"Deleted":"False", "Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($firstName, $lastName)
	{
		$retValue = '{FirstName":"' . $firstName . '", "Deleted":"True"}';
		sendResultInfoAsJson( $retValue );
	}
 ?>