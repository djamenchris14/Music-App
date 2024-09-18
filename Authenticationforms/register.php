<?php
include 'db_connection.php'; // To include database connection.

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Check if the email already exists
    $query = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $query->bind_param('s', $email);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        echo "Email already in use.";
    } else {
        // Insert the new user into the database
        $query = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $query->bind_param('sss', $username, $email, $password);
        if ($query->execute()) {
            echo "Registration successful. You can now log in.";
        } else {
            echo "Error: " . $query->error;
        }
    }
}
?>
