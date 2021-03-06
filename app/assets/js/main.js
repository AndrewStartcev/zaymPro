$(document).ready(function () {
  /* Фон для меню */
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 60) {
      $('.header').addClass('header-fixed');
    } else {
      $('.header').removeClass('header-fixed');
    };
  });

  /* Плавный скрол по якорям */
  let offsetTop = 80;
  if ($(document).width() <= 718.98) {
    offsetTop = 80;
  }
  $("li.header__item a, .footer__input a, .btn-up").click(function () {
    var elementClick = $(this).attr("href");
    var destination = $(elementClick).offset().top - offsetTop;
    $("body,html").animate({ scrollTop: destination }, 1500);
  });

  /* Мобильное меню */
	$('.header__burger').on('click', function () {
		$(this).toggleClass('header__burger--active');
		$('.header__menu').toggleClass('header__menu--active');
	});
	$('.header__item').on('click', function () {
		$('.header__burger').removeClass('header__burger--active');
		$('.header__menu').removeClass('header__menu--active');
	});

  $.fn.accordion = function(options) {
		var settings = $.extend({
			autoCollapse: false
		}, options );

		var
			$accordion   = $(this),
			blockName    = $accordion.attr('data-block'),
			$items       = $('.' + blockName + '__item', $accordion);

		$accordion.delegate('.' + blockName + '__title', 'click', triggerAccordion);

		function triggerAccordion(){
			var
				$that         = $(this),
				$parent       = $that.parent(),
				$content      = $parent.children('.' + blockName + '__content'),
				isOpen        = $that.hasClass('js-accordion--open'),
				autoCollapse  = true,
				contentHeight = $content.prop('scrollHeight');

			if(isOpen){
				$that.removeClass('js-accordion--open');
				$parent.removeClass('js-accordion--open');
				$content.css('height', contentHeight);
				setTimeout(function(){
					$content.removeClass('js-accordion--open').css('height', '');
				}, 4);
			} else{
				if(settings.autoCollapse){
					//auto collapse open accordions
				}
				$('.accordion__title').removeClass('js-accordion--open');
				$('.accordion__item').removeClass('js-accordion--open');
				$('.accordion__content').css('height', $('.accordion__content').prop('scrollHeight'));
				$('.accordion__content').removeClass('js-accordion--open').css('height', '');

				$that.addClass('js-accordion--open');
				$parent.addClass('js-accordion--open');
				$content.addClass('js-accordion--open').css('height', contentHeight).one('webkitTransitionEnd', event, function(){
					if(event.propertyName === 'height'){
						$(this).css('height', '');
					}
				});
			}
		}
	};
	$('#faq-accordion').accordion();

  	// === Калькулятор =====================================
	function homeSliderRange(parentBlock, min, max, step_number, seporator) {
		let homeBlock = parentBlock;
		let homeMoneyMin = parseInt($(homeBlock + " " + min).text().replace(/[^+\d]/g, ''));
		let homeMoneyMax = parseInt($(homeBlock + " " + max).text().replace(/[^+\d]/g, ''));

		$(homeBlock + " " + ".index-calc__amount" ).val(homeMoneyMin + seporator);

		$(homeBlock + " " + ".index-calc__range" ).slider({
			range: "min",
			value: homeMoneyMin,
			min: homeMoneyMin,
			max: homeMoneyMax,
			step: step_number,
			slide: function( event, ui ) {
				let numbers = Number(ui.value);
				$(homeBlock + " " + ".index-calc__amount" ).val(numbers + seporator);
			}
		});
	}
	homeSliderRange('#main-calc', '#js-index-calc-min', '#js-index-calc-max', 500, " ₽");
  homeSliderRange('#order-calc', '#js-order-calc-min', '#js-order-calc-max', 500, " ₽");
  homeSliderRange('#form-money-calc', '#js-form-money-calc-min', '#js-form-money-calc-max', 500, " ₽");
  homeSliderRange('#form-date-calc', '#js-form-date-calc-min', '#js-form-date-calc-max', 1, " дней");

  $('input[type="tel"]').inputmask("+7 (999) 999-99-99");
	$('input[name="user_sireis"]').inputmask("99 99");
	$('input[name="user_number"]').inputmask("999 999");
	$('input[name="user_code"]').inputmask("999 999");

});
