"use client";

import { useEffect, useState } from "react";
import {
  Bell, BellRing, BookOpen, ChevronRight, CloudSun, Coffee, Compass, Cross,
  ExternalLink, HeartPulse, Home, Languages, MapPin, Menu, MessageCircle,
  Pencil, Phone, Search, Settings, ShoppingBag, Sparkles, Star, Sun, Waves,
  Wifi, X, Check, CalendarDays, Clock3, Users, Upload, Palette, Save, Plus,
  Trash2, Eye, LoaderCircle,
  FileText, Globe2, Navigation, ListPlus,
} from "lucide-react";

type Modal = "restaurant" | "spa" | "feedback" | "editor" | "guide" | "category" | "privacy" | "imprint" | "weather" | null;

type Listing = { id: string; title: string; description: string; address: string; phone: string; link: string; linkLabel: string; image: string; brochure: string };
type CategoryDocument = { id: string; title: string; url: string };
type Category = { id: string; title: string; subtitle: string; tone: string; action: Modal; visible: boolean; items: Listing[]; documents: CategoryDocument[] };
type SiteData = { hotelName: string; brandSubtitle: string; accent: string; heroEyebrow: string; heroTitle: string; heroText: string; heroImage: string; heroImages: string[]; location: string; privacyText: string; imprintText: string; geofenceEnabled: boolean; propertyAddress: string; propertyLatitude: number; propertyLongitude: number; geofenceRadius: number; categories: Category[] };

