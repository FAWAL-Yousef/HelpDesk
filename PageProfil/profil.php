<?php
session_start();
require_once 'db_connect.php';

// Si j'écris ?login=1 dans l'URL, je deviens Dorian. Si ?login=2, je deviens le Tuteur.
if (isset($_GET['login'])) {
    session_destroy(); // On vide l'ancien
    session_start();   // On recommence
    
    if ($_GET['login'] == '1') {
        $_SESSION['user_id'] = 1;
        $_SESSION['role'] = 'etudiant';
        $_SESSION['username'] = 'Dorian_Test';
        $_SESSION['email'] = 'dorian@test.com';
    } elseif ($_GET['login'] == '2') {
        $_SESSION['user_id'] = 2;
        $_SESSION['role'] = 'tuteur';
        $_SESSION['username'] = 'Tuteur_Pro';
        $_SESSION['email'] = 'tuteur@test.com';
    }

}
$user_id = $_SESSION['user_id'];


try {
    if ($_SESSION['role'] === 'tuteur') {
        //Tickets assignés
        $stmt_count = $pdo->prepare("SELECT COUNT(*) FROM tickets WHERE assigned_to = ?");
        $stmt_count->execute([$user_id]);
        $total_tickets = $stmt_count->fetchColumn();

        // Tickets résolus par ce tuteur
        $stmt_res = $pdo->prepare("SELECT COUNT(*) FROM tickets WHERE assigned_to = ? AND status = 'Résolu'");
        $stmt_res->execute([$user_id]);
        $resolved_tickets = $stmt_res->fetchColumn();

        // Historique (avec JOIN pour avoir le nom de l'étudiant)
        $stmt_history = $pdo->prepare("
            SELECT t.*, u.username AS author_name 
            FROM tickets t 
            JOIN users u ON t.author_id = u.id 
            WHERE t.assigned_to = ? 
            ORDER BY t.created_at DESC
        ");
        $stmt_history->execute([$user_id]);
        $ticket_history = $stmt_history->fetchAll();
    } else {
        // Logique Étudiant
        $stmt_count = $pdo->prepare("SELECT COUNT(*) FROM tickets WHERE author_id = ?");
        $stmt_count->execute([$user_id]);
        $total_tickets = $stmt_count->fetchColumn();

        $stmt_res = $pdo->prepare("SELECT COUNT(*) FROM tickets WHERE author_id = ? AND status = 'Résolu'");
        $stmt_res->execute([$user_id]);
        $resolved_tickets = $stmt_res->fetchColumn();
        
        $ticket_history = []; // Vide pour l'étudiant
    }
} catch (PDOException $e) {
    die("Erreur base de données : " . $e->getMessage());
}

//pour la modification du profil
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_update'])) {
    $new_user = htmlspecialchars($_POST['new_username']);
    $new_email = htmlspecialchars($_POST['new_email']);
    $user_id = $_SESSION['user_id'];

    try {
        // On prépare la requête de mise à jour
        $update = $pdo->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        $success = $update->execute([$new_user, $new_email, $user_id]);
        // Mise à jour de la session pour que le changement soit immédiat à l'écran
        if($success){
            $_SESSION['username'] = $new_user;
            $_SESSION['email'] = $new_email;
            $_SESSION['flash'] = "Profil mis à jour !"; 
            header("Location: profil.php");
            exit;
        }
    } catch (PDOException $e) {
        $error_msg = "Erreur lors de la mise à jour : " . $e->getMessage();
    }
}

?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title> Mon Profil - HelpDesk </title>
    <link rel="stylesheet" href="ticket.css">
    <link rel="stylesheet" href="profil.css">
