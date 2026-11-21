"use strict";

// Inicializa os ícones do Lucide após o carregamento da página.
if (window.lucide) {
  window.lucide.createIcons();
}

// Tema claro/escuro com persistência local
const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("portfolio-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-label", isLight ? "Ativar tema escuro" : "Ativar tema claro");
  themeToggle.innerHTML = `<i data-lucide="${isLight ? "moon" : "sun"}"></i>`;
  if (window.lucide) window.lucide.createIcons();
}

applyTheme(storedTheme || (prefersLight ? "light" : "dark"));

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", next);
  applyTheme(next);
});

// Menu mobile
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
  navToggle.innerHTML = '<i data-lucide="menu"></i>';
  document.body.classList.remove("menu-open");
  if (window.lucide) window.lucide.createIcons();
}

navToggle.addEventListener("click", () => {
  const opening = !navMenu.classList.contains("open");
  navMenu.classList.toggle("open", opening);
  navToggle.setAttribute("aria-expanded", String(opening));
  navToggle.setAttribute("aria-label", opening ? "Fechar menu" : "Abrir menu");
  navToggle.innerHTML = `<i data-lucide="${opening ? "x" : "menu"}"></i>`;
  document.body.classList.toggle("menu-open", opening);
  if (window.lucide) window.lucide.createIcons();
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

// Filtro de projetos
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const visible = filter === "todos" || card.dataset.category === filter;
      card.classList.toggle("hidden", !visible);
    });
  });
});

// Revelação suave ao entrar na tela
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Destaque da seção ativa na navegação
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

// Validação simples do formulário
const form = document.querySelector("#contact-form");
const formStatus = form.querySelector(".form-status");

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  wrapper.classList.toggle("invalid", Boolean(message));
  wrapper.querySelector(".error-message").textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let valid = true;
  formStatus.textContent = "";

  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;

  if (name.value.trim().length < 2) {
    setFieldError(name, "Informe seu nome.");
    valid = false;
  } else {
    setFieldError(name, "");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setFieldError(email, "Informe um e-mail válido.");
    valid = false;
  } else {
    setFieldError(email, "");
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, "Escreva uma mensagem com pelo menos 10 caracteres.");
    valid = false;
  } else {
    setFieldError(message, "");
  }

  if (!valid) {
    form.querySelector(".invalid input, .invalid textarea")?.focus();
    return;
  }

  formStatus.textContent = "Mensagem validada! Conecte este formulário ao seu serviço de envio.";
  form.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();
