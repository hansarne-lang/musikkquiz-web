/* ---------------------------------------------------------------------------
   Felles horisontal meny med nedtrekk. Tegnes av seg selv nar fila lastes, sa
   en side trenger bare de to linjene i <head>:

     <link rel="stylesheet" href="meny.css">
     <script src="meny.js" defer></script>

   Vil siden ha den korte lagmenyen i stedet for hele staben, settes
   data-meny="lag" pa <body>. hovedskjerm.html har ingen meny i det hele tatt
   (AVVIK-058) og skal derfor ikke laste denne fila.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var GRUPPER_FULL = [
    { navn: 'Kvelden', punkter: [
      { url: 'index.html', tekst: 'Oversikt', under: 'Startpunktet med QR og lenker' },
      { url: 'kjoreplan.html', tekst: 'Kjøreplan', under: 'Hele kvelden på ett ark' },
      { skille: true },
      { url: 'styre.html', tekst: 'Styring / Admin', under: 'Fasit, poeng, trekning og lykkehjul' },
      { url: 'hovedskjerm.html', tekst: 'Storskjerm', under: 'Bildet publikum ser' }
    ] },
    { navn: 'Resultater', punkter: [
      { url: 'stilling.html', tekst: 'Stilling', under: 'Tabellene for begge divisjoner' },
      { url: 'historikk.html', tekst: 'Historikk', under: 'Tidligere kvelder og sesonger' }
    ] },
    { navn: 'Lag', punkter: [
      { url: 'registrer.html', tekst: 'Påmelding', under: 'Lagene melder seg på selv' },
      { url: 'lag.html', tekst: 'Lagside', under: 'Slik ser lagene svarskjemaet' },
      { url: 'buzzertest.html', tekst: 'Buzzertest', under: 'Prøv buzzeren før start' }
    ] },
    { navn: 'Bilder', punkter: [
      { url: 'bilder.html', tekst: 'Klubbilder', under: 'Logoene som vises på skjermen' },
      { url: 'bildeadmin.html', tekst: 'Bildeadmin', under: 'Last opp og beskjær' }
    ] },
    { navn: 'Verktøy', punkter: [
      { url: 'veiledning.html', tekst: 'Veiledning', under: 'Hvordan kvelden kjøres' },
      { url: 'avvik.html', tekst: 'Avvik', under: 'Feil som er funnet og rettet' },
      { skille: true },
      { url: 'test_regresjon.html', tekst: 'Avviksregresjon', under: 'Kjør etter hver opplasting' },
      { url: 'test_utvidet.html', tekst: 'Utvidet testverktøy', under: null },
      { url: 'test.html', tekst: 'Testverktøy', under: null },
      { url: 'test_avvik.html', tekst: 'Corner case 1', under: null },
      { url: 'test_avvik2.html', tekst: 'Corner case 2', under: null },
      { url: 'test_avvik3.html', tekst: 'Corner case 3', under: null }
    ] }
  ];

  // Lagsidene apnes pa lagenes egne telefoner. De skal ikke ha en vei inn i
  // styringspanelet - verken ved et uhell eller med vilje.
  var GRUPPER_LAG = [
    { navn: 'Laget', punkter: [
      { url: 'lag.html', tekst: 'Svarskjema', under: 'Send inn svarene deres' },
      { url: 'registrer.html', tekst: 'Påmelding', under: 'Meld på laget' },
      { url: 'buzzertest.html', tekst: 'Buzzertest', under: 'Prøv buzzeren' }
    ] },
    { navn: 'Kvelden', punkter: [
      { url: 'stilling.html', tekst: 'Stilling', under: 'Hvordan ligger vi an?' },
      { url: 'veiledning.html', tekst: 'Veiledning', under: 'Reglene kort forklart' }
    ] }
  ];

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function naavaerendeSide() {
    var f = (location.pathname.split('/').pop() || 'index.html');
    return f.toLowerCase() || 'index.html';
  }

  function bygg() {
    if (document.getElementById('hovedmeny')) { return; }
    var profil = (document.body.getAttribute('data-meny') || 'full').toLowerCase();
    var grupper = profil === 'lag' ? GRUPPER_LAG : GRUPPER_FULL;
    var her = naavaerendeSide();

    var h = '<div class="meny-inner"><div class="meny-merke">MUSIKK<span>QUIZ</span></div>';
    grupper.forEach(function (g, gi) {
      var aktivGruppe = g.punkter.some(function (p) { return p.url && p.url.toLowerCase() === her; });
      h += '<div class="meny-punkt' + (aktivGruppe ? ' aktiv' : '') + '" data-i="' + gi + '">';
      h += '<button type="button" class="meny-topp" aria-haspopup="true" aria-expanded="false">' +
           esc(g.navn) + '<span class="pil">&#9660;</span></button>';
      h += '<div class="meny-under" role="menu">';
      g.punkter.forEach(function (p) {
        if (p.skille) { h += '<div class="skille"></div>'; return; }
        var erHer = p.url.toLowerCase() === her;
        h += '<a role="menuitem" href="' + esc(p.url) + '"' + (erHer ? ' class="aktiv" aria-current="page"' : '') + '>' +
             esc(p.tekst) + (p.under ? '<span class="und">' + esc(p.under) + '</span>' : '') + '</a>';
      });
      h += '</div></div>';
    });
    h += '</div>';

    var nav = document.createElement('nav');
    nav.id = 'hovedmeny';
    nav.setAttribute('aria-label', 'Hovedmeny');
    nav.innerHTML = h;
    document.body.insertBefore(nav, document.body.firstChild);

    function lukkAlle(unntatt) {
      nav.querySelectorAll('.meny-punkt.apen').forEach(function (el) {
        if (el === unntatt) { return; }
        el.classList.remove('apen');
        var b = el.querySelector('.meny-topp');
        if (b) { b.setAttribute('aria-expanded', 'false'); }
      });
    }

    nav.querySelectorAll('.meny-punkt').forEach(function (punkt) {
      var knapp = punkt.querySelector('.meny-topp');
      knapp.addEventListener('click', function (e) {
        e.stopPropagation();
        var var_apen = punkt.classList.contains('apen');
        lukkAlle();
        if (!var_apen) {
          punkt.classList.add('apen');
          knapp.setAttribute('aria-expanded', 'true');
        }
      });
      // Har brukeren allerede apnet en meny, folger den musa videre - da slipper
      // man a klikke seg gjennom hver eneste gruppe.
      punkt.addEventListener('mouseenter', function () {
        if (!nav.querySelector('.meny-punkt.apen')) { return; }
        lukkAlle(punkt);
        punkt.classList.add('apen');
        knapp.setAttribute('aria-expanded', 'true');
      });
    });

    document.addEventListener('click', function () { lukkAlle(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { lukkAlle(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bygg);
  } else {
    bygg();
  }
})();
