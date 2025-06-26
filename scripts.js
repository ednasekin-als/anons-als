document.addEventListener('DOMContentLoaded', () => {
  // Инициализация каруселей с видео
  document.querySelectorAll('.video-carousel').forEach((carouselEl) => {
    const videoDataRaw = carouselEl.getAttribute('data-videos');
    let videoList = [];

    try {
      videoList = JSON.parse(videoDataRaw);
    } catch (e) {
      console.warn('Некорректный формат data-videos:', e);
    }

    carouselEl.innerHTML = ''; // очистка

    videoList.forEach(video => {
      const slide = document.createElement('div');
      slide.classList.add('item');
      slide.innerHTML = `
        <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe 
            src="https://player.vimeo.com/video/${video.id}?title=0&byline=0&portrait=0" 
            style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius: 15px;" 
            frameborder="0" 
            allow="autoplay; fullscreen" 
            allowfullscreen>
          </iframe>
        </div>
      `;
      carouselEl.appendChild(slide);
    });

    if (videoList.length > 0 && typeof $(carouselEl).owlCarousel === 'function') {
      $(carouselEl).owlCarousel({
        items: 1,
        center: true,
        dots: true,
        stagePadding: 160,
        margin: 15,
        smartSpeed: 600,
        autoplay: false,
        responsive: {
          0: {
            items: 1,
            center: false,
            stagePadding: 0,
          },
          600: {
            items: 1,
            center: true,
            stagePadding: 100,
          },
          1024: {
            items: 1,
            center: true,
            stagePadding: 200,
          }
        }
      });

      const parent = carouselEl.closest('.ironov__video');
      parent.querySelector('.ironov__video-click--prev')?.addEventListener('click', () => {
        $(carouselEl).trigger('prev.owl.carousel');
      });

      parent.querySelector('.ironov__video-click--next')?.addEventListener('click', () => {
        $(carouselEl).trigger('next.owl.carousel');
      });

      $(carouselEl).trigger('to.owl.carousel', [1, 0]);
    }
  });

  // Инициализация бесконечного горизонтального слайдера
  document.querySelectorAll('.ironov__slideshow').forEach(slideshow => {
    const track = slideshow.querySelector('.ironov__slideshow--images');
    const isReversed = slideshow.classList.contains('is-reversed');
    let leftPos = 0;
    const speed = 0.5;

    function getImgWidth() {
      return track.querySelector('img')?.offsetWidth || 0;
    }

    function animate() {
      const imgWidth = getImgWidth();
      leftPos += isReversed ? speed : -speed;

      if (!isReversed && Math.abs(leftPos) >= imgWidth) {
        track.appendChild(track.querySelector('img'));
        leftPos += imgWidth;
      }

      if (isReversed && leftPos >= 0) {
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        leftPos -= imgWidth;
      }

      track.style.left = leftPos + 'px';
      requestAnimationFrame(animate);
    }

    animate();
  });

  // Автостарт видео при появлении в зоне видимости
  const video = document.querySelector('.ironov__video video');
  if (video) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(video);
  }

  // Наведение на блоки материалов
  document.querySelectorAll('.ironov__materials').forEach(block => {
    const links = block.querySelectorAll('.ironov__materials--links a, .ironov__materials--preview a');

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const index = link.getAttribute('data-index');
        block.classList.add('materials--disable');

        block.querySelectorAll('.ironov__materials--links a').forEach(a => a.classList.remove('active'));
        block.querySelectorAll('.ironov__materials--preview a').forEach(a => a.classList.remove('active'));

        const activeLinks = block.querySelectorAll(`[data-index="${index}"]`);
        activeLinks.forEach(a => a.classList.add('active'));
      });

      link.addEventListener('mouseleave', () => {
        block.querySelectorAll('a.active').forEach(a => a.classList.remove('active'));
      });
    });
  });
});
