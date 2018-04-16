<?php

namespace Drupal\sp_modal\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenDialogCommand;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class SpModalController extends ControllerBase {

  /**
   * @return AjaxResponse
   */
  public function nodeContent($nid) {
    $node = Node::load($nid);
    $view = node_view($node, 'default');
    $html = render($view);

    $response = new AjaxResponse();
    $response->addCommand(new OpenModalDialogCommand(t('Modal Title'), $html, ['width' => '700px']));
    return $response;
  }

  /**
   * @return AjaxResponse
   */
  public function termContent($tid) {
    $term = Term::load($tid);
    $view = taxonomy_term_view($term, 'default');
    $html = render($view);
    $options = [
      'dialogClass' => 'popup-dialog-class',
      'top' => '200',
      'width' => '50%',
      'height' => '50%',
  ];
//$html = "Coucou";
    $response = new AjaxResponse();
    $response->addCommand(new OpenModalDialogCommand($term->name->value, $html, $options));
    return $response;
  }

}
