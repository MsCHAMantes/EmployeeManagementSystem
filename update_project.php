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
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Project ID is required']);
    exit();
}

$id = (int)$input['id'];

// Prepare update fields (only allow specific fields)
$fields = ['name', 'description', 'status', 'start_date', 'end_date'];
$updates = [];
$params = [];
$types = '';

foreach ($fields as $field) {
    if (isset($input[$field])) {
        $updates[] = "$field = ?";
        $params[] = $input[$field];
        $types .= 's'; // all fields are strings here
    }
}

if (count($updates) === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'No fields to update']);
    exit();
}

$sql = "UPDATE projects SET " . implode(", ", $updates) . " WHERE id = ?";
$params[] = $id;
$types .= 'i';

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare statement']);
    exit();
}

// Bind parameters dynamically
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Project updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update project']);
}

$stmt->close();
$conn->close();
