/**
 * @file
 * Contains JavaScript used on home_page.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.spiravitaHomeBehavior = {
    attach: function (context, settings) {
      $('body', context).once('spiravitaHomeBehavior').each(function () {

        $('section#block-block-entete .carousel').carousel({
          interval: 5000
        });
        $('section#block-block-location .carousel').carousel({
          interval: 5000
        });
        $('section#block-block-activites .view-content .row .col h2 > a').each(function () {
          $(this).addClass('use-ajax').attr('data-dialog-type','modal');
          $(this).attr('href', '/sp_modal' + $(this).attr('href'));
        });
        $('.field--name-field-prenom > div.field--item > a').each(function () {
          $(this).addClass('use-ajax').attr('data-dialog-type','modal');
          $(this).attr('href', '/sp_modal' + $(this).attr('href'));
        });
        $('.field--name-field-activite > div.field--item > a').each(function () {
          $(this).addClass('use-ajax').attr('data-dialog-type','modal');
          $(this).attr('href', '/sp_modal' + $(this).attr('href'));
        });
        $('.field--name-field-image > div.field--item > a').each(function () {
          $(this).addClass('use-ajax').attr('data-dialog-type','modal');
          $(this).attr('href', '/sp_modal' + $(this).attr('href'));
        });
        $('.display-modal > a').each(function () {
          $(this).addClass('use-ajax').attr('data-dialog-type','modal');
          $(this).attr('href', '/sp_modal' + $(this).attr('href'));
        });
        $('body').on('click','.ui-widget-overlay', function () {
            $('.ui-dialog').filter(function () {
            return $(this).css("display") === "block";
            }).find('.ui-dialog-content').dialog('close');
        });
        $("nav#block-spiravita-main-menu ul li a[href^='#']").on('click', function (e) {
           e.preventDefault();
           var hash = this.hash;
           $('html, body').animate({
               scrollTop: ($(hash).offset().top - 105)
             }, 800, function () {
               //window.location.hash = hash;
             });
        });
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
