<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$conn = new mysqli("localhost", "root", "", "employee_management");

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

// Read the raw POST data and decode JSON
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);


if (!$data) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing JSON input."]);
    exit;
}

// Safely extract and escape inputs
$name = $conn->real_escape_string($data["name"] ?? '');
$description = $conn->real_escape_string($data["description"] ?? '');
$status = $conn->real_escape_string($data["status"] ?? '');
$user_id = $conn->real_escape_string($data["user_id"] ?? '');
$start_date = $conn->real_escape_string($data["start_date"] ?? '');
$end_date = $conn->real_escape_string($data["end_date"] ?? '');
$assigned_users = $data["assigned_users"] ?? [];

if (!$name || !$description || !$status || !$user_id || !$start_date || !$end_date || !is_array($assigned_users)) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required project fields."]);
    exit;
}

$sql = "INSERT INTO projects (name, description, status, user_id, start_date, end_date)
        VALUES ('$name', '$description', '$status', '$user_id', '$start_date', '$end_date')";

if ($conn->query($sql) === TRUE) {
    $project_id = $conn->insert_id;

    foreach ($assigned_users as $assigned_user_id) {
        $safe_id = $conn->real_escape_string($assigned_user_id);
        $conn->query("INSERT INTO project_users (project_id, user_id) VALUES ('$project_id', '$safe_id')");
    }

    echo json_encode(["message" => "Project and assignments created successfully."]);
} else {
    echo json_encode(["message" => "Project creation failed: " . $conn->error]);
}

$conn->close();
?>
