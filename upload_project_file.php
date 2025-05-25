<?php
include 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_FILES['project_file']) || !isset($_POST['project_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing file or project ID']);
    exit;
}

$projectId = $_POST['project_id'];
$file = $_FILES['project_file'];
$uploadDir = "uploads/";

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$targetPath = $uploadDir . basename($file['name']);
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Mark project as completed
    $stmt = $conn->prepare("UPDATE projects SET status='completed' WHERE id=?");
    $stmt->bind_param("i", $projectId);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'File uploaded and project marked completed.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
}
?>
