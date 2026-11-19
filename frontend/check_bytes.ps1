$files = @('app/projects/page.tsx','app/pipeline/page.tsx','app/render/page.tsx','app/settings/page.tsx','app/voices/page.tsx','app/layout.tsx','app/page.tsx')
foreach ($f in $files) {
  if (Test-Path $f) {
    $p = (Resolve-Path $f).Path
    $bytes = [System.IO.File]::ReadAllBytes($p)
    $first = $bytes[0..[math]::Min(15,$bytes.Length-1)] -join ','
    $bom = ($bytes[0] -eq 237 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191)
    Write-Host ("FILE: " + $f)
    Write-Host ("FIRST16: " + $first)
    Write-Host ("HAS_BOM: " + $bom)
    Write-Host ("LEN: " + $bytes.Length)
  } else {
    Write-Host ("MISSING: " + $f)
  }
}
