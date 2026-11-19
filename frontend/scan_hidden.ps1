$f = 'app/projects/page.tsx'
$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $f).Path)
Write-Host ("LEN: " + $bytes.Length)
$bad = @()
for ($i = 0; $i -lt $bytes.Length; $i++) {
  $b = $bytes[$i]
  $ok = ($b -ge 32 -and $b -le 126) -or $b -eq 9 -or $b -eq 10 -or $b -eq 13
  if (-not $ok) { $bad += ($i).ToString() + ":0x" + $b.ToString("X2") }
}
if ($bad.Count -gt 0) {
  Write-Host ("HIDDEN_BYTES:")
  $bad | Write-Host
} else {
  Write-Host "NO HIDDEN BYTES"
}
# Show bytes around the return <div (find the line-33 area)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$idx = $text.IndexOf("return (")
Write-Host ("return( index: " + $idx)
$snippet = $text.Substring($idx, 120)
$snippet.ToCharArray() | ForEach-Object { Write-Host ([int]$_) } 
