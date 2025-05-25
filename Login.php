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
} catch (\PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Database connection failed: '.$e->getMessage()]);
  exit;
}

$username = $_POST['id'] ?? '';
$password = $_POST['pw'] ?? '';

if (empty($username) || empty($password)) {
  echo json_encode(['success' => false, 'error' => 'Username and password required']);
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user) {
  $verify = $password === $user['password']; // You should ideally use password_verify here if passwords are hashed

  if ($verify) {
    // Insert into activity_logs
    $logSql = "INSERT INTO activity_logs (user_id, action, timestamp) VALUES (?, ?, NOW())";
    $logStmt = $pdo->prepare($logSql);
    $action = 'logged in';
    $logStmt->execute([$user['id'], $action]);

    echo json_encode([
      'success' => true,
      'role' => $user['role'],
      'username' => $user['username']
    ]);
  } else {
    echo json_encode([
      'input_password' => $password,
      'stored_hash' => $user['password'],
      'is_hashed' => password_get_info($user['password']),
    ]);
  }
} else {
  echo json_encode([
    'success' => false,
    'error' => 'User not found'
  ]);
}
?>
