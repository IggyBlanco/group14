<?php 
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    $inData = getRequestInfo();
	
	$username = $inData["loginName"];
	$password = $inData["loginPassword"];
	$date = $inData["dateCreated"];
	$date = date("Y-m-d",strtotime($date));
    
    $conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");

    // Check connection
    if ($conn -> connect_error) 
        returnWithError( $conn->connect_error );
    
    $sql = "SELECT * FROM Users WHERE UserName = '" . $username . "'";
    
    $result = $conn->query($sql);
	if ($result->num_rows > 0)
	{
		   returnWithError("User already exists");
	}
	else
	{
        $sql = "INSERT INTO Users (UserName, Password, DateCreated) VALUES ('" . $username . "', '" . $password . "', '" . $date . "')";
        if ($conn->query($sql) === TRUE) 
        {
            $sql = "SELECT ID FROM Users WHERE UserName = '" . $inData["loginName"] . "'";
            $result = $conn->query($sql)->fetch_assoc();
            returnWithInfo($result["ID"], $username);
        } 
        else 
        {
            returnWithError("Failed to register user. Please try again");
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
		$retValue = '{"Username":"","Password":"","Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($id, $username)
	{
		$retValue = '{"UserID":"' . $id . '", "Username":"' . $username . '","Error":"None"}';
		sendResultInfoAsJson( $retValue );
	}
 ?>