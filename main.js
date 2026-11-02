document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ACCORDION FUNCTIONALITY ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // --- 2. LIGHTBOX GALLERY ---
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxTarget');
    const closeLightbox = document.querySelector('.lightbox-close');

    if (galleryImages.length > 0 && lightbox) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
            });
        });

        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    // --- 3. DYNAMIC SEARCH / FILTERING ---
    const searchInput = document.getElementById('courseSearch');
    const courseCards = document.querySelectorAll('.course-card');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            courseCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- 4. INTERACTIVE MAP (LEAFLET.JS) ---
    if (document.getElementById('map')) {
        // Centered on Johannesburg/Gauteng coordinates
        const map = L.map('map').setView([-26.2041, 28.0473], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([-26.2041, 28.0473]).addTo(map)
            .bindPopup('<b>School of the Gifted</b><br>Main Hub, Gauteng.')
            .openPopup();
    }

    // --- 5. CONTACT FORM VALIDATION & MAILTO COMPILATION ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const type = document.getElementById('messageType').value;
            const message = document.getElementById('message').value.trim();

            // Clear errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            if (name.length < 2) {
                document.getElementById('nameError').textContent = 'Please enter a valid name (min 2 characters).';
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            if (!type) {
                document.getElementById('typeError').textContent = 'Please select a message type.';
                isValid = false;
            }

            if (message.length < 10) {
                document.getElementById('messageError').textContent = 'Message must be at least 10 characters long.';
                isValid = false;
            }

            if (isValid) {
                // Compile into mailto hyperlink as required by prompt
                const subject = encodeURIComponent(`[${type.toUpperCase()}] Inquiry from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                
                document.getElementById('contactFormStatus').innerHTML = `<p style="color: green;">Validation successful! Launching your mail client...</p>`;
                
                setTimeout(() => {
                    window.location.href = `mailto:info@schoolofthegifted.co.za?subject=${subject}&body=${body}`;
                }, 1000);
            }
        });
    }

    // --- 6. ENQUIRY FORM DYNAMIC COST/AVAILABILITY PROCESSOR ---
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('enquiryName').value.trim();
            const email = document.getElementById('enquiryEmail').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const category = document.getElementById('interest').value;
            const resultBox = document.getElementById('enquiryResult');

            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            if (!name) {
                document.getElementById('enquiryNameError').textContent = 'Name is required.';
                isValid = false;
            }

            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(phone)) {
                document.getElementById('phoneError').textContent = 'Enter a valid 10-digit SA phone number (e.g. 0821234567).';
                isValid = false;
            }

            if (!category) {
                document.getElementById('interestError').textContent = 'Please select a category.';
                isValid = false;
            }

            if (isValid) {
                let responseText = "";
                if (category === "robotics") {
                    responseText = `Hello ${name}, our Robotics & AI program costs <strong>R2,500/term</strong>. Next intake starts <strong>1st of next month</strong>.`;
                } else if (category === "coding") {
                    responseText = `Hello ${name}, Full-Stack Coding costs <strong>R3,000/term</strong>. Seats are currently <strong>80% full</strong>.`;
                } else if (category === "sponsor") {
                    responseText = `Thank you ${name}. Our sponsorship packet has been prepared and our team will contact you at ${email}.`;
                } else {
                    responseText = `Thank you ${name}. Volunteer mentorship interviews open on the 15th.`;
                }

                resultBox.style.display = 'block';
                resultBox.innerHTML = `<h3>Enquiry Breakdown</h3><p>${responseText}</p>`;
            }
        });
    }
});