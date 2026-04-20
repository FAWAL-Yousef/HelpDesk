<?php
$host = 'sql300.infinityfree.com'; 
$dbname = 'if0_41635576_base';
$user = 'if0_41635576';
$pass = 'YASetudiant';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    // On active les erreurs pour debugger plus facilement
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}