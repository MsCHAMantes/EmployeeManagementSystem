<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = 'localhost';
$db = 'employee_management';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$sql = "SELECT id, username, role FROM users"; 
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['success' => false, 'error' => 'Query failed: ' . $conn->error]);
    exit;
}

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(['success' => true, 'users' => $users]);
$conn->close();
?>
