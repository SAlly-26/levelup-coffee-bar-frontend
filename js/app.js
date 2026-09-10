document.addEventListener("DOMContentLoaded", () => {

    const elementos = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });
    }, {
        threshold: 0.15
    });

    elementos.forEach((elemento) => {
        observer.observe(elemento);
    });

});