const fs = require("fs");
const fetch = require("node-fetch");

const API_KEY = "pub_761284b4453e321120b9f74f9ab6932636d0e";
const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=dz&language=fr&category=top`;

async function getNews() {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    if (!data.results) throw new Error("Pas de résultats");

    const presse_algerienne = [];
    const presse_etrangere = {};

    data.results.slice(0, 20).forEach(item => {
      const article = {
        title: item.title,
        url: item.link,
        date: item.pubDate?.split(" ")[0],
        source: item.source_id || "inconnu",
        country: item.country || "inconnu"
      };

      if (["tsa-algerie", "elwatan", "aps", "algerie360", "dzfoot", "algerie-eco"].includes(item.source_id)) {
        presse_algerienne.push(article);
      } else {
        const pays = item.country || "Autre";
        if (!presse_etrangere[pays]) presse_etrangere[pays] = [];
        presse_etrangere[pays].push(article);
      }
    });

    const json = { date: new Date().toISOString(), presse_algerienne, presse_etrangere };
    fs.writeFileSync("actus.json", JSON.stringify(json, null, 2));
    console.log("✅ Fichier actus.json généré avec succès !");
  } catch (err) {
    console.error("❌ Erreur :", err);
  }
}

getNews();
