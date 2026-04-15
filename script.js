document.addEventListener("DOMContentLoaded", () => {
    
    // --- CANVAS ANTI-GRAVITY PARTICLES ---
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener("resize", resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5 - 0.2; // slight upward drift (anti-gravity)
            this.opacity = Math.random() * 0.5 + 0.1;
            
            // Randomly choose between blue and purple shades
            const isBlue = Math.random() > 0.5;
            if(isBlue) {
                this.color = `rgba(0, 243, 255, ${this.opacity})`;
            } else {
                this.color = `rgba(189, 0, 255, ${this.opacity})`;
            }
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // wrap around
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        const numParticles = Math.min(window.innerWidth / 10, 150); // cap max particles
        for(let i=0; i<numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connecting lines if close enough
        connectParticles();
        
        requestAnimationFrame(animateParticles);
    }
    
    function connectParticles() {
        for(let i=0; i<particles.length; i++) {
            for(let j=i; j<particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                
                if(distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 - distance/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    initParticles();
    animateParticles();
    
    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if(window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");
    
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("toggle");
    });
    
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });

    // --- GSAP ANIMATIONS ---
    if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero Animations
        const heroTl = gsap.timeline();
        heroTl.from(".greeting", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2})
              .from(".name", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6")
              .from(".title", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6")
              .from(".tagline", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6")
              .from(".hero-cta", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6");

        // Sections fade up on scroll
        const sections = document.querySelectorAll("section:not(.hero-section)");
        sections.forEach(sec => {
            gsap.from(sec, {
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // Stagger skills
        gsap.from(".skills-category", {
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 75%",
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });

        // Stagger projects
        gsap.from(".project-card", {
            scrollTrigger: {
                trigger: ".projects-section",
                start: "top 75%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // --- VANILLA TILT INIT ---
    if(typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }

});
