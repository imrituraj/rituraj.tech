Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background dark exhibition canvas
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(13, 17, 23))
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# Load Ritu photo
$srcImg = [System.Drawing.Image]::FromFile("c:\Developer\rituraj\public\images\Ritu_1.jpeg")

# Crop centered on his face and chest:
# Ritu_1 is 960x1280. Face center is x=500, y=550.
$cropX = 140
$cropY = 320
$cropSize = 680
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)

# Destination circular portrait on right side
$dstSize = 470
$dstX = 665
$dstY = 80

# Outer ambient glow ring
$glowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(35, 20, 207, 147), 16)
$g.DrawEllipse($glowPen, ($dstX - 8), ($dstY - 8), ($dstSize + 16), ($dstSize + 16))

# Clip circular area and draw image
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse($dstX, $dstY, $dstSize, $dstSize)
$g.SetClip($path)

$dstRect = New-Object System.Drawing.Rectangle($dstX, $dstY, $dstSize, $dstSize)
$g.DrawImage($srcImg, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.ResetClip()

# Crisp mint accent ring
$mintPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 207, 147), 4)
$g.DrawEllipse($mintPen, $dstX, $dstY, $dstSize, $dstSize)

# Brushes & Fonts
$mintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 207, 147))
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255))
$grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 174, 192))
$darkPillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(22, 27, 34))
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(48, 54, 61), 1)

# Badge: [01 // FOLIO] IIT PATNA M.TECH CSE
$pillRect = New-Object System.Drawing.Rectangle(75, 80, 360, 38)
$g.FillRectangle($darkPillBrush, $pillRect)
$g.DrawRectangle($borderPen, $pillRect)

$tagFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$g.DrawString("[01 // FOLIO]  M.TECH CSE @ IIT PATNA", $tagFont, $mintBrush, 92, 88)

# Name: Ritu Raj
$nameFont = New-Object System.Drawing.Font("Georgia", 60, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Ritu Raj", $nameFont, $whiteBrush, 70, 145)

# Role Title
$roleFont = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Software Development Engineer", $roleFont, $whiteBrush, 75, 260)

# Subtitle
$subFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Regular)
$g.DrawString("Scalable Distributed Systems & High-Performance Backends", $subFont, $mintBrush, 75, 305)

# Description
$descFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)
$g.DrawString("Engineering robust architectures, low-latency microservices,", $descFont, $grayBrush, 75, 355)
$g.DrawString("and algorithmic solutions at the intersection of logic & performance.", $descFont, $grayBrush, 75, 385)

# Tech Stack Chips
$codeFont = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Bold)
$chipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(22, 27, 34))
$chipPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(48, 54, 61), 1)

$chips = @("SYSTEM DESIGN", "ALGORITHMS", "DISTRIBUTED SYSTEMS", "ACID / C++ / REACT")
$chipX = 75
foreach ($chip in $chips) {
    $size = $g.MeasureString($chip, $codeFont)
    $w = [int]$size.Width + 24
    $rect = New-Object System.Drawing.Rectangle($chipX, 440, $w, 32)
    $g.FillRectangle($chipBrush, $rect)
    $g.DrawRectangle($chipPen, $rect)
    $g.DrawString($chip, $codeFont, $grayBrush, ($chipX + 12), 448)
    $chipX += $w + 12
}

# Domain & Verification Flag
$g.FillEllipse($mintBrush, 75, 523, 10, 10)
$domainFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$g.DrawString("rituraj.tech", $domainFont, $whiteBrush, 94, 515)

# Clean up
$srcImg.Dispose()

# Save to public and root images
$bmp.Save("c:\Developer\rituraj\public\images\og-card.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Save("c:\Developer\rituraj\images\og-card.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()

Write-Output "SUCCESS: og-card.jpg generated"
