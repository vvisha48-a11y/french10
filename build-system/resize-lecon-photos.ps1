# Downscale + re-encode the vocabulary photos for embedding as data: URIs.
#
# Why locally: Wikimedia serves ONLY the cached 1280px thumbnail for these files.
# Asking for 800/640/320px returns HTTP 400 because a new size must be generated
# on demand, which it refuses for us (same anti-abuse path as the 429s). So the
# width cannot be pushed upstream and the resize happens here.
#
# Uses System.Drawing, which ships with Windows -- no npm dependency is added to
# a project that has none. There is no WebP encoder on this box, so JPEG.
#
# Called by inline-lecon-photos.js; not run by hand.
param(
  [Parameter(Mandatory=$true)][string]$Src,
  [Parameter(Mandatory=$true)][string]$Dest,
  [int]$Width = 640,
  [int]$Quality = 80
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Dest)) { New-Item -ItemType Directory -Force -Path $Dest | Out-Null }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq 'image/jpeg' }
if (-not $codec) { Write-Error 'No JPEG encoder available'; exit 1 }

$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

$done = 0
$bytesIn = 0
$bytesOut = 0

Get-ChildItem -Path $Src -Filter *.jpg | ForEach-Object {
  $inFile = $_.FullName
  $outFile = Join-Path $Dest $_.Name
  $bytesIn += $_.Length

  $img = $null; $bmp = $null; $gfx = $null
  try {
    $img = [System.Drawing.Image]::FromFile($inFile)

    # Never upscale: a source narrower than the target is copied at its own size.
    if ($img.Width -le $Width) {
      $newW = $img.Width; $newH = $img.Height
    } else {
      $newW = $Width
      $newH = [int][Math]::Round($img.Height * ($Width / $img.Width))
    }
    if ($newH -lt 1) { $newH = 1 }

    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $gfx.DrawImage($img, 0, 0, $newW, $newH)

    $bmp.Save($outFile, $codec, $encParams)
    $done++
  } catch {
    Write-Output ("  FAILED " + $_.Exception.Message + " on " + $inFile)
  } finally {
    if ($gfx) { $gfx.Dispose() }
    if ($bmp) { $bmp.Dispose() }
    if ($img) { $img.Dispose() }
  }

  if (Test-Path $outFile) { $bytesOut += (Get-Item $outFile).Length }
}

Write-Output ("resized=" + $done + " width=" + $Width + " quality=" + $Quality +
              " inMB=" + [Math]::Round($bytesIn/1MB, 2) +
              " outMB=" + [Math]::Round($bytesOut/1MB, 2))
