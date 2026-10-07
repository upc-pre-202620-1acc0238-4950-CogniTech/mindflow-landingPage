"use strict";

const DEFAULT_LOCALE = "es";
const SUPPORTED_LOCALES = ["es", "en"];
const APP_DOWNLOAD_URL = "https://github.com/upc-pre-202620-1acc0238-4950-CogniTech/mindflow-fronted/releases";
let currentLocale = DEFAULT_LOCALE;
let translations = {};

// Captured at parse time (document.currentScript is only valid synchronously
// while this file is being executed) so the i18n JSON can be located no
// matter how deep the current page is nested (index.html vs assets/legal/*.html).
const SCRIPT_DIR = (() => {
	const el =
		document.currentScript ||
		Array.from(document.scripts).find((s) => s.src.includes("script.js"));
	return el ? el.src.replace(/script\.js(\?.*)?$/, "") : "";
})();

document.addEventListener("DOMContentLoaded", () => {
	initI18n().then(() => {
		initSmoothScroll();
		initActiveSectionLinks();
		initScrollReveal();
		initMobileNav();
		initTeamPhotoFallback();
		initNavbarScroll();
		initHeroPhoneFloat();
		initAppLinks();
	});
});

function getI18nBasePath() {
	return `${SCRIPT_DIR}i18n/`;
}

async function initI18n() {
	const stored = localStorage.getItem("mindflow-locale");
	currentLocale = SUPPORTED_LOCALES.includes(stored) ? stored : DEFAULT_LOCALE;
	await loadAndApplyLocale(currentLocale);

	const toggle = document.querySelector("[data-lang-toggle]");
	if (toggle) {
		toggle.addEventListener("click", async () => {
			const next = currentLocale === "es" ? "en" : "es";
			await loadAndApplyLocale(next);
			localStorage.setItem("mindflow-locale", next);
		});
	}
}

async function loadAndApplyLocale(locale) {
	const response = await fetch(`${getI18nBasePath()}${locale}.json`);
	if (!response.ok) return;
	translations = await response.json();
	currentLocale = locale;
	applyTranslations();
}

function applyTranslations() {
	document.documentElement.lang = currentLocale;

	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		const value = resolveKey(translations, key);
		if (value == null) return;

		const vars = el.getAttribute("data-i18n-vars");
		el.textContent = vars ? interpolate(value, JSON.parse(vars)) : value;
	});

	document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
		const spec = el.getAttribute("data-i18n-attr");
		const [attr, key] = spec.split(":");
		const value = resolveKey(translations, key);
		if (value != null) el.setAttribute(attr, value);
	});

	document.querySelectorAll("[data-i18n-list]").forEach((container) => {
		const key = container.getAttribute("data-i18n-list");
		const items = resolveKey(translations, key);
		if (!Array.isArray(items)) return;
		const spans = container.querySelectorAll("span");
		items.forEach((text, i) => {
			if (spans[i]) spans[i].textContent = text;
		});
	});

	const toggle = document.querySelector("[data-lang-toggle]");
	if (toggle) {
		const label = translations.lang?.switch;
		const aria = translations.lang?.switchAria;
		if (label) toggle.querySelector("span").textContent = label;
		if (aria) toggle.setAttribute("aria-label", aria);
	}

	const copyright = document.querySelector("[data-i18n='footer.copyright']");
	if (copyright) {
		const raw = resolveKey(translations, "footer.copyright");
		if (raw) {
			copyright.textContent = interpolate(raw, { year: new Date().getFullYear() });
		}
	}

	document.querySelectorAll(".team-card__photo, .team-bio-card__photo").forEach((img) => {
		const card = img.closest(".team-card, .team-bio-card");
		const name = card?.querySelector("h3")?.textContent?.trim();
		if (name) img.alt = name;
	});

	const pageTitle = document.querySelector("title[data-i18n]");
	if (pageTitle) {
		const titleKey = pageTitle.getAttribute("data-i18n");
		const titleValue = resolveKey(translations, titleKey);
		if (titleValue) document.title = titleValue;
	}
}

