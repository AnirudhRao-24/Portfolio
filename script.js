/**
         * ==========================================
         * PORTFOLIO CONFIGURATION DATA
         * Update this object to automatically populate the website.
         * ==========================================
         */
        const portfolioData = {
            // Initially set to null as requested.
            // Example to add later: ["HTML5", "CSS3", "JavaScript", "React", "Node.js"]
            skills: null, 
            
            // Initially set to null as requested.
            /* Example structure to add later:
            [
                {
                    title: "Project Title 1",
                    description: "A brief description of the project and your role.",
                    tags: ["HTML", "CSS", "JS"],
                    link: "#",
                    imagePlaceholderText: "Project 1 Image"
                },
                ...
            ]
            */
            projects: null 
        };

        /**
         * ==========================================
         * DOM ELEMENTS & INITIALIZATION
         * ==========================================
         */
        document.addEventListener('DOMContentLoaded', () => {
            renderSkills();
            renderProjects();
            setupThemeToggle();
            setupStickyNav();
            setupMobileMenu();
            setupScrollAnimations();
            
            // Set current year in footer
            document.getElementById('year').textContent = new Date().getFullYear();
        });

        /**
         * ==========================================
         * RENDERING FUNCTIONS
         * ==========================================
         */
        function renderSkills() {
            const container = document.getElementById('skillsContainer');
            
            // Handle null/empty state
            if (!portfolioData.skills || portfolioData.skills.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        Skills data is currently empty. Add skills to the configuration object in the script to display them here.
                    </div>
                `;
                return;
            }

            // Render skills if data exists
            let html = '';
            portfolioData.skills.forEach(skill => {
                html += `<span class="skill-tag">${skill}</span>`;
            });
            container.innerHTML = html;
        }

        function renderProjects() {
            const container = document.getElementById('projectsContainer');

            // Handle null/empty state
            if (!portfolioData.projects || portfolioData.projects.length === 0) {
                // Render Placeholders as requested when null
                container.innerHTML = generatePlaceholderCard('Placeholder Project 1') + 
                                      generatePlaceholderCard('Placeholder Project 2') + 
                                      generatePlaceholderCard('Placeholder Project 3');
                return;
            }

            // Render projects if data exists
            let html = '';
            portfolioData.projects.forEach(project => {
                const tagsHtml = project.tags ? project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('') : '';
                
                html += `
                    <div class="project-card">
                        <div class="project-img-placeholder">${project.imagePlaceholderText || 'Image Placeholder'}</div>
                        <div class="project-content">
                            <h3 class="project-title">${project.title}</h3>
                            <div class="project-tags">${tagsHtml}</div>
                            <p class="project-desc">${project.description}</p>
                            <a href="${project.link || '#'}" class="project-link">View Project &rarr;</a>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        // Helper function for placeholder cards
        function generatePlaceholderCard(title) {
            return `
                <div class="project-card">
                    <div class="project-img-placeholder">Image Placeholder</div>
                    <div class="project-content">
                        <h3 class="project-title">${title}</h3>
                        <div class="project-tags">
                            <span class="project-tag">Tag 1</span>
                            <span class="project-tag">Tag 2</span>
                        </div>
                        <p class="project-desc">This is a placeholder description. Update the 'projects' array in the JavaScript configuration to populate real data.</p>
                        <a href="#" class="project-link">View Project &rarr;</a>
                    </div>
                </div>
            `;
        }

        /**
         * ==========================================
         * UI INTERACTIONS (Dark Mode, Nav, Scroll)
         * ==========================================
         */
        
        // Theme Toggle Logic
        function setupThemeToggle() {
            const themeToggleBtn = document.getElementById('themeToggle');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Check local storage or system preference
            const savedTheme = localStorage.getItem('portfolio-theme');
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.setAttribute('data-theme', 'dark');
                updateThemeIcon('dark');
            }

            themeToggleBtn.addEventListener('click', () => {
                const isDark = document.body.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.body.removeAttribute('data-theme');
                    localStorage.setItem('portfolio-theme', 'light');
                    updateThemeIcon('light');
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    localStorage.setItem('portfolio-theme', 'dark');
                    updateThemeIcon('dark');
                }
            });
        }

        function updateThemeIcon(theme) {
            const iconSvg = document.querySelector('.theme-toggle svg');
            const metaThemeColor = document.getElementById('meta-theme-color'); // Get mobile status bar meta tag
            
            if (theme === 'dark') {
                // Sun icon for dark mode (to switch to light)
                iconSvg.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
                iconSvg.setAttribute('fill', 'none');
                iconSvg.setAttribute('stroke', 'currentColor');
                iconSvg.setAttribute('stroke-width', '2');
                // Update Mobile Status bar to black
                if(metaThemeColor) metaThemeColor.setAttribute('content', '#000000');
            } else {
                // Moon icon for light mode (to switch to dark)
                iconSvg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
                iconSvg.removeAttribute('stroke');
                iconSvg.setAttribute('fill', 'currentColor');
                // Update Mobile Status bar to white
                if(metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
            }
        }

        // Sticky Navigation Logic
        function setupStickyNav() {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Mobile Menu Logic
        function setupMobileMenu() {
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.getElementById('navLinks');
            const links = navLinks.querySelectorAll('a');

            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking a link
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }

        // Scroll Animations using Intersection Observer
        function setupScrollAnimations() {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Optional: Unobserve after animating once
                        // observer.unobserve(entry.target); 
                    }
                });
            }, {
                threshold: 0.1, // Trigger when 10% of element is visible
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits bottom
            });

            animatedElements.forEach(el => observer.observe(el));
        }