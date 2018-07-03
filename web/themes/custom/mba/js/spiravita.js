/**
* @file
* Contains JavaScript used on home_page.
*/

(function ($, Drupal, drupalSettings) {
'use strict';
Drupal.behaviors.spiravitaHomeBehavior = {
  attach: function (context, settings) {
    $('body', context).once('spiravitaHomeBehavior').each(function () {

      $('section#block-mba-block-entete .carousel').carousel({
        interval: 5000
      });
      $('section#block-mba-block-location .carousel').carousel({
        interval: 5000
      });
      $("nav#block-mba-main-menu ul li a[href^='#']").on('click', function (e) {
         e.preventDefault();
         var hash = this.hash;
         $('html, body').animate({
             scrollTop: ($(hash).offset().top - 105)
           }, 800, function () {});
      });
      $("#block-mba-block-activites .view-content .row .col, #block-mba-block-cours span.field-content, #block-mba-block-ateliers span.field-content").each(function () {
        $(this).on('mouseover', function (e) {
          $(this).find(".mba-overload").addClass("active");
        });
        $(this).on('mouseout', function (e) {
          $(this).find(".mba-overload").removeClass("active");
        });
      });

      var highestBox = 0;
      $('#block-mba-block-cours article.cours').each(function () {
          if ($(this).height() > highestBox) {
          highestBox = $(this).height();
        }
      });
      $('#block-mba-block-cours article.cours').height(highestBox);
      highestBox = 0;
      $('#block-mba-block-ateliers article.atelier').each(function () {
          if ($(this).height() > highestBox) {
          highestBox = $(this).height();
        }
      });
      $('#block-mba-block-ateliers article.atelier').height(highestBox);
    });
  }
};
})(jQuery, Drupal, drupalSettings);
