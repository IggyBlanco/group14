<?php

	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":"None"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>