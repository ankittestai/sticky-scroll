<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StickyScroll - Social Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: white;
            overflow: hidden;
            user-select: none;
        }

        .app-container {
            position: relative;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .feed-container {
            position: relative;
            width: 390px;
            height: 100vh;
            will-change: transform;
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .post {
            height: 100vh;
            position: relative;
            width: 100%;
        }

        .post-media {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .post:nth-child(2n) .post-media {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .post:nth-child(3n) .post-media {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .post:nth-child(4n) .post-media {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .post:nth-child(5n) .post-media {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .post:nth-child(6n) .post-media {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .play-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #000;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            margin-left: 4px;
        }

        .play-button:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 1);
        }

        .video-placeholder {
            position: absolute;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            text-align: center;
        }

        .right-sidebar {
            position: absolute;
            right: 12px;
            bottom: 120px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            z-index: 10;
        }

        .action-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: transform 0.2s ease;
        }

        .action-button:active {
            transform: scale(0.9);
        }

        .action-icon {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .action-icon:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .action-count {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
            text-align: center;
            min-width: 30px;
        }

        .action-icon.liked {
            background: rgba(255, 59, 92, 0.2);
            color: #ff3b5c;
            border-color: #ff3b5c;
        }

        .user-info {
            position: absolute;
            bottom: 20px;
            left: 16px;
            right: 70px;
            z-index: 10;
        }

        .user-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }

        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            color: white;
            border: 2px solid white;
        }

        .username {
            font-weight: 600;
            font-size: 15px;
            color: white;
        }

        .follow-btn {
            background: transparent;
            border: 1.5px solid white;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .follow-btn:hover {
            background: white;
            color: black;
        }

        .caption {
            font-size: 14px;
            line-height: 1.3;
            color: white;
            max-width: 250px;
        }

        .hashtag {
            color: #4ecdc4;
            font-weight: 500;
        }

        .dev-console {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #333;
            z-index: 1000;
            min-width: 160px;
            backdrop-filter: blur(10px);
        }

        .dev-console .line {
            margin: 2px 0;
        }

        .dev-console .value {
            color: #ffff00;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="dev-console" id="devConsole">
            <div class="line">Posts: <span class="value" id="postCount">0</span></div>
            <div class="line">Delay: <span class="value" id="scrollDelay">150ms</span></div>
            <div class="line">Anim: <span class="value" id="animDuration">300ms</span></div>
            <div class="line">Level: <span class="value" id="stickyLevel">None</span></div>
        </div>
        
        <div class="feed-container" id="feedContainer">
        </div>
    </div>

    <script>
        class StickyScrollApp {
            constructor() {
                this.currentPostIndex = 0;
                this.scrollCount = 0;
                this.feedContainer = document.getElementById('feedContainer');
                this.lastScrollTime = Date.now();
                
                // Dev console elements
                this.devPostCount = document.getElementById('postCount');
                this.devScrollDelay = document.getElementById('scrollDelay');
                this.devAnimDuration = document.getElementById('animDuration');
                this.devStickyLevel = document.getElementById('stickyLevel');
                
                this.init();
            }

            init() {
                this.generatePosts(100); // Increased from 25 to 100 posts
                this.setupEventListeners();
                this.updateDevConsole();
            }

            generatePosts(count) {
                const users = [
                    { name: 'techcreator', avatar: 'T', likes: '1240', comments: '89' },
                    { name: 'sarah_vlogs', avatar: 'S', likes: '2.4K', comments: '156' },
                    { name: 'mike_travels', avatar: 'M', likes: '943', comments: '67' },
                    { name: 'emma_cooks', avatar: 'E', likes: '3.1K', comments: '203' },
                    { name: 'david_photos', avatar: 'D', likes: '876', comments: '45' },
                    { name: 'lisa_art', avatar: 'L', likes: '1.8K', comments: '134' }
                ];

                const captions = [
                    'Building the future with code🚀 Who else loves late night coding sessions? <span class="hashtag">#developer</span> <span class="hashtag">#coding</span> <span class="hashtag">#tech</span>',
                    'Another beautiful sunset 🌅 Nature never fails to amaze me <span class="hashtag">#sunset</span> <span class="hashtag">#nature</span>',
                    'Coffee and productivity kind of morning ☕️ <span class="hashtag">#morningvibes</span> <span class="hashtag">#productivity</span>',
                    'Weekend vibes are hitting different 🎉 <span class="hashtag">#weekend</span> <span class="hashtag">#fun</span> <span class="hashtag">#vibes</span>',
                    'Working on something exciting! Can\'t wait to share more 🔥 <span class="hashtag">#comingsoon</span> <span class="hashtag">#excited</span>',
                    'New day, new possibilities 🌟 <span class="hashtag">#motivation</span> <span class="hashtag">#growth</span> <span class="hashtag">#mindset</span>'
                ];

                for (let i = 0; i < count; i++) {
                    const user = users[i % users.length];
                    const post = document.createElement('div');
                    post.className = 'post';
                    post.innerHTML = `
                        <div class="post-media">
                            <div class="play-button">▶</div>
                            <div class="video-placeholder">Video Content</div>
                        </div>
                        
                        <div class="right-sidebar">
                            <div class="action-button" onclick="this.querySelector('.action-icon').classList.toggle('liked')">
                                <div class="action-icon">❤️</div>
                                <div class="action-count">${user.likes}</div>
                            </div>
                            <div class="action-button">
                                <div class="action-icon">💬</div>
                                <div class="action-count">${user.comments}</div>
                            </div>
                            <div class="action-button">
                                <div class="action-icon">📤</div>
                                <div class="action-count">Share</div>
                            </div>
                            <div class="action-button">
                                <div class="action-icon">🔖</div>
                                <div class="action-count"></div>
                            </div>
                        </div>

                        <div class="user-info">
                            <div class="user-header">
                                <div class="user-avatar">${user.avatar}</div>
                                <div class="username">@${user.name}</div>
                                <button class="follow-btn">Follow</button>
                            </div>
                            <div class="caption">${captions[i % captions.length]}</div>
                        </div>
                    `;
                    this.feedContainer.appendChild(post);
                }
            }

            setupEventListeners() {
                // Mouse wheel scrolling
                this.feedContainer.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    
                    const now = Date.now();
                    const scrollDelay = this.calculateScrollDelay();
                    
                    if (now - this.lastScrollTime < scrollDelay) return;
                    this.lastScrollTime = now;
                    
                    if (e.deltaY > 0 && this.currentPostIndex < this.feedContainer.children.length - 1) {
                        this.scrollToNext();
                    } else if (e.deltaY < 0 && this.currentPostIndex > 0) {
                        this.scrollToPrevious();
                    }
                });

                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    const now = Date.now();
                    const scrollDelay = this.calculateScrollDelay();
                    
                    if (now - this.lastScrollTime < scrollDelay) return;
                    this.lastScrollTime = now;
                    
                    if (e.key === 'ArrowDown' && this.currentPostIndex < this.feedContainer.children.length - 1) {
                        this.scrollToNext();
                    } else if (e.key === 'ArrowUp' && this.currentPostIndex > 0) {
                        this.scrollToPrevious();
                    }
                });

                // Touch events
                let startY = 0;
                let isDragging = false;

                this.feedContainer.addEventListener('touchstart', (e) => {
                    startY = e.touches[0].clientY;
                    isDragging = true;
                    this.feedContainer.style.transition = 'none';
                });

                this.feedContainer.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    
                    const currentY = e.touches[0].clientY;
                    const deltaY = currentY - startY;
                    const resistanceFactor = 1 + (this.scrollCount * 0.03);
                    const adjustedDelta = deltaY / resistanceFactor;
                    
                    const currentTransform = this.currentPostIndex * -window.innerHeight;
                    this.feedContainer.style.transform = `translateY(${currentTransform + adjustedDelta}px)`;
                });

                this.feedContainer.addEventListener('touchend', (e) => {
                    if (!isDragging) return;
                    isDragging = false;
                    
                    const currentY = e.changedTouches[0].clientY;
                    const deltaY = currentY - startY;
                    const threshold = 80;
                    
                    if (Math.abs(deltaY) > threshold) {
                        if (deltaY < 0 && this.currentPostIndex < this.feedContainer.children.length - 1) {
                            this.scrollToNext();
                        } else if (deltaY > 0 && this.currentPostIndex > 0) {
                            this.scrollToPrevious();
                        } else {
                            this.snapToCurrent();
                        }
                    } else {
                        this.snapToCurrent();
                    }
                });
            }

            calculateScrollDelay() {
                const baseDelay = 150;
                const maxDelay = 1800; // Restored original values
                const factor = this.scrollCount * 0.15;
                return Math.min(maxDelay, baseDelay + Math.pow(factor, 2) * 80);
            }

            calculateAnimationDuration() {
                const baseDuration = 300;
                const maxDuration = 1100; // Restored original values
                const factor = this.scrollCount * 0.1;
                return Math.min(maxDuration, baseDuration + factor * 120);
            }

            scrollToNext() {
                this.currentPostIndex++;
                this.scrollCount++;
                this.snapToCurrent();
                this.updateDevConsole();
            }

            scrollToPrevious() {
                this.currentPostIndex--;
                this.snapToCurrent();
            }

            snapToCurrent() {
                const targetY = this.currentPostIndex * -window.innerHeight;
                const duration = this.calculateAnimationDuration();
                
                this.feedContainer.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                this.feedContainer.style.transform = `translateY(${targetY}px)`;
                
                setTimeout(() => {
                    this.feedContainer.style.transition = 'none';
                }, duration);
            }

            updateDevConsole() {
                const delay = this.calculateScrollDelay();
                const animDuration = this.calculateAnimationDuration();
                
                let level = 'None';
                if (this.scrollCount >= 15) level = 'Extreme';
                else if (this.scrollCount >= 10) level = 'High';
                else if (this.scrollCount >= 5) level = 'Medium';
                else if (this.scrollCount >= 2) level = 'Low';
                
                this.devPostCount.textContent = this.scrollCount;
                this.devScrollDelay.textContent = delay + 'ms';
                this.devAnimDuration.textContent = animDuration + 'ms';
                this.devStickyLevel.textContent = level;
            }
        }

        // Initialize app when DOM loads
        document.addEventListener('DOMContentLoaded', () => {
            new StickyScrollApp();
        });
    </script>
</body>
</html>
