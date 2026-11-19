$files = @('app/projects/page.tsx','app/pipeline/page.tsx','app/render/page.tsx','app/settings/page.tsx','app/voices/page.tsx')
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f)
  $i = 0
  Write-Host ("=== " + $f + " ===")
  while (($i = $c.IndexOf('/*', $i)) -ge 0) {
    $end = $c.IndexOf('*/', $i)
    Write-Host ("/* at char " + $i + ", closing */ at " + $end)
    $i = $i + 2
  }
}
