// animations.js

export function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Get the target section's ID from the href attribute
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });
}

export function hoverEffect() {
    const contactButtons = document.querySelectorAll(".contact-btn");
    contactButtons.forEach(button => {
        button.addEventListener("mouseover", () => {
            button.classList.add("hover-effect");
        });
        button.addEventListener("mouseout", () => {
            button.classList.remove("hover-effect");
        });
    });
}
