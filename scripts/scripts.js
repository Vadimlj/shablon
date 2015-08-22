$(function () {

    $('input[placeholder], textarea[placeholder]').placeholder();

    $('.img-wrap').each(function () {
      var Cl_ces = $(this).attr("class");
      $(this).wrap("<div></div>");

      $(this).parent().attr('class', Cl_ces);

      if ($(this).attr("alt") != false) {
        $('<div class="img-alt"></div>').appendTo($(this).parent());
        $(this).parent().find('.img-alt').html($(this).attr("alt"))     
      }

      $(this).attr("class","");

    });
    
      
    $('input:checkbox, input:radio, select').styler();

}); 