<?php
include 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET['username'])) {
    echo json_encode([]);
    exit;
}

$username = $_GET['username'];

$userStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$userStmt->bind_param("s", $username);
$userStmt->execute();
$userResult = $userStmt->get_result();

if ($userResult->num_rows === 0) {
    echo json_encode([]);
    exit;
}

$userId = $userResult->fetch_assoc()['id'];

$sql = "
SELECT 
    p.id, p.name, p.description, p.start_date, p.end_date, p.status,
    GROUP_CONCAT(u.username SEPARATOR ',') AS assigned_users
FROM projects p
JOIN project_assignments pa ON p.id = pa.project_id
JOIN users u ON pa.user_id = u.id
WHERE p.id IN (
    SELECT project_id FROM project_assignments WHERE user_id = ?
)
GROUP BY p.id
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$projects = [];
while ($row = $result->fetch_assoc()) {
    $projects[] = $row;
}

echo json_encode($projects);
?>