</head>
<body class="profile-page">
    <header class="container">
        <a href="index.php" class="back-link">← Retour à l'accueil</a>
    </header>

    <main class="container profile-card">
        <section class="profile-header">
            <div class="avatar-circle">
                <?= strtoupper(substr($_SESSION['username'], 0, 1)) ?>
            </div>
            <div class="profile-info">
                <h1><?= htmlspecialchars($_SESSION['username']) ?></h1>
                <span class="badge_type"><?= ucfirst($_SESSION['role']) ?></span>
            </div>
        </section>

        <hr>

        <section class="profile-stats">
            <div class="stat-item">
                <span class="stat-number"><?= $total_tickets ?></span> <!-- nombre total de tickets -->
                <span class="stat-label">
                   <?=($_SESSION['role'] === 'tuteur') ? 'Tickets assignés' : 'Tickets crées' ?></span>
            </div>
            <div class="stat-item">
                <span class="stat-number"><?= $resolved_tickets ?></span>
                <span class="stat-label">Tickets résolus</span>
            </div>
        </section>


        <!-- Affichage de l'historique des tickets pour les tuteurs -->
        <?php if ($_SESSION['role'] === 'tuteur' && !empty($ticket_history)): ?>
    <section class="profile-history">

        <button type="button" class = "collapsible" onclick="toggleHistory()">
            Historique des tickets (<?= count($ticket_history) ?>)
            <span id ="arrow"> <> </span>
        </button>
          
        <div id="history-content" class="content-hidden">

        <table class="history-table">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Statut</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($ticket_history as $ticket): ?>
                <tr>
                    <td>
                        <a href="ticket.php?id=<?= $ticket['id'] ?>">
                            <?= htmlspecialchars($ticket['title']) ?>
                        </a>
                    </td>
                    <td><?= htmlspecialchars($ticket['author_name']) ?></td>
                    <td>
                        <span class="badge_statut-<?= strtolower($ticket['status']) ?>">
                            <?= $ticket['status'] ?>
                        </span>
                    </td>
                    <td><?= date('d/m/Y', strtotime($ticket['created_at'])) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        </div>

    </section>
<?php endif; ?>

       <section class="profile-details">
    <h3>Informations du compte</h3>
    <ul>
        <li><strong>Nom d'utilisateur :</strong> <?= htmlspecialchars($_SESSION['username']) ?></li>
        <li><strong>Email :</strong> <?= htmlspecialchars($_SESSION['email']) ?></li>
        <li><strong>Membre depuis :</strong> 
        <?php 
            if (!empty($user_data['created_at'])) {
                echo date('d/m/Y', strtotime($user_data['created_at']));
            } else {
                echo "15/04/2026";
            }
            ?> 
            </li>
    </ul>
   
    <!-- ici je veux afficher le messsage de succes ou d'erreur après la mise à jour du profil -->
    <?php if (isset($_SESSION['flash'])): ?>
    <p class="success-msg"><?= htmlspecialchars($_SESSION['flash']) ?></p>
        <?php unset($_SESSION['flash']); // On supprime le message après l'avoir affiché ?>
    <?php endif; ?>

    <?php if (isset($error_msg)): ?>
        <p class="error-msg"><?= htmlspecialchars($error_msg) ?></p>
    <?php endif; ?>

</section>
        <section class="profile-actions">
        <button type="button" class="btn-edit" onclick="toggleEditForm()">Modifier mes informations</button>
      
        <div id="container-form" style="display:none; margin-top: 20px;" class="profile-details">
        <h3>Mettre à jour mon profil</h3>
        <form action="profil.php" method="POST">
            <div class="form-group">
                <label>Nouveau nom d'utilisateur :</label>
            <input type="text" name="new_username" value="<?= htmlspecialchars($_SESSION['username']) ?>" required>
        </div>
        
        <div class="form-group">
            <label>Nouvel Email :</label>
            <input type="email" name="new_email" placeholder="exemple@mail.com">
        </div>

       <div class="form-actions">
            <button type="submit" name="submit_update" class="btn-submit">
                Enregistrer les modifications
            </button>
            
            <button type="button" class="btn-cancel" onclick="toggleEditForm()">
                Annuler
            </button>
        </div>

        </form>
        </div>
            <a href="logout.php" class="btn-logout" style="color:red; margin-top:20px; display:block;">Se déconnecter</a>
        </section>
    </main>

    <script src="profil.js"></script>
</body>

</html>

