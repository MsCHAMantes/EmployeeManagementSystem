<?php
header("Access-Control-Allow-Origin: *");
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
  echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
  exit;
}

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $pdo->prepare("SELECT * FROM accounts WHERE user_id = :id");
    $stmt->execute(['id' => $id]);
    $account = $stmt->fetch();

    if ($account) {
        echo json_encode($account);
    } else {
        echo json_encode(['error' => 'Account not found']);
    }
} else {
    echo json_encode(['error' => 'Missing account ID']);
}
