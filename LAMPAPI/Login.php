<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    
    $inData = getRequestInfo();
	
	$id = 0;
	$userName = $inData["loginName"];
	$password = $inData["loginPassword"];

	$conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT ID,Username,Password FROM Users where Username='" . $userName . "' and Password='" . $password . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$id = $row["ID"];
			
			returnWithInfo($userName, $id );
		}
		else
		{
			returnWithError( "No Records Found" );
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
	
	function returnWithInfo( $username, $id )
	{
		$retValue = '{"Username":"' . $username . '","ID":"' . $id . '","error":"NONE"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>