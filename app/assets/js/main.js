$(document).ready(function () {
  /* Фон для меню */
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 120) {
      $('.header').addClass('header-fixed');
    } else {
      $('.header').removeClass('header-fixed');
    };
  });

  /* Плавный скрол по якорям */
  let offsetTop = 0;
  if ($(document).width() <= 718.98) {
    offsetTop = 30;
  }
  $("li.header__item a, .footer__input a, .btn-up").click(function () {
    var elementClick = $(this).attr("href");
    var destination = $(elementClick).offset().top - offsetTop;
    $("body,html").animate({ scrollTop: destination }, 1500);
  });

  /* Мобильное меню */
	$('.header__burger').on('click', function () {
		$(this).toggleClass('header__burger_close');
		$('.mobile-menu').toggleClass('mobile-menu_open');
		$('.header').toggleClass('header_open');
		$('body').toggleClass('lock');
	});
	$('.mobile-menu__item').on('click', function () {
		$('.header__burger').removeClass('header__burger_close');
		$('.mobile-menu').removeClass('mobile-menu_open');
		$('.header').removeClass('header_open');
		$('body').removeClass('lock');
	});

  /* Всплывающие окна по классу и ID */
  $('*[data-popup]').on('click', function (e) {
    $('.popup').removeClass('show');
    let popupId = $(this).attr('data-popup');
    if ($(this).is('[data-theme]')) {
      let popupTheme = $(this).attr('data-theme');
      $(popupId + ' input[name="theme"]').val(popupTheme)
    }
    $(popupId).addClass('show');
    $('body').addClass('lock');
    $('.popup-form').addClass(' show');
    $('.popup-loading').removeClass('show');
    $('.popup-send').removeClass('show');
    $('.popup-error').removeClass('show');
  });
  $('.popup__close, .popup-close').on('click', function () {
    $('.popup').removeClass('show');
    $('body').removeClass('lock');
    $('.popup-form').addClass(' show');
    $('.popup-loading').removeClass('show');
    $('.popup-send').removeClass('show');
    $('.popup-error').removeClass('show');
  });
  $(document).on("mouseup", function (e) {
    var div = $(".popup__body");
    if (!div.is(e.target) && div.has(e.target).length === 0) {
      $('.popup').removeClass('show');
      $('body').removeClass('lock');
      $('.popup-form').addClass(' show');
      $('.popup-loading').removeClass('show');
      $('.popup-send').removeClass('show');
      $('.popup-error').removeClass('show');
    }
  });

  /* Аккардион */
	const mainFaq = document.querySelector('.main-faq');
	if (mainFaq) {
		$('.faq-accordion').on('click', function () {
			$('.faq-accordion').removeClass('open');
			$(this).addClass('open');
		});
	}

  /* Обработка, валидация форм и отправка */
  $("form").each(function () {
    $(this).validate({
      rules: {
        user_name: {
          required: true,
          minlength: 2
        },
        user_tel: {
          required: true,
          minlength: 11
        },
      },
      messages: {
        user_name: {
          required: "Обязательное поле не заполнено!",
          minlength: "Минимальная длина слова 2 символа"
        },
        user_tel: {
          required: "Обязательное поле не заполнено!",
          minlength: "Минимальная длина номера 11 цифр"
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type: "POST",
          url: "/assets/php/mail.php",
          data: $(form).serialize(),
          beforeSend: function () {
            $('.popup').addClass('show');
            $('.popup-form').removeClass('show');
            $('.popup-loading').addClass('show');
            $(form).find('input[type="submit"]').prop('disabled', true);
          },
          error: function () {
            $('.popup').addClass('show');
            $('.popup-form').removeClass(' show');
            $('.popup-loading').removeClass('show');
            $('.popup-error').addClass('show');
            $(form).find('input[type="submit"]').prop('disabled', false);
            $(form)[0].reset();
          },
          success: function () {
            $('.popup').addClass('show');
            $('.popup-form').removeClass(' show');
            $('.popup-loading').removeClass('show');
            $('.popup-send').addClass('show');
            $(form)[0].reset();
            $(form).find('input[type="submit"]').prop('disabled', false);
          }
        });
        return false;
      }
    });
  });

});

// ======== Маска для телефона ===============
document.addEventListener("DOMContentLoaded", function () {
  var phoneInputs = document.querySelectorAll('input[type="tel"]');

  var getInputNumbersValue = function (input) {
    return input.value.replace(/\D/g, '');
  }

  var onPhonePaste = function (e) {
    var input = e.target,
      inputNumbersValue = getInputNumbersValue(input);
    var pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      var pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
        return;
      }
    }
  }

  var onPhoneInput = function (e) {
    var input = e.target,
      inputNumbersValue = getInputNumbersValue(input),
      selectionStart = input.selectionStart,
      formattedInputValue = "";

    if (!inputNumbersValue) {
      return input.value = "";
    }

    if (input.value.length != selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
        input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
      var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
      formattedInputValue = input.value = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
  }
  var onPhoneKeyDown = function (e) {
    var inputValue = e.target.value.replace(/\D/g, '');
    if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = "";
    }
  }
  for (var phoneInput of phoneInputs) {
    phoneInput.addEventListener('keydown', onPhoneKeyDown);
    phoneInput.addEventListener('input', onPhoneInput, false);
    phoneInput.addEventListener('paste', onPhonePaste, false);
  }
})
