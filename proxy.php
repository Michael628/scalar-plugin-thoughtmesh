<?php
$url = 'http://thoughtmesh.net/export/outsideLexias.json.php';
$tag = (isset($_REQUEST['tag'])) ? trim($_REQUEST['tag']) : '';
$documentid = (isset($_REQUEST['documentid'])) ? (int) $_REQUEST['documentid'] : 0;
$groupid = (isset($_REQUEST['groupid'])) ? (int) $_REQUEST['groupid'] : 0;
$external = 1;
$time= time();
$url .= '?tag='.urlencode($tag).'&documentid='.$documentid.'&groupid='.$groupid.'&external='.$external.'&time='.$time;
try {
	$content = file_get_contents($url);
} catch (Exception $e) {
	$arr = array('error'=>$e->getMessage());
	die(json_encode($arr));
}
echo $content;
exit;
?>