<?php 
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    $inData = getRequestInfo();
	
	$id = $inData["contactID"];
    
    $conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");

    // Check connection
    if ($conn -> connect_error) 
        returnWithError( $conn->connect_error );
    
    $sql = "SELECT * FROM Contacts WHERE ID = '" . $id . "'";
    $result = $conn->query($sql);
	if ($result->num_rows == 0)
	{
	    returnWithError("Contact does not exist");
	}
	else
	{
	    $sql = "DELETE FROM Contacts WHERE ID = '" . $id . "'";
        if ($conn->query($sql) === TRUE) 
            returnWithInfo();
        else 
            returnWithError("Failed to delete contact. Try Again");
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
	
	function returnWithInfo()
	{
		$retValue = '{"Error":"None", "Deleted":"True"}';
		sendResultInfoAsJson( $retValue );
	}
 ?>