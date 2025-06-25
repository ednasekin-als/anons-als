$(document).ready(function () {
  $('.video-carousel').each(function (index, carouselEl) {
    const $carousel = $(carouselEl);

    // Получаем и парсим JSON с видео
    const videoDataRaw = $carousel.attr('data-videos');
    let videoList = [];

    try {
      videoList = JSON.parse(videoDataRaw);
    } catch (e) {
      console.warn('Некорректный формат data-videos:', e);
    }

    $carousel.empty();

    // Вставляем слайды
    videoList.forEach(video => {
      const slide = `
        <div class="item">
          <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
            <iframe 
              src="https://player.vimeo.com/video/${video.id}?title=0&byline=0&portrait=0" 
              style="position:absolute;top:0;left:0;width:100%;height:100%;" 
              frameborder="0" 
              allow="autoplay; fullscreen" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
      `;
      $carousel.append(slide);
    });

    if (videoList.length > 0) {
      $carousel.owlCarousel({
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
    }

    const $parent = $carousel.closest('.ironov__video');
    $parent.find('.ironov__video-click--prev').on('click', function () {
      $carousel.trigger('prev.owl.carousel');
    });
    $parent.find('.ironov__video-click--next').on('click', function () {
      $carousel.trigger('next.owl.carousel');
    });

    $carousel.trigger('to.owl.carousel', [1, 0]);
  });


  const $modal = $('#video-modal');
  const $iframeWrapper = $modal.find('.video-modal__iframe-wrapper');
  const $body = $('body');

  function openModal(videoId) {
    const iframe = `
      <iframe 
        src="https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0" 
        allow="autoplay; fullscreen" 
        allowfullscreen>
      </iframe>`;
    $iframeWrapper.html(iframe);
    $modal.addClass('is-active');
    $body.addClass('modal-open'); // запрет скролла
  }

  function closeModal() {
    $modal.removeClass('is-active');
    $body.removeClass('modal-open'); // включить скролл
    setTimeout(() => {
      $iframeWrapper.html('');
    }, 300);
  }

  $('.ironov__play').on('click', function () {
    const videoId = $(this).data('video-id');
    openModal(videoId);
  });

  $modal.on('click', function (e) {
    if (
      $(e.target).is('.video-modal__overlay') ||
      $(e.target).is('.video-modal__close')
    ) {
      closeModal();
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $modal.hasClass('is-active')) {
      closeModal();
    }
  });

  function initSlider($container, speed = 0.2) {
    const $track = $container.find('.ironov__slideshow--images');
    let leftPos = 0;
    const isReversed = $container.hasClass('is-reversed');

    function getImgWidth() {
      return $track.find('img').eq(0).outerWidth(true);
    }

    function animate() {
      const imgWidth = getImgWidth();
      leftPos += isReversed ? speed : -speed;

      if (!isReversed && Math.abs(leftPos) >= imgWidth) {
        $track.append($track.find('img').first());
        leftPos += imgWidth;
      }

      if (isReversed && leftPos >= 0) {
        $track.prepend($track.find('img').last());
        leftPos -= imgWidth;
      }

      $track.css('left', leftPos + 'px');
      requestAnimationFrame(animate);
    }

    animate();
  }

  $(function () {
    $('.ironov__slideshow').each(function () {
      initSlider($(this), 0.5); // очень медленное движение
    });
  });


  const video = $('.ironov__video video').get(0);
  if (!video) return;

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

  $('.ironov__materials').each(function () {
    const $block = $(this); // текущий блок

    // наведение на ссылки
    $block.find('.ironov__materials--links a, .ironov__materials--preview a').hover(
      function () {
        const index = $(this).data('index');

        $block.addClass('materials--disable');

        $block.find('.ironov__materials--links a').removeClass('active');
        $block.find('.ironov__materials--preview a').removeClass('active');

        $block.find('.ironov__materials--links a[data-index="' + index + '"]').addClass('active');
        $block.find('.ironov__materials--preview a[data-index="' + index + '"]').addClass('active');
      },
      function () {
        $block.find('.ironov__materials--links a').removeClass('active');
        $block.find('.ironov__materials--preview a').removeClass('active');
      }
    );
  });

});
