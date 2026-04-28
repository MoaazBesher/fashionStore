document.addEventListener('DOMContentLoaded', function() {
    // إنشاء جسيمات متحركة
    function createParticles(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // أحجام عشوائية
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // مواقع عشوائية
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // شفافية عشوائية
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // إضافة حركة متذبذبة
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            gsap.to(particle, {
                y: `${Math.random() * 50 - 25}px`,
                x: `${Math.random() * 50 - 25}px`,
                duration: duration,
                delay: delay,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            container.appendChild(particle);
        }
    }
    
    // إنشاء الجسيمات
    createParticles('particles-1', 30);
    createParticles('particles-2', 15);
    createParticles('particles-3', 15);
    
    // أنيميشن للبطاقات عند التمرير
    gsap.utils.toArray('.developer-card').forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "back.out(1.7)"
                });
                card.classList.add('animate');
            }
        });
    });
    
    // تأثير الطفو عند التحويم
    document.querySelectorAll('.developer-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                duration: 0.3
            });
        });
    });
});

