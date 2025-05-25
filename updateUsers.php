<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle OPTIONS preflight request and exit early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Your existing POST handling code below ...

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['id'], $data['username'], $data['role'])) {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
    exit;
}

$id = intval($data['id']);
$username = trim($data['username']);
$role = trim($data['role']);

if ($username === '' || $role === '') {
    echo json_encode(['success' => false, 'error' => 'Username and role cannot be empty']);
    exit;
}

$allowedRoles = ['admin', 'hr', 'employee'];
if (!in_array($role, $allowedRoles)) {
    echo json_encode(['success' => false, 'error' => 'Invalid role']);
    exit;
}

$host = 'localhost';
$db = 'employee_management';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Prevent SQL injection using prepared statements
$stmt = $conn->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
$stmt->bind_param("ssi", $username, $role, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Update failed: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