const categoryIcons = [Home, Coffee, Compass, Waves, HeartPulse, ShoppingBag, MapPin, Cross];
const defaultData: SiteData = {
  hotelName: "BERGLUFT", brandSubtitle: "CHALET & SPA", accent: "#315c4c", heroEyebrow: "Willkommen in den Bergen",
  heroTitle: "Schön, dass\nSie da sind.", heroText: "Alles, was Ihren Aufenthalt besonders macht – an einem Ort.",
  heroImage: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=2200&q=88", heroImages: [], location: "Oberstdorf",
  privacyText: "Hier können Sie Ihre vollständigen Datenschutzhinweise eintragen.",
  imprintText: "Hier können Sie die Angaben zum Betreiber, die Anschrift und die Kontaktdaten eintragen.",
  geofenceEnabled: false, propertyAddress: "", propertyLatitude: 0, propertyLongitude: 0, geofenceRadius: 100,
  categories: [
    { id: "stay", title: "Ihre Unterkunft", subtitle: "Alles für einen entspannten Aufenthalt", tone: "sand", action: "guide", visible: true, items: [], documents: [] },
    { id: "food", title: "Essen & Trinken", subtitle: "Restaurants, Cafés & regionale Küche", tone: "clay", action: null, visible: true, items: [{ id:"alpengruen", title:"Alpengrün", description:"Alpine Küche. Neu gedacht.", address:"Marktplatz 8, Oberstdorf", phone:"+49 8322 12345", link:"https://example.com", linkLabel:"Tisch reservieren", image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85", brochure:"" }], documents: [] },
    { id: "explore", title: "Erleben & Entdecken", subtitle: "Unsere Lieblingsorte in der Region", tone: "sage", action: null, visible: true, items: [{ id:"nebelhorn", title:"Nebelhorn", description:"Panoramablicke, Wanderwege und Bergbahnerlebnis auf 2.224 Metern.", address:"Nebelhornstraße 67, Oberstdorf", phone:"", link:"https://www.ok-bergbahnen.com", linkLabel:"Ausflugsziel öffnen", image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85", brochure:"" }], documents: [] },
    { id: "wellness", title: "Wellness & Wasser", subtitle: "Spa, Sauna & Schwimmmöglichkeiten", tone: "blue", action: null, visible: true, items: [{ id:"spa", title:"Bergquell Spa", description:"Massagen, Anwendungen und Day-Spa in ruhiger Atmosphäre.", address:"Talstraße 12, Oberstdorf", phone:"+49 8322 9876", link:"https://example.com", linkLabel:"Behandlung buchen", image:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85", brochure:"" }], documents: [] },
    { id: "health", title: "Gesundheit", subtitle: "Ärzte, Apotheken & Notfallhilfe", tone: "rose", action: null, visible: true, items: [{ id:"arzt", title:"Ärztezentrum Oberstdorf", description:"Hausärztliche Versorgung und Bereitschaftsdienst.", address:"Trettachstraße 16, Oberstdorf", phone:"+49 8322 116117", link:"https://www.116117.de", linkLabel:"Website öffnen", image:"", brochure:"" }], documents: [] },
    { id: "shopping", title: "Einkaufen", subtitle: "Supermärkte, Boutiquen & Wochenmarkt", tone: "ochre", action: null, visible: true, items: [{ id:"markt", title:"Allgäuer Wochenmarkt", description:"Regionale Produkte, Käse, Brot und Handwerk.", address:"Marktplatz, Oberstdorf", phone:"", link:"https://example.com", linkLabel:"Mehr erfahren", image:"", brochure:"" }], documents: [] },
  ],
};

const translations: Record<string, { welcome:string; hero:string; intro:string; discover:string; sunny:string; overview:string; categories:Record<string,[string,string]>; recommendation:string; reserve:string; spaTime:string; book:string; delivery:string; deliveryTitle:string; deliveryText:string; deliveryOpen:string; guides:string; guidesTitle:string; guidesText:string; allGuides:string; feedbackTitle:string; feedbackText:string; feedback:string; edit:string; search:string }> = {
  DE:{welcome:"Willkommen in den Bergen",hero:"Schön, dass\nSie da sind.",intro:"Alles, was Ihren Aufenthalt besonders macht – an einem Ort.",discover:"Aufenthalt entdecken",sunny:"Sonnig",overview:"Ihr Aufenthalt auf einen Blick",recommendation:"Unsere Empfehlung",reserve:"Tisch reservieren",spaTime:"Zeit für Sie",book:"Behandlung buchen",delivery:"Lieferservice",deliveryTitle:"Lieblingsessen bis an die Tür.",deliveryText:"Restaurants in Ihrer Nähe entdecken und direkt bestellen.",deliveryOpen:"Lieferando öffnen",guides:"Einfach erklärt",guidesTitle:"Alles im Griff.",guidesText:"Kurzanleitungen für alle technischen Geräte in Ihrer Unterkunft – verständlich und jederzeit griffbereit.",allGuides:"Alle Anleitungen",feedbackTitle:"Wie gefällt es Ihnen bei uns?",feedbackText:"Ihr Feedback hilft uns, Ihren Aufenthalt noch schöner zu machen.",feedback:"Quick Feedback",edit:"Inhalte bearbeiten",search:"Suchen",categories:{stay:["Ihre Unterkunft","Alles für einen entspannten Aufenthalt"],food:["Essen & Trinken","Restaurants, Cafés & regionale Küche"],explore:["Erleben & Entdecken","Unsere Lieblingsorte in der Region"],wellness:["Wellness & Wasser","Spa, Sauna & Schwimmmöglichkeiten"],health:["Gesundheit","Ärzte, Apotheken & Notfallhilfe"],shopping:["Einkaufen","Supermärkte, Boutiquen & Wochenmarkt"]}},
  EN:{welcome:"Welcome to the mountains",hero:"We're delighted\nto have you.",intro:"Everything that makes your stay special – all in one place.",discover:"Explore your stay",sunny:"Sunny",overview:"Your stay at a glance",recommendation:"Our recommendation",reserve:"Reserve a table",spaTime:"Time for you",book:"Book treatment",delivery:"Delivery service",deliveryTitle:"Your favourite food, delivered.",deliveryText:"Discover nearby restaurants and order directly.",deliveryOpen:"Open Lieferando",guides:"Simply explained",guidesTitle:"Everything under control.",guidesText:"Quick guides for all appliances in your accommodation – clear and always at hand.",allGuides:"All guides",feedbackTitle:"How are you enjoying your stay?",feedbackText:"Your feedback helps us make your stay even better.",feedback:"Quick feedback",edit:"Edit content",search:"Search",categories:{stay:["Your accommodation","Everything for a relaxing stay"],food:["Food & drink","Restaurants, cafés and local cuisine"],explore:["Explore & experience","Our favourite places in the region"],wellness:["Wellness & water","Spas, saunas and swimming"],health:["Health","Doctors, pharmacies and emergency help"],shopping:["Shopping","Supermarkets, boutiques and markets"]}},
  FR:{welcome:"Bienvenue à la montagne",hero:"Nous sommes ravis\nde vous accueillir.",intro:"Tout ce qui rend votre séjour unique, réuni en un seul endroit.",discover:"Découvrir le séjour",sunny:"Ensoleillé",overview:"Votre séjour en un coup d'œil",recommendation:"Notre recommandation",reserve:"Réserver une table",spaTime:"Un moment pour vous",book:"Réserver un soin",delivery:"Livraison",deliveryTitle:"Vos plats préférés livrés.",deliveryText:"Découvrez les restaurants à proximité et commandez directement.",deliveryOpen:"Ouvrir Lieferando",guides:"Simplement expliqué",guidesTitle:"Tout est sous contrôle.",guidesText:"Guides rapides pour les appareils de votre hébergement.",allGuides:"Tous les guides",feedbackTitle:"Comment se passe votre séjour ?",feedbackText:"Votre avis nous aide à améliorer votre séjour.",feedback:"Avis rapide",edit:"Modifier le contenu",search:"Rechercher",categories:{stay:["Votre hébergement","Tout pour un séjour reposant"],food:["Restaurants & boissons","Restaurants, cafés et cuisine régionale"],explore:["Découvrir & explorer","Nos lieux préférés dans la région"],wellness:["Bien-être & baignade","Spas, saunas et piscines"],health:["Santé","Médecins, pharmacies et urgences"],shopping:["Shopping","Supermarchés, boutiques et marchés"]}},
  IT:{welcome:"Benvenuti in montagna",hero:"Siamo felici\nche siate qui.",intro:"Tutto ciò che rende speciale il vostro soggiorno, in un unico luogo.",discover:"Scopri il soggiorno",sunny:"Soleggiato",overview:"Il soggiorno in breve",recommendation:"Il nostro consiglio",reserve:"Prenota un tavolo",spaTime:"Tempo per voi",book:"Prenota trattamento",delivery:"Consegna",deliveryTitle:"Il vostro cibo preferito a domicilio.",deliveryText:"Scoprite i ristoranti vicini e ordinate direttamente.",deliveryOpen:"Apri Lieferando",guides:"Spiegato semplicemente",guidesTitle:"Tutto sotto controllo.",guidesText:"Guide rapide per tutti gli apparecchi dell'alloggio.",allGuides:"Tutte le guide",feedbackTitle:"Come vi trovate?",feedbackText:"Il vostro feedback ci aiuta a migliorare il soggiorno.",feedback:"Feedback rapido",edit:"Modifica contenuti",search:"Cerca",categories:{stay:["Il vostro alloggio","Tutto per un soggiorno rilassante"],food:["Cibo & bevande","Ristoranti, caffè e cucina regionale"],explore:["Esperienze & scoperte","I nostri luoghi preferiti nella regione"],wellness:["Benessere & acqua","Spa, saune e piscine"],health:["Salute","Medici, farmacie ed emergenze"],shopping:["Shopping","Supermercati, boutique e mercati"]}},
  NL:{welcome:"Welkom in de bergen",hero:"Fijn dat u\ner bent.",intro:"Alles wat uw verblijf bijzonder maakt, op één plek.",discover:"Ontdek uw verblijf",sunny:"Zonnig",overview:"Uw verblijf in één oogopslag",recommendation:"Onze aanbeveling",reserve:"Tafel reserveren",spaTime:"Tijd voor uzelf",book:"Behandeling boeken",delivery:"Bezorgservice",deliveryTitle:"Uw favoriete eten aan de deur.",deliveryText:"Ontdek restaurants in de buurt en bestel direct.",deliveryOpen:"Open Lieferando",guides:"Eenvoudig uitgelegd",guidesTitle:"Alles onder controle.",guidesText:"Korte handleidingen voor alle apparaten in uw accommodatie.",allGuides:"Alle handleidingen",feedbackTitle:"Hoe bevalt uw verblijf?",feedbackText:"Uw feedback helpt ons uw verblijf nog beter te maken.",feedback:"Snelle feedback",edit:"Inhoud bewerken",search:"Zoeken",categories:{stay:["Uw accommodatie","Alles voor een ontspannen verblijf"],food:["Eten & drinken","Restaurants, cafés en regionale keuken"],explore:["Beleven & ontdekken","Onze favoriete plekken in de regio"],wellness:["Wellness & water","Spa's, sauna's en zwembaden"],health:["Gezondheid","Artsen, apotheken en noodhulp"],shopping:["Winkelen","Supermarkten, boetieks en markten"]}},
};

const guides = [
  ["WLAN & Internet", "Netzwerk: BERGLUFT-GAST · Passwort auf Ihrer Willkommenskarte", Wifi],
  ["Kaffeemaschine", "Kurzanleitung für Ihre Nespresso Vertuo", Coffee],
  ["Smart TV", "Fernsehen, Streaming und Sound-System", Settings],
  ["Heizung & Klima", "Raumtemperatur einfach regulieren", Sun],
] as const;

const defaultGuideItems: Listing[] = guides.map(([title, description], index) => ({
  id: ["wlan", "coffee", "tv", "climate"][index], title, description, address: "", phone: "", link: "", linkLabel: "Website öffnen", image: "", brochure: ""
}));

export default function HomePage() {
  const [modal, setModal] = useState<Modal>(null);
  const [language, setLanguage] = useState("DE");
  const [notifications, setNotifications] = useState(false);
  const [booked, setBooked] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [siteData, setSiteData] = useState<SiteData>(defaultData);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Listing | null>(null);
  const [locationStatus, setLocationStatus] = useState<"checking" | "inside" | "outside" | "denied">("checking");
  const [heroSlide, setHeroSlide] = useState(0);
  const t = translations[language] || translations.DE;
  const heroSlides = siteData.heroImages?.length ? siteData.heroImages : [siteData.heroImage];

  useEffect(() => { fetch("/api/content").then(r => r.json()).then(r => { if (!r.content) return; setSiteData({ ...defaultData, ...r.content, categories: r.content.categories.map((c: Category) => ({ ...c, items: c.id === "stay" && !c.items?.length ? defaultGuideItems : c.items || [], documents: c.documents || [] })) }); }).catch(() => undefined); }, []);
  useEffect(() => { if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);
  useEffect(() => { setHeroSlide(0); if (heroSlides.length < 2) return; const timer = window.setInterval(() => setHeroSlide(current => (current + 1) % heroSlides.length), 5000); return () => window.clearInterval(timer); }, [heroSlides.length, heroSlides.join("|")]);
  useEffect(() => {
    if (!siteData.geofenceEnabled) { setLocationStatus("inside"); return; }
    if (!navigator.geolocation || !siteData.propertyLatitude || !siteData.propertyLongitude) { setLocationStatus("denied"); return; }
    setLocationStatus("checking");
    const watch = navigator.geolocation.watchPosition(position => {
      const toRad = (value: number) => value * Math.PI / 180; const lat1 = toRad(position.coords.latitude); const lat2 = toRad(siteData.propertyLatitude); const dLat = lat2 - lat1; const dLon = toRad(siteData.propertyLongitude - position.coords.longitude);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2; const distance = 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setLocationStatus(distance <= (siteData.geofenceRadius || 100) ? "inside" : "outside");
    }, () => setLocationStatus("denied"), { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 });
    return () => navigator.geolocation.clearWatch(watch);
  }, [siteData.geofenceEnabled, siteData.propertyLatitude, siteData.propertyLongitude, siteData.geofenceRadius]);

  const close = () => { setModal(null); setBooked(false); };
  const guideItems = siteData.categories.find(category => category.id === "stay")?.items?.length ? siteData.categories.find(category => category.id === "stay")!.items : defaultGuideItems;
  const accommodationVisible = !siteData.geofenceEnabled || locationStatus === "inside";
  const brandInitial = Array.from(siteData.hotelName.trim())[0]?.toLocaleUpperCase("de-DE") || "B";

  return (
    <main className="app-shell" style={{ "--brand": siteData.accent } as React.CSSProperties}>
      <header className="topbar">
        <button className="icon-button mobile-menu" aria-label="Menü"><Menu size={20} /></button>
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="brand-mark">{brandInitial}</span><span>{siteData.hotelName}</span><small>{siteData.brandSubtitle}</small>
        </button>
        <nav className="top-actions">
          <label className="language-select"><Languages size={17} /><select aria-label="Sprache" value={language} onChange={(e) => setLanguage(e.target.value)}><option>DE</option><option>EN</option><option>FR</option><option>IT</option><option>NL</option></select></label>
          <button className={`icon-button ${notifications ? "active" : ""}`} aria-label="Benachrichtigungen" onClick={() => setNotifications(!notifications)}>{notifications ? <BellRing size={19} /> : <Bell size={19} />}</button>
          <button className="edit-button" onClick={() => setModal("editor")}><Pencil size={16} /> {t.edit}</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-slides" aria-hidden="true">{heroSlides.map((image, index) => <div key={`${image}-${index}`} className={index === heroSlide ? "active" : ""} style={{ backgroundImage: `url(${image})` }} />)}</div>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">{language === "DE" ? siteData.heroEyebrow : t.welcome}</p>
          <h1>{(language === "DE" ? siteData.heroTitle : t.hero).split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h1>
          <p>{language === "DE" ? siteData.heroText : t.intro}</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}>{t.discover} <ChevronRight size={17} /></button>
            <button className="weather-pill" onClick={() => setModal("weather")} aria-label="7-Tage-Wetter anzeigen"><CloudSun size={24} /><span><strong>7 Tage</strong><small>Wetter · {siteData.location}</small></span></button>
          </div>
        </div>
        <div className="arrival-card"><span>HEUTE</span><strong>Sommerabend am Berg</strong><small><CalendarDays size={14} /> 18:30 · Sonnenterrasse</small><button onClick={() => setNotifications(true)}>Erinnern</button></div>
      </section>

      <section className="content" id="discover">
        <div className="section-heading"><div><p className="eyebrow dark">{language === "DE" ? "Gut zu wissen" : t.welcome}</p><h2>{t.overview}</h2></div><button className="search-button"><Search size={18} /> {t.search}</button></div>

        {notifications && <div className="notice"><BellRing size={20} /><div><strong>Benachrichtigungen sind aktiviert</strong><span>Sie erhalten lokale Wetter-, Veranstaltungs- und Bevölkerungswarnungen.</span></div><button onClick={() => setNotifications(false)}><X size={18} /></button></div>}

        <div className="category-grid">
          {siteData.categories.filter(c => c.visible && (c.id !== "stay" || accommodationVisible)).map((category, index) => { const Icon = categoryIcons[index % categoryIcons.length]; const translated = language === "DE" ? null : t.categories[category.id]; return <button className={`category-card ${category.tone}`} key={category.id} onClick={() => { if (category.items?.length || category.documents?.length) { setSelectedCategory(category); setModal("category"); } else if (category.action) setModal(category.action); }}><span className="category-icon"><Icon size={25} strokeWidth={1.7} /></span><span><strong>{translated?.[0] || category.title}</strong><small>{translated?.[1] || category.subtitle}</small></span><ChevronRight className="arrow" size={18} /></button> })}
        </div>
        {siteData.geofenceEnabled && !accommodationVisible && <div className="location-lock"><MapPin size={22} /><div><strong>Unterkunftsinhalte geschützt</strong><span>{locationStatus === "outside" ? `WLAN und Geräte-Anleitungen werden erst innerhalb von ${siteData.geofenceRadius || 100} Metern angezeigt.` : "Bitte erlauben Sie den Standortzugriff, um Inhalte der Unterkunft anzuzeigen."}</span></div><button onClick={() => window.location.reload()}>Standort prüfen</button></div>}

        <div className="feature-grid">
          <article className="feature-card image-card restaurant"><div className="feature-overlay"><span className="tag">{t.recommendation}</span><h3>Alpengrün</h3><p>Alpine Küche. Neu gedacht.</p><button onClick={() => setModal("restaurant")}>{t.reserve} <ChevronRight size={16} /></button></div></article>
          <article className="feature-card spa-card"><div><span className="tag light">{t.spaTime}</span><Sparkles size={28} /><h3>Bergkräuter-Ritual</h3><p>80 Minuten Entspannung mit regionalen Kräutern und warmem Bergöl.</p><button onClick={() => setModal("spa")}>{t.book} <ChevronRight size={16} /></button></div><div className="spa-orb" /></article>
          <article className="feature-card delivery-card"><div className="delivery-logo">L</div><div><span className="tag light">{t.delivery}</span><h3>{t.deliveryTitle}</h3><p>{t.deliveryText}</p><a href="https://www.lieferando.de" target="_blank" rel="noreferrer">{t.deliveryOpen} <ExternalLink size={15} /></a></div></article>
        </div>

        {accommodationVisible && <section className="guides-section">
          <div className="guides-copy"><p className="eyebrow dark">{t.guides}</p><h2>{t.guidesTitle}</h2><p>{t.guidesText}</p><button onClick={() => { setSelectedGuide(null); setModal("guide"); }}>{t.allGuides} <BookOpen size={17} /></button></div>
          <div className="guide-list">{guideItems.map((item, index) => { const Icon = guides[index]?.[2] || Settings; return <button key={item.id} onClick={() => { setSelectedGuide(item); setModal("guide"); }}><span>{item.image ? <img src={item.image} alt="" /> : <Icon size={21} />}</span><div><strong>{item.title}</strong><small>{item.description}</small></div><ChevronRight size={18} /></button> })}</div>
        </section>}
      </section>

      <section className="feedback-strip"><div><MessageCircle size={25} /><span><strong>{t.feedbackTitle}</strong><small>{t.feedbackText}</small></span></div><button onClick={() => setModal("feedback")}>{t.feedback}</button></section>
      <footer><div className="brand footer-brand"><span className="brand-mark">{brandInitial}</span><span>{siteData.hotelName}</span><small>{siteData.brandSubtitle}</small></div><p>Ihr digitaler Begleiter für einen unvergesslichen Aufenthalt.</p><div><a href="tel:112"><Phone size={15} /> Notruf 112</a><button onClick={() => setModal("privacy")}>Datenschutz</button><button onClick={() => setModal("imprint")}>Impressum</button></div></footer>

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={close}><section className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Schließen"><X size={20} /></button>
        {modal === "restaurant" && <Booking title="Tisch im Alpengrün" subtitle="Alpine Küche · Heute 17:30–22:30" type="restaurant" booked={booked} setBooked={setBooked} />}
        {modal === "spa" && <Booking title="Bergkräuter-Ritual" subtitle="80 Minuten · 129 € pro Person" type="spa" booked={booked} setBooked={setBooked} />}
        {modal === "feedback" && <Feedback value={feedback} setValue={setFeedback} />}
        {modal === "privacy" && <LegalText eyebrow="Rechtliches" title="Datenschutz" text={siteData.privacyText} />}
        {modal === "imprint" && <LegalText eyebrow="Rechtliches" title="Impressum" text={siteData.imprintText} />}
        {modal === "weather" && <WeatherForecast latitude={siteData.propertyLatitude} longitude={siteData.propertyLongitude} location={siteData.location} />}
        {modal === "guide" && (selectedGuide ? <Guide item={selectedGuide} /> : <GuideOverview items={guideItems} onSelect={setSelectedGuide} />)}
        {modal === "category" && selectedCategory && <CategoryView category={selectedCategory} />}
        {modal === "editor" && <Editor value={siteData} onChange={setSiteData} close={close} />}
      </section></div>}
    </main>
  );
}

function Booking({ title, subtitle, type, booked, setBooked }: { title: string; subtitle: string; type: string; booked: boolean; setBooked: (v: boolean) => void }) {
  if (booked) return <div className="success-state"><span><Check size={30} /></span><h2>Anfrage gesendet</h2><p>Wir bestätigen Ihre {type === "spa" ? "Behandlung" : "Reservierung"} in Kürze per Nachricht.</p></div>;
  const submit = async () => { await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type, payload: { title } }) }); setBooked(true); };
  return <><p className="eyebrow dark">Direkt buchen</p><h2>{title}</h2><p className="modal-subtitle">{subtitle}</p><div className="booking-grid"><label><CalendarDays size={17} /> Datum<input type="date" defaultValue="2026-07-22" /></label><label><Clock3 size={17} /> Uhrzeit<select defaultValue="19:00"><option>18:00</option><option>19:00</option><option>20:30</option></select></label><label><Users size={17} /> Personen<select><option>1 Person</option><option>2 Personen</option><option>3 Personen</option><option>4 Personen</option></select></label></div><label className="full-label">Wünsche oder Hinweise<textarea placeholder="Allergien, Anlass oder besondere Wünsche …" /></label><button className="modal-primary" onClick={submit}>Verbindlich anfragen <ChevronRight size={17} /></button><small className="fineprint">Kostenfrei stornierbar bis 6 Stunden vor dem Termin.</small></>;
}

type ForecastDay = { date: string; code: number; max: number; min: number; rain: number };
function WeatherForecast({ latitude, longitude, location }: { latitude: number; longitude: number; location: string }) {
  const [days, setDays] = useState<ForecastDay[]>([]); const [error, setError] = useState("");
  useEffect(() => {
    if (!latitude || !longitude) { setError("Bitte im Bearbeitungsmodus zuerst die Adresse der Unterkunft prüfen und speichern."); return; }
    fetch(`/api/weather?lat=${latitude}&lon=${longitude}`).then(async response => { const json = await response.json(); if (!response.ok) throw new Error(json.error || "Wetterdaten konnten nicht geladen werden."); setDays(json.days); }).catch(reason => setError(reason instanceof Error ? reason.message : "Wetterdaten konnten nicht geladen werden."));
  }, [latitude, longitude]);
  const label = (code: number) => code === 0 ? "Sonnig" : code <= 3 ? "Leicht bewölkt" : code <= 48 ? "Nebel" : code <= 67 ? "Regen" : code <= 77 ? "Schnee" : code <= 82 ? "Regenschauer" : code <= 86 ? "Schneeschauer" : "Gewitter";
  return <><p className="eyebrow dark">Wettervorhersage</p><h2>Die nächsten 7 Tage</h2><p className="modal-subtitle">Aktuelles Wetter für {location}</p>{error ? <p className="weather-error">{error}</p> : !days.length ? <p className="weather-loading"><LoaderCircle className="spin" size={18} /> Wetter wird geladen …</p> : <div className="forecast-list">{days.map((day, index) => <article key={day.date}><div><strong>{index === 0 ? "Heute" : new Intl.DateTimeFormat("de-DE", { weekday: "long" }).format(new Date(`${day.date}T12:00:00`))}</strong><small>{new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(new Date(`${day.date}T12:00:00`))}</small></div><span><CloudSun size={22} /><small>{label(day.code)}</small></span><b>{Math.round(day.max)}° <em>{Math.round(day.min)}°</em></b><small className="rain">{Math.round(day.rain)} % Regen</small></article>)}</div>}</>;
}

function Feedback({ value, setValue }: { value: number | null; setValue: (v: number) => void }) {
  const [sent, setSent] = useState(false); const [text, setText] = useState("");
  const submit = async () => { await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: "feedback", payload: { rating: value, text } }) }); setSent(true); };
  if (sent) return <div className="success-state"><span><Check size={30} /></span><h2>Vielen Dank!</h2><p>Ihre Rückmeldung wurde gespeichert.</p></div>;
  return <><p className="eyebrow dark">Quick Feedback</p><h2>Wie ist Ihr Aufenthalt?</h2><p className="modal-subtitle">Eine kurze Rückmeldung genügt. Wir kümmern uns sofort, wenn etwas nicht passt.</p><div className="rating">{[1,2,3,4,5].map(n => <button key={n} className={value && n <= value ? "selected" : ""} onClick={() => setValue(n)}><Star size={27} fill={value && n <= value ? "currentColor" : "none"} /><small>{["Schlecht","Geht so","Gut","Sehr gut","Perfekt"][n-1]}</small></button>)}</div>{value && <><textarea className="feedback-text" value={text} onChange={e => setText(e.target.value)} placeholder="Möchten Sie uns noch etwas sagen?" /><button className="modal-primary" onClick={submit}>Feedback senden</button></>}</>;
}

function Guide({ item }: { item: Listing }) {
  return <><p className="eyebrow dark">Geräte-Anleitung</p><h2>{item.title}</h2><p className="modal-subtitle">{item.description}</p>{item.image && <img className="guide-detail-image" src={item.image} alt={item.title} />}{item.link && <a className="modal-secondary guide-link" href={safeExternalUrl(item.link)} target="_blank" rel="noreferrer"><ExternalLink size={17} /> {item.linkLabel || "Weitere Informationen"}</a>}{item.brochure && <a className="modal-primary guide-link" href={item.brochure} target="_blank" rel="noreferrer"><BookOpen size={17} /> PDF-Bedienungsanleitung öffnen</a>}{!item.image && !item.brochure && <p className="guide-empty">Im Bearbeitungsmodus können Sie hier ein Bild und eine PDF-Anleitung hinterlegen.</p>}</>;
}

function GuideOverview({ items, onSelect }: { items: Listing[]; onSelect: (item: Listing) => void }) {
  return <><p className="eyebrow dark">Einfach erklärt</p><h2>Alle Anleitungen</h2><p className="modal-subtitle">Alle Geräteinformationen und hinterlegten PDF-Anleitungen auf einen Blick.</p><div className="guide-overview">{items.map(item => <article key={item.id}>{item.image ? <img src={item.image} alt={item.title} /> : <div className="guide-overview-placeholder"><Settings size={26} /></div>}<div><h3>{item.title}</h3><p>{item.description}</p><div className="guide-overview-actions"><button onClick={() => onSelect(item)}>Details anzeigen</button>{item.brochure && <a href={item.brochure} target="_blank" rel="noreferrer"><FileText size={14} /> PDF öffnen</a>}</div></div></article>)}</div></>;
}

function LegalText({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <><p className="eyebrow dark">{eyebrow}</p><h2>{title}</h2><div className="legal-text">{(text || "Noch kein Text hinterlegt.").split(/\n{2,}/).map((paragraph, index) => <p key={index}>{linkifyLegalText(paragraph)}</p>)}</div></>;
}

function linkifyLegalText(text: string) {
  const pattern = /(https?:\/\/[^\s<>]+|www\.[^\s<>]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:[A-Z0-9-]+\.)+(?:DE|COM|NET|ORG|EU|INFO|AT|CH)(?:\/[^\s<>]*)?)/gi;
  return text.split(pattern).map((part, index) => {
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(part)) return <a key={index} href={`mailto:${part}`} onClick={(event) => { event.preventDefault(); window.location.href = `mailto:${part}`; }}>{part}</a>;
    if (/^(https?:\/\/|www\.|(?:[A-Z0-9-]+\.)+(?:DE|COM|NET|ORG|EU|INFO|AT|CH))/i.test(part)) {
      const clean = part.replace(/[.,;:!?)\]]+$/g, ""); const suffix = part.slice(clean.length); const href = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
      return <span key={index}><a href={href} target="_blank" rel="noopener noreferrer">{clean}</a>{suffix}</span>;
    }
    return part;
  });
}

