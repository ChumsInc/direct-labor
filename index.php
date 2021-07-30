<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once 'autoload.inc.php';
require_once 'access.inc.php';

$bodyPath = "apps/imprint-screen-list";
$title = "Imprint Screen List";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, true);
$ui->bodyClassName = 'container-fluid';
$ui->addManifest('public/js/manifest.json');
$ui->Send();