function initAppLinks() {
	document.querySelectorAll("[data-app-link]").forEach((link) => {
		link.href = APP_DOWNLOAD_URL;
		link.target = "_blank";
		link.rel = "noopener noreferrer";
	});
}

function resolveKey(obj, path) {
	return path.split(".").reduce((acc, part) => (acc && acc[part] != null ? acc[part] : null), obj);
}

function interpolate(str, vars) {
	return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : `{${key}}`));
}

function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", (event) => {
			const targetId = link.getAttribute("href");
			if (!targetId || targetId === "#") return;

			const target = document.querySelector(targetId);
			if (!target) return;

			event.preventDefault();
			closeMobileNav();
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	});
}

function initActiveSectionLinks() {
	const sections = document.querySelectorAll("main section[id]");
	const menuLinks = document.querySelectorAll(".navbar__menu a[href^='#']");
	if (!sections.length || !menuLinks.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const id = entry.target.getAttribute("id");
				menuLinks.forEach((link) => {
					link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
				});
			});
		},
		{ rootMargin: "-20% 0px -55% 0px", threshold: 0 }
	);

	sections.forEach((section) => observer.observe(section));
}

function initScrollReveal() {
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.querySelectorAll(".section-block__header").forEach((header) => {
		header.classList.add("reveal-item");
	});

	const cardSelectors = [
		".problem-card",
		".step-card",
		".diff-list__item",
		".feature-card",
		".pricing-card",
		".team-card",
		".team-bio-card",
		".mission-card",
		".analytics__panel",
		".cta__box",
		".screenshot-card",
		".screenshots__copy",
	];

	cardSelectors.forEach((selector) => {
		document.querySelectorAll(selector).forEach((el, index) => {
			el.classList.add("reveal-item");
			el.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
		});
	});

	if (prefersReducedMotion) {
		document.querySelectorAll(".reveal-item").forEach((el) => el.classList.add("is-visible"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add("is-visible");
				obs.unobserve(entry.target);
			});
		},
		{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
	);

	document.querySelectorAll(".reveal-item").forEach((el) => observer.observe(el));
}

function initNavbarScroll() {
	const header = document.querySelector(".site-header");
	if (!header) return;

	const onScroll = () => {
		header.classList.toggle("is-scrolled", window.scrollY > 16);
	};

	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });
}

function initHeroPhoneFloat() {
	const phone = document.querySelector(".hero__phone");
	if (!phone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	setTimeout(() => {
		phone.classList.add("is-floating");
	}, 1200);
}

function initMobileNav() {
	const toggle = document.querySelector(".navbar__toggle");
	const panel = document.querySelector(".navbar__panel");
	if (!toggle || !panel) return;

	toggle.addEventListener("click", () => {
		const open = panel.classList.toggle("is-open");
		toggle.setAttribute("aria-expanded", String(open));
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeMobileNav();
	});
}

function closeMobileNav() {
	const panel = document.querySelector(".navbar__panel");
	const toggle = document.querySelector(".navbar__toggle");
	if (panel) panel.classList.remove("is-open");
	if (toggle) toggle.setAttribute("aria-expanded", "false");
}

function initTeamPhotoFallback() {
	document.querySelectorAll("[data-team-fallback]").forEach((img) => {
		img.addEventListener(
			"error",
			() => {
				const initials = img.getAttribute("data-team-fallback") || "?";
				const wrapper = document.createElement("div");
				wrapper.className = img.classList.contains("team-bio-card__photo")
					? "team-bio-card__photo team-card__avatar-fallback"
					: "team-card__avatar-fallback";
				wrapper.textContent = initials;
				wrapper.setAttribute("aria-hidden", "true");
				img.replaceWith(wrapper);
			},
			{ once: true }
		);
	});
}
