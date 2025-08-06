<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

use chums\ui\WebUI2;
use chums\user\Groups;


require_once 'autoload.inc.php';

$ui = new WebUI2([
    'contentFile' => 'body.inc.php',
    'title' => 'Direct Labor Admin',
    'bodyClassName' => 'container-fluid',
    'requiredRoles' => [Groups::DIRECTLABOR]
]);
$ui->addViteManifest()
    ->render();
//require_once 'access.inc.php';
//
//$bodyPath = "apps/direct-labor-admin";
//$title = "Direct Labor Admin";
//$description = "";
//
//$ui = new WebUI($bodyPath, $title, $description, true, 5);
//$ui->bodyClassName = 'container-fluid';
//$ui->addManifest('public/js/manifest.json');
//$ui->Send();
