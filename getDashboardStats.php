<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$host = 'localhost';
$db = 'employee_management';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'DB Connection failed: '.$e->getMessage()]);
  exit;
}

try {
  // Count all users
  $userCountStmt = $pdo->query("SELECT COUNT(*) AS user_count FROM users");
  $userCount = $userCountStmt->fetch()['user_count'];

  $projectCountStmt = $pdo->query("SELECT COUNT(*) AS project_count FROM projects");
  $projectCount = $projectCountStmt->fetch()['project_count'];

  echo json_encode([
    'success' => true,
    'employeeCount' => $userCount,
    'projectCount' => $projectCount
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Query failed: '.$e->getMessage()]);
}
?>
