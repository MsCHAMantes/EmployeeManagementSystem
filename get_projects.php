<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = 'localhost';
$db = 'employee_management';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$sql = "SELECT id, name, description, status, start_date, end_date FROM projects";
$result = $conn->query($sql);

$projects = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }
}

echo json_encode($projects);
$conn->close();
