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

$username = $_GET['username'] ?? '';

$sql = "
    SELECT p.id, p.name, p.start_date, p.end_date, p.status
    FROM projects p
    JOIN users u ON p.user_id = u.id
    WHERE u.username = ? AND (p.status = 'pending' OR p.status = 'ongoing')
";


$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$projects = [];
while ($row = $result->fetch_assoc()) {
    $projects[] = $row;
}

echo json_encode($projects);

$stmt->close();
$conn->close();
