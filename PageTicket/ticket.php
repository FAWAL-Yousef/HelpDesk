<?php
session_start();
require_once 'db_connect.php';

// pour tester,on tape:ticket.php?id=1&login=1(Dorian) ou ?login=2 (Tuteur)
if (isset($_GET['login'])) {
    session_unset(); // On vide les variables actuelles
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

// Sécurité : Si aucune session n'est active (ni test, ni login réel), on force un utilisateur
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; 
    $_SESSION['role'] = 'etudiant';
    $_SESSION['username'] = 'Dorian_Test';
}

$user_id = $_SESSION['user_id'];
// Récupération du ticket
$id = $_GET['id'] ?? null;
if (!$id) { die("Aucun identifiant de ticket fourni."); }

$stmt = $pdo->prepare("SELECT * FROM tickets WHERE id = ?");
$stmt->execute([$id]);
$ticket = $stmt->fetch();

if (!$ticket) { die("Ticket introuvable."); }

// Vérification d'accès 
if ($_SESSION['role'] === 'etudiant' && $ticket['author_id'] != $_SESSION['user_id']) {
    die("Erreur : Vous n'avez pas l'autorisation de consulter ce ticket.");
}

// Traitement du changement de STATUT (Action Tuteur) 
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['update_status'])) {
    $nouveau_statut = $_POST['nouveau_statut'];
    $upd = $pdo->prepare("UPDATE tickets SET status = ? WHERE id = ?");
    $upd->execute([$nouveau_statut, $id]);
    header("Location: ticket.php?id=" . $id);
    exit;
}

// Traitement du COMMENTAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['nouveau_commentaire'])) {
    $message = htmlspecialchars($_POST['message']); // Protection XSS 
    if (!empty($message)) {
        $insert = $pdo->prepare("INSERT INTO comments (ticket_id, author_id, message) VALUES (?, ?, ?)");
        $insert->execute([$id, $_SESSION['user_id'], $message]);
        header("Location: ticket.php?id=" . $id);
        exit;
    }
}

// 6. Récupération des commentaires pour l'affichage
$stmt_comments = $pdo->prepare("
    SELECT c.*, u.username, u.role 
    FROM comments c 
    JOIN users u ON c.author_id = u.id 
    WHERE c.ticket_id = ?
    ORDER BY c.created_at ASC
");
$stmt_comments->execute([$id]);
$comments = $stmt_comments->fetchAll();

?>



<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Support - Ticket #<?= htmlspecialchars($id) ?></title>
    <link rel="stylesheet" href="ticket.css">
</head>
<body>
    <header class="main-header">
    <div class="container header-content">
        <img src="logo.jpeg" alt="HelpDesk Logo" class="logo">
        <div class="header-text">
            <a href="index.php" class="back-link">← Retour aux tickets</a>
            <h1>Ticket #<?= $id ?></h1>
        </div>
    </div>
</header>

    <main class="container">
        <article class="haut_ticket">

            <div class="ticket_id"> ID Ticket: <?= htmlspecialchars($id) ?></div>

            <h1><?= htmlspecialchars($ticket['title']) ?></h1> <!--ici on affiche le titre du ticket venant de la base de données-->
            
            <div class="auteur_ticket">
                <span>Posté par : <strong><?= htmlspecialchars($ticket['author_username'] ?? 'Étudiant') ?> .</strong></span> <!--ici le ?? signifie que si 'author_username' n'existe pas, on affiche 'Étudiant' par défaut-->
                <span>Date de création : le <strong><?= date('d/m/Y', strtotime($ticket['created_at'])) ?></strong></span>
            </div>

            <div class="ticket-badge">
                <span class="badge_type">TYPE : <?= htmlspecialchars($ticket['category']) ?></span> 
                <span class="badge_priorite-<?= strtolower($ticket['priority']) ?>">PRIORITÉ : <?= htmlspecialchars($ticket['priority']) ?></span><!--ici on ajoute une classe CSS dynamique pour la priorité (ex: badge_priorite-haute, etc.)-->
                <span class="badge_statut-<?= str_replace(' ', '-', strtolower($ticket['status'])) ?>">STATUT: <?= htmlspecialchars($ticket['status']) ?></span><!--on remplace les espaces par des tirets pour créer une classe CSS valide (ex: badge_statut-en-cours)-->
            </div>
        </article>

        <section class="content_ticket">
            <h3> Description du problème </h3>
            <div class="description_ticket">
                <?= nl2br(htmlspecialchars($ticket['description'])) ?> <!--nl2br() convertit les sauts de ligne en balises <br> pour une meilleure lisibilité dans le navigateur-->
            </div>
        </section>

    
        <?php if ($_SESSION['role'] === 'tuteur'): ?>
        <section class="tuteur_actions">
            <form method="POST">
                <label> Modifier l'état du ticket :</label>
                <select name="nouveau_statut"> <!-- ceci cree un menu déroulant -->
                    <option value="Ouvert" <?= $ticket['status'] == 'Ouvert' ? 'selected' : '' ?>>Ouvert</option>
                    <option value="En cours" <?= $ticket['status'] == 'En cours' ? 'selected' : '' ?>>En cours</option>
                    <option value="Résolu" <?= $ticket['status'] == 'Résolu' ? 'selected' : '' ?>>Résolu</option>
                </select>
                <button type="submit" name="update_status">Mettre à jour le statut</button>
            </form>
        </section>
        <?php endif; ?>



        <section class="comments_section">
            <h2>Échanges et Commentaires</h2>
            
            <div class="comments-list">
                <?php if (empty($comments)): ?>
                    <p class="no_comment"> Aucun échange (commentaire) pour le moment.</p>
                <?php else: ?>
                    <?php foreach ($comments as $com): ?>
                        <div class="comment <?= ($com['role'] === 'tuteur') ? 'comment-tuteur' : '' ?>"> <!--une classe CSS spéciale pour les commentaires des tuteurs-->
                            <div class="comment_header">
                                <strong><?= htmlspecialchars($com['username']) ?></strong>
                                <span>le <?= date('d/m/Y à H:i', strtotime($com['created_at'])) ?></span>
                            </div>
                            <p><?= nl2br(htmlspecialchars($com['message'])) ?></p>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <form method="POST" class="comment-form">
                <textarea name="message" required placeholder="Répondre à ce commentaire..." rows="3"></textarea>
                <button type="submit" name="nouveau_commentaire"> Envoi du message</button>
            </form>
        </section>

    </main>
</body>
</html>