function safeExternalUrl(value: string) {
  if (!value) return "";
  try { const url = new URL(value.startsWith("http") ? value : `https://${value}`); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}

function CategoryView({ category }: { category: Category }) {
  const documentLabel = category.id === "stay" ? "PDF-Anleitung" : "Prospekt";
  const entryPdfLabel = category.id === "stay" ? "PDF-Anleitung" : category.id === "food" ? "Speisekarte" : "Prospekt";
  return <><p className="eyebrow dark">Empfehlungen & Informationen</p><h2>{category.title}</h2><p className="modal-subtitle">{category.subtitle}</p>{category.id !== "stay" && category.documents?.length > 0 && <div className="category-documents">{category.documents.map(doc => <a href={doc.url} target="_blank" rel="noreferrer" key={doc.id}><FileText size={20} /><span><strong>{doc.title}</strong><small>{documentLabel} öffnen</small></span><ExternalLink size={15} /></a>)}</div>}<div className="listing-grid">{category.items.map(item => <article className="listing-card" key={item.id}>{item.image ? <div className="listing-image" style={{ backgroundImage: `url(${item.image})` }} /> : <div className="listing-image empty"><MapPin size={27} /></div>}<div className="listing-body"><h3>{item.title}</h3><p>{item.description}</p>{item.address && <a className="listing-meta" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`} target="_blank" rel="noreferrer"><Navigation size={14} /> {item.address}</a>}{item.phone && <a className="listing-meta" href={`tel:${item.phone}`}><Phone size={14} /> {item.phone}</a>}<div className="listing-actions">{safeExternalUrl(item.link) && <a className="listing-primary" href={safeExternalUrl(item.link)} target="_blank" rel="noreferrer">{item.linkLabel || "Website öffnen"} <ExternalLink size={14} /></a>}{item.brochure && <a className="listing-brochure" href={item.brochure} target="_blank" rel="noreferrer"><FileText size={14} /> {entryPdfLabel} ansehen</a>}</div></div></article>)}</div></>;
}

function Editor({ value, onChange, close }: { value: SiteData; onChange: (v: SiteData) => void; close: () => void }) {
  const [draft, setDraft] = useState({ ...value, heroImages: value.heroImages || [], propertyAddress: value.propertyAddress || "", categories: value.categories.map(c => ({ ...c, items: c.items || [], documents: c.documents || [] })) }); const [tab, setTab] = useState<"start" | "categories">("start"); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const [openCategory, setOpenCategory] = useState<string | null>(null); const [uploadingKey, setUploadingKey] = useState<string | null>(null); const [geocoding, setGeocoding] = useState(false); const [addressConfirmed, setAddressConfirmed] = useState(Boolean(value.propertyAddress && value.propertyLatitude && value.propertyLongitude));
  const update = (key: keyof SiteData, val: SiteData[keyof SiteData]) => setDraft({ ...draft, [key]: val });
  const upload = async (file?: File, target?: { category: number; item: number; field: "image" | "brochure" }) => {
    if (!file) return;
    const key = target ? `${target.category}-${target.item}-${target.field}` : "hero";
    if (target?.field === "brochure" && file.size > 5_000_000_000) { setMessage("Die PDF ist größer als 5 GB."); return; }
    setUploadingKey(key);
    setMessage(target?.field === "brochure" ? "PDF wird hochgeladen … 0 %" : "Datei wird hochgeladen …");
    try {
      let json: { url: string; persisted?: boolean };
      if (target?.field === "brochure") {
        const categoryId = draft.categories[target.category].id;
        const itemId = draft.categories[target.category].items[target.item].id;
        const initRes = await fetch("/api/upload/multipart?action=init", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: file.name, size: file.size }) });
        const init = await initRes.json(); if (!initRes.ok) throw new Error(init.error || "Upload konnte nicht gestartet werden");
        const chunkSize = 1024 * 1024; const parts: Array<{ partNumber: number; etag: string }> = []; const total = Math.ceil(file.size / chunkSize);
        for (let index = 0; index < total; index++) {
          const partNumber = index + 1; const chunk = file.slice(index * chunkSize, Math.min(file.size, (index + 1) * chunkSize));
          const partRes = await fetch(`/api/upload/multipart?action=part&key=${encodeURIComponent(init.key)}&uploadId=${encodeURIComponent(init.uploadId)}&partNumber=${partNumber}`, { method: "POST", body: chunk });
          const part = await partRes.json(); if (!partRes.ok) throw new Error(part.error || `Teil ${partNumber} konnte nicht übertragen werden`); parts.push(part);
          setMessage(`PDF wird hochgeladen … ${Math.round((partNumber / total) * 100)} %`);
        }
        const completeRes = await fetch("/api/upload/multipart?action=complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...init, parts, categoryId, itemId, size: file.size }) });
        json = await completeRes.json(); if (!completeRes.ok) throw new Error((json as any).error || "PDF konnte nicht abgeschlossen werden");
      } else {
        const form = new FormData(); form.append("file", file);
        if (target) { form.append("categoryId", draft.categories[target.category].id); form.append("itemId", draft.categories[target.category].items[target.item].id); form.append("field", target.field); }
        const res = await fetch("/api/upload", { method: "POST", body: form }); json = await res.json(); if (!res.ok) throw new Error((json as any).error || "Upload fehlgeschlagen");
      }
      if (target) {
        const nextCategories = draft.categories.map((c, ci) => ci === target.category ? { ...c, items: c.items.map((item, ii) => ii === target.item ? { ...item, [target.field]: json.url } : item) } : c);
        const nextDraft = { ...draft, categories: nextCategories }; setDraft(nextDraft);
        if (!json.persisted) { const saveRes = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(nextDraft) }); if (!saveRes.ok) throw new Error("Datei wurde übertragen, konnte aber nicht am Eintrag gespeichert werden"); }
        onChange(nextDraft); setMessage(target.field === "brochure" ? "PDF erfolgreich hochgeladen und dauerhaft gespeichert ✓" : "Bild erfolgreich hochgeladen und gespeichert ✓");
      } else { update("heroImage", json.url); setMessage("Bild ist bereit. Bitte Änderungen speichern."); }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload fehlgeschlagen. Bitte erneut versuchen."); }
    finally { setUploadingKey(null); }
  };
  const save = async () => { setSaving(true); setMessage(""); const res = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) }); if (res.ok) { onChange(draft); close(); } else { const json = await res.json().catch(() => ({})); setMessage(json.error || "Speichern nicht möglich. Bitte erneut anmelden."); setSaving(false); } };
  const editCategory = (index: number, patch: Partial<Category>) => update("categories", draft.categories.map((c, i) => i === index ? { ...c, ...patch } : c));
  const addCategory = () => update("categories", [...draft.categories, { id: crypto.randomUUID(), title: "Neue Kategorie", subtitle: "Beschreibung ergänzen", tone: "sage", action: null, visible: true, items: [], documents: [] }]);
  const removeCategory = (index: number) => update("categories", draft.categories.filter((_, i) => i !== index));
  const editItem = (categoryIndex: number, itemIndex: number, patch: Partial<Listing>) => update("categories", draft.categories.map((c, ci) => ci === categoryIndex ? { ...c, items: c.items.map((item, ii) => ii === itemIndex ? { ...item, ...patch } : item) } : c));
  const addItem = (categoryIndex: number) => { const item: Listing = { id: crypto.randomUUID(), title: "Neuer Eintrag", description: "Beschreibung ergänzen", address: "", phone: "", link: "", linkLabel: "Website öffnen", image: "", brochure: "" }; update("categories", draft.categories.map((c, ci) => ci === categoryIndex ? { ...c, items: [...c.items, item] } : c)); setOpenCategory(draft.categories[categoryIndex].id); };
  const removeItem = (categoryIndex: number, itemIndex: number) => update("categories", draft.categories.map((c, ci) => ci === categoryIndex ? { ...c, items: c.items.filter((_, ii) => ii !== itemIndex) } : c));
  const uploadSlideshow = async (files: FileList | null) => {
    if (!files?.length) return; setUploadingKey("hero-slides"); setMessage(`${files.length} Bilder werden hochgeladen …`);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) { const form = new FormData(); form.append("file", file); const response = await fetch("/api/upload", { method: "POST", body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error || `${file.name} konnte nicht hochgeladen werden.`); urls.push(result.url); }
      const nextImages = [...(draft.heroImages || []), ...urls]; const nextDraft = { ...draft, heroImages: nextImages, heroImage: nextImages[0] || draft.heroImage }; setDraft(nextDraft); setMessage(`${urls.length} Bilder zur Slideshow hinzugefügt. Bitte Änderungen speichern. ✓`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Bilder konnten nicht hochgeladen werden."); }
    finally { setUploadingKey(null); }
  };
  const confirmAddress = async () => {
    if (!draft.propertyAddress.trim()) { setMessage("Bitte zuerst die vollständige Adresse der Unterkunft eingeben."); return; }
    setGeocoding(true); setMessage("Adresse wird geprüft …");
    try {
      const response = await fetch("/api/geocode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: draft.propertyAddress }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Die Adresse konnte nicht gefunden werden.");
      setDraft(current => ({ ...current, propertyAddress: result.displayName || current.propertyAddress, propertyLatitude: result.latitude, propertyLongitude: result.longitude }));
      setAddressConfirmed(true); setMessage("Adresse erfolgreich gefunden und für den Standortschutz übernommen ✓");
    } catch (error) { setAddressConfirmed(false); setMessage(error instanceof Error ? error.message : "Die Adresse konnte nicht gefunden werden."); }
    finally { setGeocoding(false); }
  };
  return <div className="editor"><p className="eyebrow dark">Redaktionsbereich</p><h2>Gästemappe bearbeiten</h2><div className="editor-tabs"><button className={tab === "start" ? "active" : ""} onClick={() => setTab("start")}>Startseite</button><button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Kategorien <span>{draft.categories.length}</span></button></div>
    {tab === "start" && <div className="editor-fields brand-subtitle-editor"><label className="full-label">Untertitel unter dem Unterkunftsnamen<input value={draft.brandSubtitle || ""} onChange={e => update("brandSubtitle", e.target.value.toUpperCase())} placeholder="z. B. FERIENWOHNUNG AN DER OSTSEE" /></label><div className="slideshow-editor"><label className="upload-button"><Upload size={18} /> Mehrere Bilder für die Slideshow auswählen<input type="file" accept="image/*" multiple hidden disabled={uploadingKey === "hero-slides"} onChange={e => uploadSlideshow(e.target.files)} /></label>{uploadingKey === "hero-slides" && <small><LoaderCircle className="spin" size={14} /> Bilder werden hochgeladen …</small>}<div className="slideshow-thumbs">{(draft.heroImages || []).map((image, index) => <figure key={`${image}-${index}`} style={{ backgroundImage: `url(${image})` }}><button type="button" onClick={() => update("heroImages", draft.heroImages.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Bild ${index + 1} entfernen`}><X size={14} /></button><span>{index + 1}</span></figure>)}</div>{!draft.heroImages?.length && <small>Noch keine Slideshow-Bilder ausgewählt. Das einzelne Titelbild bleibt sichtbar.</small>}</div></div>}
    {tab === "start" ? <div className="editor-fields"><label className="full-label">Name der Unterkunft<input value={draft.hotelName} onChange={e => update("hotelName", e.target.value.toUpperCase())} /></label><label className="full-label">Begrüßungszeile<input value={draft.heroEyebrow} onChange={e => update("heroEyebrow", e.target.value)} /></label><label className="full-label">Hauptüberschrift<input value={draft.heroTitle} onChange={e => update("heroTitle", e.target.value)} /></label><label className="full-label">Einleitung<textarea value={draft.heroText} onChange={e => update("heroText", e.target.value)} /></label><label className="full-label">Ort<input value={draft.location} onChange={e => update("location", e.target.value)} /></label><div className="editor-row"><label className="color-label"><Palette size={18} /> Akzentfarbe<input type="color" value={draft.accent} onChange={e => update("accent", e.target.value)} /></label><label className="upload-button"><Upload size={18} /> Titelbild hochladen<input type="file" accept="image/*" hidden onChange={e => upload(e.target.files?.[0])} /></label></div>{draft.heroImage && <div className="image-preview" style={{ backgroundImage: `url(${draft.heroImage})` }}><span><Eye size={15} /> Aktuelles Titelbild</span></div>}<div className="geofence-editor"><h3>Standortschutz für die Unterkunft</h3><label className="geofence-toggle"><input type="checkbox" checked={draft.geofenceEnabled || false} onChange={e => { if (e.target.checked && !addressConfirmed) { setMessage("Bitte zuerst die Adresse prüfen und übernehmen."); return; } update("geofenceEnabled", e.target.checked); }} /> Unterkunftsinhalte außerhalb des Radius ausblenden</label><div className="geofence-address"><label>Vollständige Adresse der Unterkunft<input value={draft.propertyAddress || ""} onChange={e => { update("propertyAddress", e.target.value); setAddressConfirmed(false); }} placeholder="Straße, Hausnummer, PLZ und Ort" /></label><button type="button" onClick={confirmAddress} disabled={geocoding || !draft.propertyAddress.trim()}>{geocoding ? <LoaderCircle className="spin" size={16} /> : <MapPin size={16} />}{geocoding ? "Adresse wird geprüft …" : "Adresse prüfen & übernehmen"}</button></div><label className="geofence-radius">Radius in Metern<input type="number" min="50" value={draft.geofenceRadius || 100} onChange={e => update("geofenceRadius", Number(e.target.value))} /></label><small>{addressConfirmed ? "Adresse ist bestätigt. Der Standortschutz kann aktiviert und gespeichert werden." : "Bitte die vollständige Adresse eingeben und anschließend prüfen."}</small></div><div className="legal-editor"><h3>Rechtliche Inhalte</h3><label>Datenschutz<textarea value={draft.privacyText || ""} onChange={e => update("privacyText", e.target.value)} placeholder="Vollständigen Datenschutztext eingeben …" /></label><label>Impressum<textarea value={draft.imprintText || ""} onChange={e => update("imprintText", e.target.value)} placeholder="Vollständiges Impressum eingeben …" /></label></div></div>
    : <div className="category-editor-list">{draft.categories.map((c, i) => <div className="category-edit" key={c.id}>
      <div className="category-edit-head"><span>{i + 1}</span><input value={c.title} onChange={e => editCategory(i, { title: e.target.value })} /><button className={c.visible ? "visible" : ""} onClick={() => editCategory(i, { visible: !c.visible })} aria-label="Sichtbarkeit"><Eye size={17} /></button><button onClick={() => removeCategory(i)} aria-label="Löschen"><Trash2 size={17} /></button></div>
      <input value={c.subtitle} onChange={e => editCategory(i, { subtitle: e.target.value })} />
      <select value={c.action || ""} onChange={e => editCategory(i, { action: (e.target.value || null) as Modal })}><option value="">Einträge/Links anzeigen</option><option value="guide">Anleitungen öffnen</option><option value="restaurant">Interne Restaurantbuchung</option><option value="spa">Interne Spa-Buchung</option></select>
      <button className="manage-items" onClick={() => setOpenCategory(openCategory === c.id ? null : c.id)}><ListPlus size={15} /> {c.items.length} Einträge verwalten <ChevronRight size={15} /></button>
      {openCategory === c.id && <div className="items-editor">{c.items.map((item, itemIndex) => <div className="item-edit" key={item.id}><div className="item-edit-title"><strong>Eintrag {itemIndex + 1}</strong><button onClick={() => removeItem(i, itemIndex)}><Trash2 size={15} /> Löschen</button></div><label>Name<input value={item.title} onChange={e => editItem(i, itemIndex, { title: e.target.value })} /></label><label>Beschreibung<textarea value={item.description} onChange={e => editItem(i, itemIndex, { description: e.target.value })} /></label><div className="item-edit-grid"><label>Adresse<input value={item.address} onChange={e => editItem(i, itemIndex, { address: e.target.value })} /></label><label>Telefon<input value={item.phone} onChange={e => editItem(i, itemIndex, { phone: e.target.value })} /></label><label>Website / Buchungslink<input type="url" placeholder="https://…" value={item.link} onChange={e => editItem(i, itemIndex, { link: e.target.value })} /></label><label>Beschriftung des Links<input value={item.linkLabel} onChange={e => editItem(i, itemIndex, { linkLabel: e.target.value })} /></label></div><div className="item-files"><label><Upload size={15} /> Bild hochladen<input type="file" accept="image/*" hidden onChange={e => upload(e.target.files?.[0], { category: i, item: itemIndex, field: "image" })} /></label>{item.image && <span>Bild ✓</span>}</div><div className={`item-pdf-upload ${item.brochure ? "complete" : ""}`}><span><FileText size={17} /><strong>{c.id === "stay" ? "PDF-Anleitung für diesen Eintrag" : "PDF-Prospekt für diesen Eintrag"}</strong></span><input type="file" accept="application/pdf,.pdf" aria-label={`${item.title}: ${c.id === "stay" ? "PDF-Anleitung auswählen" : "PDF-Prospekt auswählen"}`} disabled={uploadingKey === `${i}-${itemIndex}-brochure`} onChange={e => upload(e.target.files?.[0], { category: i, item: itemIndex, field: "brochure" })} />{uploadingKey === `${i}-${itemIndex}-brochure` ? <small><LoaderCircle className="spin" size={14} /> PDF wird hochgeladen …</small> : item.brochure ? <small><Check size={14} /> PDF erfolgreich hochgeladen und gespeichert</small> : <small>Noch keine PDF hinterlegt</small>}</div></div>)}<button className="add-item" onClick={() => addItem(i)}><Plus size={15} /> Restaurant, Ziel oder Anbieter hinzufügen</button></div>}
    </div>)}<button className="add-category" onClick={addCategory}><Plus size={17} /> Kategorie hinzufügen</button></div>}
    {message && <p className="editor-message">{message}</p>}<div className="editor-savebar"><button className="modal-secondary" onClick={close}>Abbrechen</button><button className="modal-primary" onClick={save} disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />}{saving ? "Speichert …" : "Änderungen speichern"}</button></div></div>;
}
