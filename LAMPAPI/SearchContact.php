<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	

	$conn = new mysqli("localhost", "gr33nbru_greengang", "greengang4331", "gr33nbru_cop4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * FROM Contacts WHERE (FirstName LIKE '%" . $inData["search"] . "%' OR LastName LIKE '%" . $inData["search"] . "%' OR Phone LIKE '%" . $inData["search"] . "%' OR Email LIKE '%" . $inData["search"] . "%') AND UserID='" . $inData["userId"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '{"FirstName": "' . $row["FirstName"] . '", "LastName": "' . $row["LastName"] . '", "Phone": "' . $row["Phone"] . '", "Email": "' . $row["Email"] . '", "ContactID":"' . $row["ID"] . '"}';
			}
		    //returnWithError($sql);
		    returnWithInfo( $searchResults );
		}
		else
		{
			returnWithError("No records found");
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":"None"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>