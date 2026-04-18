<?php
session_start(); // Permet de garder l'utilisateur connecté sur les autres pages
require 'db_connect.php'; // Ton fichier avec les infos InfinityFree

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // 1. On cherche l'utilisateur dans la base
    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // 2. Vérification de l'existence et du mot de passe
    if ($user && password_verify($password, $user['password'])) {
        
        // On enregistre ses infos en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role']; // C'est ici qu'on récupère 'etudiant' ou 'tuteur'

        // 3. Redirection vers la page d'accueil
        // La page d'accueil utilisera $_SESSION['role'] pour adapter l'affichage
        header('Location: accueil.php');
        exit;
    } else {
        $erreur = "Email ou mot de passe incorrect.";
    }
}
?>



<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Helpdesk Cours</title>
    <link rel="stylesheet" href="Login.css">
</head>
<body>

    <a href="#" class="btn-back">&#8592;</a>

    <div class="login-wrapper">

        <div class="logo-container">
            <div class="logo-h">
                <img src="../AccountCreation/Student/Images/logo.png" alt="Helpdesk logo">
            </div>
            <p class="logo-title">Identification</p>
            <p class="logo-subtitle">Accès sécurisé Helpdesk Cours</p>
        </div>

        <div class="login-card">
            <form action="login.php" method="POST" id="form">
                <fieldset>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="nom@gmail.com" required>
                    </div>

                    <div class="form-group">
                        <div class="label-row">
                            <label for="password">Mot de passe</label>
                            <a href="#" class="forgot-pwd">Oubliée ?</a>
                        </div>
                        <div class="input-with-icon">
                            <input type="password" id="password" name="password" placeholder="••••••••" required>
                            <span class="eye-icon" onclick="togglePassword()">👁</span>
                        </div>
                    </div>

                    <div class="form-options">
                        <label class="switch">
                            <input type="checkbox" name="remember" checked>
                            <span class="slider round"></span>
                        </label>
                        <span class="switch-text">Rester connecté</span>
                    </div>

                    <button type="submit" class="btn-submit">
                        Se connecter <span class="arrow">→</span>
                    </button>

                </fieldset>
            </form>
        </div>

        <footer class="login-footer">
            <p>Besoin d'aide ? Contactez un tuteur.</p>
            <p>Pas de compte ? <a href="AccountCreation/CreationCompte.html">S'inscrire</a></p>
        </footer>
    </div>

    <script>
        function togglePassword() {
            const pwd = document.getElementById('password');
            pwd.type = pwd.type === 'password' ? 'text' : 'password';
        }
    </script>

</body>
</html>
