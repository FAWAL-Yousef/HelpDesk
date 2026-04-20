<?php
require "db_connect.php"; // 👈 ton fichier de connexion

$email = $_POST["email"];
$objet = $_POST["objet"];
$message = $_POST["message"];

try {

    // 🧱 INSERT en base
    $sql = "INSERT INTO tickets (email, objet, message) 
            VALUES (:email, :objet, :message)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":email" => $email,
        ":objet" => $objet,
        ":message" => $message
    ]);

    // email de confirmation
    $subject = "Ticket reçu";
    $body = "Bonjour,\n\nVotre ticket a bien été enregistré.\n\nObjet : $objet";

    mail($email, $subject, $body);

    echo "Ticket envoyé avec succès 👍";

} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage();
}
?>