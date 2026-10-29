<?php
// LFC shared storage for Hostinger / any PHP host (drop-in replacement for the Netlify function).
//   GET  site.php            -> published site data (public)
//   GET  site.php?img=<id>   -> published image (public, cached)
//   POST site.php            -> admin only (header x-admin-key must equal ADMIN_KEY in config.php)
declare(strict_types=1);

$cfg = __DIR__ . '/config.php';
$ADMIN_KEY = '';
if (is_file($cfg)) { $c = require $cfg; if (is_array($c) && isset($c['ADMIN_KEY'])) $ADMIN_KEY = (string)$c['ADMIN_KEY']; }
$DATA = __DIR__ . '/data';
$IMG  = $DATA . '/img';

function out($o, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($o, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}
function ensure_dirs(string $d, string $i): void {
  foreach ([$d, $i] as $p) { if (!is_dir($p) && !@mkdir($p, 0755, true)) out(['error' => 'Cannot create the api/data folder. Set its permissions to 755.'], 500); }
  $ht = $d . '/.htaccess';
  if (!is_file($ht)) { @file_put_contents($ht, "Require all denied\nDeny from all\n"); }
  $ix = $d . '/index.html';
  if (!is_file($ix)) { @file_put_contents($ix, ''); }
}
function atomic_write(string $path, string $data): void {
  $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
  if (@file_put_contents($tmp, $data, LOCK_EX) === false) out(['error' => 'Cannot write to api/data. Check folder permissions (755).'], 500);
  if (!@rename($tmp, $path)) { @unlink($tmp); out(['error' => 'Cannot save file on the server.'], 500); }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  if (isset($_GET['ping'])) out(['ok' => true, 'backend' => 'php', 'keyConfigured' => $ADMIN_KEY !== '' && $ADMIN_KEY !== 'CHANGE-ME']);
  $img = $_GET['img'] ?? null;
  if ($img !== null) {
    if (!preg_match('/^[a-f0-9]{16,64}$/', (string)$img)) { http_response_code(400); exit('Bad id'); }
    $f = $IMG . '/' . $img . '.bin';
    $uri = is_file($f) ? file_get_contents($f) : false;
    if (!$uri || !preg_match('#^data:(image/(?:jpeg|png|webp));base64,(.+)$#s', $uri, $m)) { http_response_code(404); exit('Not found'); }
    header('Content-Type: ' . $m[1]);
    header('Cache-Control: public, max-age=31536000, immutable');
    echo base64_decode($m[2]);
    exit;
  }
  $f = $DATA . '/site-data.json';
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo is_file($f) ? file_get_contents($f) : '{}';
  exit;
}

if ($method === 'POST') {
  if ($ADMIN_KEY === '' || $ADMIN_KEY === 'CHANGE-ME') out(['error' => 'ADMIN_KEY is not set. In Hostinger File Manager open api/config.php, replace CHANGE-ME with your own secret key, save, then try again.'], 500);
  ensure_dirs($DATA, $IMG);

  // Simple brute-force protection: 8 wrong keys per 10 minutes per IP.
  $ip = preg_replace('/[^0-9a-fA-F:.]/', '', $_SERVER['REMOTE_ADDR'] ?? 'x');
  $lf = $DATA . '/fail-' . md5($ip) . '.json';
  $fails = is_file($lf) ? (json_decode((string)file_get_contents($lf), true) ?: []) : [];
  $fails = array_values(array_filter($fails, fn($t) => $t > time() - 600));
  if (count($fails) >= 8) out(['error' => 'Too many wrong keys. Try again in 10 minutes.'], 429);

  $given = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
  if (!hash_equals($ADMIN_KEY, (string)$given)) {
    $fails[] = time(); @file_put_contents($lf, json_encode($fails), LOCK_EX);
    out(['error' => 'Wrong admin key'], 401);
  }
  if (is_file($lf)) @unlink($lf);

  $body = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($body)) out(['error' => 'Bad request'], 400);

  if (($body['action'] ?? '') === 'upload') {
    $uri = (string)($body['dataUri'] ?? '');
    if (!preg_match('#^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$#', $uri)) out(['error' => 'Invalid image'], 400);
    if (strlen($uri) > 5500000) out(['error' => 'Image too large'], 413);
    $id = substr(hash('sha256', $uri), 0, 40);
    $f = $IMG . '/' . $id . '.bin';
    if (!is_file($f)) atomic_write($f, $uri);
    out(['url' => 'api/site.php?img=' . $id]);
  }
  if (($body['action'] ?? '') === 'save') {
    if (!isset($body['data']) || !is_array($body['data'])) out(['error' => 'Missing data'], 400);
    atomic_write($DATA . '/site-data.json', json_encode($body['data'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    out(['ok' => true]);
  }
  out(['error' => 'Unknown action'], 400);
}
http_response_code(405);
echo 'Method not allowed';
