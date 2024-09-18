<?php
// Start the session
session_start();

// Connect to the database
$conn = new mysqli("localhost", "root", "", "music_app_db");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare and execute the query to check the credentials
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $hashed_password);
        $stmt->fetch();

        // Verify the password
        if (password_verify($password, $hashed_password)) {
            // Password is correct, start the session and redirect to the music app
            $_SESSION['user_id'] = $user_id; // Save user ID in the session

            // Redirect to the music app's main page
            header("Location: ../musicapp/index.php");
            exit();
        } else {
            // Invalid password
            echo "Incorrect password.";
        }
    } else {
        // No user found with that username
        echo "No user found with that username.";
    }

    $stmt->close();
}

$conn->close();
?>
