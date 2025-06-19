// Chargment du DOM
document.addEventListener('DOMContentLoaded', function() {

    // On récupère les éléments HTML avec lesquels on va interagir.
    const form = document.getElementById('add-employee-form');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const positionInput = document.getElementById('position');
    const employeeListContainer = document.getElementById('employee-list-container');
    const errorMessage = document.getElementById('error-message');

    // recuperation de la liste des employés depuis le localStorage
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    

    // Fonction pour sauvegarder la liste des employés dans le localStorage
    function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    // affichage de la liste des employés
    function renderEmployees() {
        // On vide d'abord le conteneur pour éviter les doublons à chaque ajout.
        employeeListContainer.innerHTML = '';
        
        
        if (employees.length === 0) {
            employeeListContainer.innerHTML = '<p>Aucun employé dans l\'annuaire pour le moment.</p>';
            return; 
        }

        
        employees.forEach(function(employee) {
            // Création d'un nouvel élément <div> pour la carte de l'employé
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.setAttribute('data-id', employee.id); // pour identifier de maniere unique un employé

            // Remplissage de la carte avec les informations de l'employé
            card.innerHTML = `
                <div class="employee-info">
                    <h3>${employee.firstName} ${employee.lastName}</h3>
                    <p><strong>Poste :</strong> ${employee.position}</p>
                    <p><strong>Email :</strong> <a href="mailto:${employee.email}" class="email">${employee.email}</a></p>
                </div>
                <button class="btn-delete">Supprimer</button>
            `;

            // Ajout de la carte au conteneur dans le HTML
            employeeListContainer.appendChild(card);
        });
    }
    function addEmployee(event) {
        // Empêche le comportement par défaut du formulaire (qui est de recharger la page)
        event.preventDefault();

        // Récupération et nettoyage des valeurs des champs
        const lastName = lastNameInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const email = emailInput.value.trim();
        const position = positionInput.value.trim();
        
        // Validation simple des champs
        if (!lastName || !firstName || !email || !position) {
            errorMessage.textContent = 'Erreur : Tous les champs sont obligatoires.';
            return; // 
        }

        // Validation du format de l'email avec une expression régulière simple (utilisation de l'IA ici)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage.textContent = 'Erreur : Le format de l\'email est invalide.';
            return;
        }

        // Création d'un nouvel objet employé
        const newEmployee = {
          
            id: Date.now(), // aidee par l'IA pour trouver un moyen de generer aleatoirement un id
            lastName: lastName,
            firstName: firstName,
            email: email,
            position: position
        };

        // Ajout du nouvel employé au tableau
        employees.push(newEmployee);

        // Sauvegarde dans le localStorage et rafraîchissement de l'affichage
        saveEmployees();
        renderEmployees();

        // Réinitialisation du formulaire et du message d'erreur
        form.reset();
        errorMessage.textContent = '';
    }

    
    
     
    function RemoveEmployee(event) {
        // On vérifie si l'élément cliqué est bien un bouton de suppression
        if (event.target.classList.contains('btn-delete')) {
            // On récupère la carte parente du bouton pour trouver l'ID de l'employé
            const card = event.target.closest('.employee-card');
            const employeeId = Number(card.dataset.id);

            // On filtre le tableau pour ne garder que les employés dont l'ID est
            // différent de celui que l'on veut supprimer.
            employees = employees.filter(function(employee) {
                return employee.id !== employeeId;
            });

            // Sauvegarde et Mise a jour de l'affichage
            saveEmployees();
            renderEmployees();
        }
    }



    // On attache la fonction addEmployee à l'événement 'submit' du formulaire.
    form.addEventListener('submit', addEmployee);
    
    // On attache un seul écouteur sur le conteneur de la liste.
    employeeListContainer.addEventListener('click', RemoveEmployee);


   
    // Au chargement de la page, on affiche la liste des employés sauvegardés.
    renderEmployees();

});
