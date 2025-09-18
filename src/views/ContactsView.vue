<template>
  <!-- HERO decorativa -->
  <section
    class="hero-container"
    role="region"
    aria-labelledby="page-title"
  >
    <div class="hero-image-container" aria-hidden="true"></div>

    <div class="header-content-wrapper">
      <h1 id="page-title">Contatti</h1>
    </div>
  </section>

  <!-- FORM di contatto -->
  <section class="contact-form-section" aria-labelledby="contact-form-title">
    <h2 id="contact-form-title">Per lavori su commissione, collaborazioni o altro</h2>
    <p class="form-lead">Compila il form qui sotto, ti risponderò il prima possibile!</p>

    <form class="contact-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          required
          placeholder="La tua email"
        />
      </div>

      <div class="form-group">
        <label for="name">Nome</label>
        <input
          type="text"
          id="name"
          required
          placeholder="Il tuo nome"
        />
      </div>

      <div class="form-group">
        <label for="message">Scrivi qui la tua richiesta</label>
        <textarea
          id="message"
          rows="5"
          required
          placeholder="Scrivi qui la tua richiesta…"
        ></textarea>
      </div>

      <button type="submit" class="btn primary-btn">Invia</button>
    </form>
  </section>
</template>

<style>
/* ---------------- HERO ---------------- */
.hero-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.hero-image-container {
  position: absolute;
  inset: 0;
  background-image: url('/images/contacts/contacts_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  transform: translateY(-10%);
}
.header-content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}
/* dark mode hero */
body.dark-mode .hero-image-container {
  background-image: url('/images/contacts/contacts_darkmode.png');
}

/* breakpoints hero (come i tuoi) */
@media (min-width: 1024px) {
  .contacts {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
@media (max-width: 1024px) and (min-width: 769px) {
  .hero-image-container {
    background-position: right center;
    transform: translateY(-10%);
    opacity: 0.95;
  }
}
@media (max-width: 768px) {
  .hero-image-container {
    background-position: right top;
    transform: translateY(-10%);
    opacity: 0.9;
  }
}

/* ---------------- FORM (restyle) ---------------- */
.contact-form-section{
  background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
  max-width: 760px;
 margin: 1rem auto 7rem;     /* più vicino alla hero, più lontano dal footer */
  padding: 2rem;
  border: 1px solid  var(--color-accent);
      /* spigoli retti */
}

.contact-form-section h2{
  text-align:center;
  margin: 0 0 .5rem;        /* h2 e p più vicini */
  font-size: clamp(22px, 2.6vw, 28px);
  color: var(--color-accent);
}
.form-lead{
  text-align:center;
  margin: 0 0 1.25rem;
  font-family: var(--font-body);
  font-size: clamp(14px, 1.6vw, 16px);
  color: var(--color-text);
}

/* campi centrati sotto al titolo */
.contact-form{
  display:flex;
  flex-direction:column;
  gap: 14px;
  max-width: 620px;
  margin-inline: auto;
}

.form-group{ display:flex; flex-direction:column; gap:6px; }
label{
  font: 600 14px/1.4 var(--font-body);
  color: var(--color-text);
}

/* input/textarea squadrati */
input, textarea{
  width:100%;
  box-sizing: border-box;
  padding: 12px;
  border:1px solid #ccc;
 
  font: 400 16px/1.4 var(--font-body);
  background: var(--color-surface);
  color: var(--color-text);
}
input:focus, textarea:focus{
  border-color: var(--color-accent);
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 25%, transparent);
}

/* bottone piccolo e centrato, stile CTA ma squadrato */
.primary-btn{
  align-self:center;               /* centrato */
  background-color: var(--color-accent);
  color: var(--color-surface);
  font-weight: 700;
  font-size: 14px;
  padding: 10px 18px;              /* dimensione ridotta */
  border: 1px solid currentColor;
  border-radius: 0;                /* spigoli retti */
  cursor: pointer;
  transition: background-color .2s ease;
}
.primary-btn:hover{ background-color: var(--color-hover); }

/* responsive fine-tuning */
@media (max-width: 768px){
  .contact-form-section{
    margin: 1.5rem auto 5rem;
    padding: 1.25rem;
  }
  .contact-form{ max-width: 100%; }
}
</style>
