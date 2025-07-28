import React, { useState, useEffect, useRef } from 'react';

const StickyScrollApp = () => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);
  const feedContainerRef = useRef(null);
  const lastScrollTimeRef = useRef(Date.now());

  const users = [
    { name: 'techcreator', avatar: 'T', likes: '1240', comments: '89' },
    { name: 'sarah_vlogs', avatar: 'S', likes: '2.4K', comments: '156' },
    { name: 'mike_travels', avatar: 'M', likes: '943', comments: '67' },
    { name: 'emma_cooks', avatar: 'E', likes: '3.1K', comments: '203' },
    { name: 'david_photos', avatar: 'D', likes: '876', comments: '45' },
    { name: 'lisa_art', avatar: 'L', likes: '1.8K', comments: '134' },
    { name: 'john_music', avatar: 'J', likes: '4.2K', comments: '287' },
    { name: 'anna_fitness', avatar: 'A', likes: '1.5K', comments: '98' }
  ];

  const captions = [
    'Building the future with code🚀 Who else loves late night coding sessions? #developer #coding #tech',
    'Another beautiful sunset 🌅 Nature never fails to amaze me #sunset #nature',
    'Coffee and productivity kind of morning ☕️ #morningvibes #productivity',
    'Weekend vibes are hitting different 🎉 #weekend #fun #vibes',
    'Working on something exciting! Can\'t wait to share more 🔥 #comingsoon #excited',
    'New day, new possibilities 🌟 #motivation #growth #mindset',
    'Sometimes you just need to slow down and appreciate 🙏 #mindfulness #gratitude',
    'Creating something beautiful today ✨ #art #creativity #inspiration'
  ];

  const calculateScrollDelay = () => {
    const baseDelay = 150;
    const maxDelay = 1800;
    const factor = scrollCount * 0.15;
    return Math.min(maxDelay, baseDelay + Math.pow(factor, 2) * 80);
  };

  const calculateAnimationDuration = () => {
    const baseDuration = 300;
    const maxDuration = 1100;
    const factor = scrollCount * 0.1;
    return Math.min(maxDuration, baseDuration + factor * 120);
  };

  const getStickyLevel = () => {
    if (scrollCount >= 15) return 'Extreme';
    if (scrollCount >= 10) return 'High';
    if (scrollCount >= 5) return 'Medium';
    if (scrollCount >= 2) return 'Low';
    return 'None';
  };

  const scrollToNext = () => {
    if (currentPostIndex < 99) {
      setCurrentPostIndex(prev => prev + 1);
      setScrollCount(prev => prev + 1);
    }
  };

  const scrollToPrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(prev => prev - 1);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    
    const now = Date.now();
    const scrollDelay = calculateScrollDelay();
    
    if (now - lastScrollTimeRef.current < scrollDelay) return;
    lastScrollTimeRef.current = now;
    
    if (e.deltaY > 0) {
      scrollToNext();
    } else {
      scrollToPrevious();
    }
  };

  const handleKeyDown = (e) => {
    const now = Date.now();
    const scrollDelay = calculateScrollDelay();
    
    if (now - lastScrollTimeRef.current < scrollDelay) return;
    lastScrollTimeRef.current = now;
    
    if (e.key === 'ArrowDown') {
      scrollToNext();
    } else if (e.key === 'ArrowUp') {
      scrollToPrevious();
    }
  };

  const handleTouchStart = useRef({ startY: 0, isDragging: false });

  const onTouchStart = (e) => {
    handleTouchStart.current.startY = e.touches[0].clientY;
    handleTouchStart.current.isDragging = true;
  };

  const onTouchEnd = (e) => {
    if (!handleTouchStart.current.isDragging) return;
    handleTouchStart.current.isDragging = false;
    
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - handleTouchStart.current.startY;
    const threshold = 80;
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY < 0) {
        scrollToNext();
      } else {
        scrollToPrevious();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [scrollCount, currentPostIndex]);

  const toggleLike = (e) => {
    e.currentTarget.querySelector('.action-icon').classList.toggle('liked');
  };

  const animationDuration = calculateAnimationDuration();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden select-none">
      {/* Dev Console */}
      <div className="fixed top-2 right-2 bg-black bg-opacity-90 text-green-400 font-mono text-xs p-2 rounded border border-gray-600 z-50 backdrop-blur min-w-40">
        <div className="mb-1">Posts: <span className="text-yellow-400">{scrollCount}</span></div>
        <div className="mb-1">Delay: <span className="text-yellow-400">{calculateScrollDelay()}ms</span></div>
        <div className="mb-1">Anim: <span className="text-yellow-400">{animationDuration}ms</span></div>
        <div>Level: <span className="text-yellow-400">{getStickyLevel()}</span></div>
      </div>

      {/* Main App Container */}
      <div className="relative h-screen w-screen overflow-hidden flex justify-center items-center">
        <div 
          ref={feedContainerRef}
          className="relative w-96 h-screen transition-transform ease-out"
          style={{
            transform: `translateY(${currentPostIndex * -100}vh)`,
            transitionDuration: `${animationDuration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
          onWheel={handleWheel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {Array.from({ length: 100 }, (_, i) => {
            const user = users[i % users.length];
            const caption = captions[i % captions.length];
            
            const gradients = [
              'from-blue-800 to-blue-600',
              'from-purple-700 to-purple-500',
              'from-pink-600 to-red-500',
              'from-blue-500 to-cyan-400',
              'from-green-500 to-teal-400',
              'from-pink-500 to-yellow-400'
            ];

            return (
              <div key={i} className="h-screen relative w-full">
                <div className={`w-full h-full relative flex items-center justify-center bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                  {/* Play Button */}
                  <div className="w-15 h-15 rounded-full bg-white bg-opacity-90 flex items-center justify-center text-xl text-black cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-opacity-100 ml-1">
                    ▶
                  </div>
                  
                  {/* Video Placeholder */}
                  <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 text-white text-opacity-60 text-sm text-center">
                    Video Content
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="absolute right-3 bottom-30 flex flex-col gap-5 z-10">
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer transition-transform duration-200 active:scale-90" onClick={toggleLike}>
                    <div className="action-icon w-11 h-11 rounded-full bg-white bg-opacity-10 backdrop-blur flex items-center justify-center text-lg transition-all duration-300 hover:bg-opacity-20 hover:scale-110 border border-white border-opacity-5">
                      ❤️
                    </div>
                    <div className="text-xs text-white text-opacity-80 font-medium text-center min-w-7">{user.likes}</div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer transition-transform duration-200 active:scale-90">
                    <div className="w-11 h-11 rounded-full bg-white bg-opacity-10 backdrop-blur flex items-center justify-center text-lg transition-all duration-300 hover:bg-opacity-20 hover:scale-110 border border-white border-opacity-5">
                      💬
                    </div>
                    <div className="text-xs text-white text-opacity-80 font-medium text-center min-w-7">{user.comments}</div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer transition-transform duration-200 active:scale-90">
                    <div className="w-11 h-11 rounded-full bg-white bg-opacity-10 backdrop-blur flex items-center justify-center text-lg transition-all duration-300 hover:bg-opacity-20 hover:scale-110 border border-white border-opacity-5">
                      📤
                    </div>
                    <div className="text-xs text-white text-opacity-80 font-medium text-center min-w-7">Share</div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer transition-transform duration-200 active:scale-90">
                    <div className="w-11 h-11 rounded-full bg-white bg-opacity-10 backdrop-blur flex items-center justify-center text-lg transition-all duration-300 hover:bg-opacity-20 hover:scale-110 border border-white border-opacity-5">
                      🔖
                    </div>
                    <div className="text-xs text-white text-opacity-80 font-medium text-center min-w-7"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="absolute bottom-5 left-4 right-16 z-10">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-teal-400 flex items-center justify-center font-bold text-sm text-white border-2 border-white">
                      {user.avatar}
                    </div>
                    <div className="font-semibold text-sm text-white">@{user.name}</div>
                    <button className="bg-transparent border border-white text-white px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-black">
                      Follow
                    </button>
                  </div>
                  <div className="text-sm leading-tight text-white max-w-60">
                    {caption.split('#').map((part, index) => (
                      <span key={index}>
                        {index === 0 ? part : <span className="text-teal-400 font-medium">#{part}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .action-icon.liked {
          background: rgba(255, 59, 92, 0.2) !important;
          color: #ff3b5c !important;
          border-color: #ff3b5c !important;
        }
        
        @media (max-width: 480px) {
          .feed-container {
            width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StickyScrollApp;
