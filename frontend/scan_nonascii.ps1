$files = @('app/projects/page.tsx','app/pipeline/page.tsx','app/render/page.tsx','app/settings/page.tsx','app/voices/page.tsx','app/layout.tsx','app/page.tsx')
foreach ($f in $files) {
  if (!(Test-Path $f)) { continue }
  $p = (Resolve-Path $f).Path
  $content = [System.IO.File]::ReadAllText($p)
  $bad = @()
    for ($i = 0; $i -lt $content.Length; $i++) {
      $c = $content[$i]
      $code = [int][char]$c
      if ($code -gt 127) { $bad += ($i+1).ToString() + ":U+" + $code.ToString("X4") + "(" + $c + ")" }
      if ($code -eq 13) { $bad += ($i+1).ToString() + ":CR" }
    }
  if ($bad.Count -gt 0) {
    Write-Host ("=== " + $f + " ===")
    $bad | Write-Host
  } else {
    Write-Host ("CLEAN: " + $f)
  }
}
