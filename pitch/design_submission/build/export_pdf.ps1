param([string]$In, [string]$Out)
$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Open($In, $true, $false, $false)
$pres.SaveAs($Out, 32)
$pres.Close()
$pp.Quit()
