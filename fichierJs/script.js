// Variable pour suivre l'état de la liste
let lignesVisibles = false; 

document.querySelector(".custom-button").addEventListener("click", function () {
    const listelignes = document.querySelector("#lineListe");
    const loader = document.querySelector("#loader");

    if (!lignesVisibles) {
        // Si les lignes ne sont pas visibles, on les charge et on les affiche

        // Affiche le loader pendant le chargement des données
        loader.style.display = "flex"; 
        const x = new XMLHttpRequest();

        x.open("GET","https://corsproxy.io/?https://api.tisseo.fr/v2/lines.json?key=a3732a1074e2403ce364ad6e71eb998cb"); 
        
        x.onreadystatechange = function () { 
            if (x.readyState === 4 && x.status === 200) {

                // Cache le loader une fois les données chargées
                loader.style.display = "none"; 
                const reponse = JSON.parse(x.responseText); 

                // Réinitialisation du contenu de la liste pour éviter les doublons
                listelignes.innerHTML = ""; 
                
                reponse.lines.line.forEach(line => {
                    // Création d'un élément <li> pour chaque ligne
                    const li = document.createElement("li"); 
                    li.textContent = `Ligne ${line.shortName} ( ${line.name} )`;
                    li.addEventListener("click", function(){
                        chargerArrets(line.id, li);
                    });

                    // Ajout de l'élément <li> à la liste des lignes
                    listelignes.appendChild(li);
                });

                // Met à jour l'état pour indiquer que les lignes sont maintenant visibles
                lignesVisibles = true; 
                // Affiche la liste des lignes
                listelignes.style.display = "block"; 
            }
        }
        x.send();
    } else {
        // Si les lignes sont déjà visibles, on les masque
        listelignes.style.display = "none";
        lignesVisibles = false;
    }
});

// Fonction pour récupérer et afficher les arrêts d'une ligne spécifique
function chargerArrets(idLigne, liLigne) {
    const xhr = new XMLHttpRequest(); 
    
    xhr.open("GET",`https://corsproxy.io/?https://api.tisseo.fr/v2/stop_points.json?key=a3732a1074e2403ce364ad6e71eb998cb&lineId=${idLigne}`);

    xhr.onreadystatechange = function () {  
        if (xhr.readyState === 4 && xhr.status === 200) {
            const reponse = JSON.parse(xhr.responseText); 

            // Suppression de l'ancienne liste d'arrêts si elle existe
            const ancienneListe = liLigne.querySelector("ul");
            if (ancienneListe) ancienneListe.remove();

            const ul = document.createElement("ul");

            // Utilisation d'un Set pour éviter les doublons d'arrêts

            // Crée un ensemble pour stocker les noms uniques des arrêts.
            const uniqueStopArea = new Set(); 
            
            // Crée un tableau pour stocker les objets d'arrêts uniques.
            const uniqueStops = [];             

            // Parcours de chaque arrêt dans la réponse
            reponse.physicalStops.physicalStop.forEach(stopArea => {
                if (!uniqueStopArea.has(stopArea.name)) {
                    uniqueStopArea.add(stopArea.name);
                    uniqueStops.push(stopArea);
                }
            });

            // Affichage des arrêts uniques dans la liste
            uniqueStops.forEach(stopArea => {
                const li = document.createElement("li");
                li.textContent = stopArea.name;
                ul.appendChild(li);
            });


            // Ajout de la liste des arrêts à l'élément <li> de la ligne
            liLigne.appendChild(ul);
        }
    };

    xhr.send();
}