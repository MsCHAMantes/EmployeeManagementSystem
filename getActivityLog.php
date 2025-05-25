<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Adjust this if you want to restrict origins

// Database connection details - change these to your settings
$host = 'localhost';
$db = 'employee_management';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

$sql = "
  SELECT 
    activity_logs.id, 
    users.username, 
    activity_logs.action, 
    activity_logs.timestamp 
  FROM activity_logs 
  JOIN users ON activity_logs.user_id = users.id 
  ORDER BY activity_logs.timestamp DESC 
  LIMIT 20
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        'success' => false,
        'error' => 'Query failed: ' . $conn->error
    ]);
    exit;
}

$activities = [];

while ($row = $result->fetch_assoc()) {
    $activities[] = [
        'id' => (int)$row['id'],
        'username' => $row['username'],
        'action' => $row['action'],
        'timestamp' => $row['timestamp']
    ];
}

echo json_encode([
    'success' => true,
    'activities' => $activities
]);

$conn->close();
