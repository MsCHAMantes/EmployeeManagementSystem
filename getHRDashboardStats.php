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
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Count pending projects
$pendingSql = "SELECT COUNT(*) AS count FROM projects WHERE status = 'pending'";
$pendingResult = $conn->query($pendingSql);
$pendingCount = 0;
if ($pendingResult) {
    $row = $pendingResult->fetch_assoc();
    $pendingCount = (int)$row['count'];
}

// Count completed projects
$completedSql = "SELECT COUNT(*) AS count FROM projects WHERE status = 'completed'";
$completedResult = $conn->query($completedSql);
$completedCount = 0;
if ($completedResult) {
    $row = $completedResult->fetch_assoc();
    $completedCount = (int)$row['count'];
}

// Count total projects
$totalSql = "SELECT COUNT(*) AS count FROM projects";
$totalResult = $conn->query($totalSql);
$totalCount = 0;
if ($totalResult) {
    $row = $totalResult->fetch_assoc();
    $totalCount = (int)$row['count'];
}

echo json_encode([
    'success' => true,
    'pendingProjects' => $pendingCount,
    'completedProjects' => $completedCount,
    'totalProjects' => $totalCount,
]);

$conn->close();
