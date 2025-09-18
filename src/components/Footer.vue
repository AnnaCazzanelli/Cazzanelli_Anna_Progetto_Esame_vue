<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <!-- riga top -->
      <div class="footer-top">
        <!-- menu sinistra -->
        <nav class="footer-nav" aria-label="Navigazione secondaria">
          <RouterLink to="/about" class="footer-link" aria-label="About" title="About">About</RouterLink>
          <RouterLink to="/projects" class="footer-link" aria-label="Projects" title="Projects">Projects</RouterLink>
          <RouterLink to="/illustrations" class="footer-link" aria-label="Illustrations" title="Illustrations">Illustrations</RouterLink>
          <RouterLink to="/contacts" class="footer-link" aria-label="Contacts" title="Contacts">Contacts</RouterLink>
        </nav>
 <div class="footer-bottom">
        <p class="copyright">© 2025 Anna Cazzanelli — Tutti i diritti riservati</p>
      </div>
        <!-- social destra (usa le tue icone) -->
        <div class="footer-social" aria-label="Social media">
      
          <a href="mailto:anna.cazzanelli@example.com" target="_blank" rel="noopener" class="footer-link" aria-label="Email" title="Email">
            <img src="/icone/icon-email.svg" alt="" />
          </a>

          <a href="https://www.instagram.com/annaredpan/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
            <img src="/icone/icon-instagram.svg" alt="" />
          </a>

             <a href="https://www.linkedin.com/in/anna-cazzanelli-a193a6276/" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
            <img src="/icone/icon-linkedin.svg" alt="" />
          </a>
          
          <a href="https://www.behance.net/cazzanellianna" target="_blank" rel="noopener" aria-label="Behance" title="Behance">
            <img src="/icone/icon-behance.svg" alt="" />
          </a>
       
       
           </div>
      </div>

      <!-- riga bottom -->
     
    </div>
  </footer>
</template>

<style scoped>
/* wrapper footer: stessi colori tuoi */
.site-footer{
  border-top: 1px solid var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-text);
  margin-top: auto;
}

/* contenitore centrato */
.footer-inner{
  max-width: 1280px;
  margin-left: var(--margin-desktop);
  margin-right: var(--margin-desktop);
  padding: 24px 0 18px;
}

/* riga top: nav sx, social dx */
.footer-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

/* menu */
.footer-nav{
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.footer-link{
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--color-text);
  transition: color .2s ease;
}
.footer-link:hover{ color: var(--color-hover); }

/* social */
.footer-social{
  display: flex;
  align-items: center;
  gap: 16px;
}
.footer-social img{
  width: 20px; height: 20px; display: block;
  opacity: .85; transition: opacity .2s ease, transform .12s ease;
}
.footer-social a:hover img{ opacity: 1; transform: translateY(-1px); }

/* riga bottom */
.footer-bottom{
  text-align: center;
  margin-top: 12px;
}
.copyright{
  margin: 0;
  font-size: 13px;        /* discreto */
  line-height: 1.6;
  opacity: .75;
}

/* mobile: allinea al centro */
@media (max-width: 720px){
  .footer-top{ justify-content: center; }
  .footer-nav{ justify-content: center; }
}
</style>
