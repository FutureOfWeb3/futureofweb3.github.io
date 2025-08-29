$http = [System.Net.HttpListener]::new() 
$http.Prefixes.Add("http://localhost:8000/")
$http.Start()

Write-Host "Server running at http://localhost:8000/"

while ($http.IsListening) {
    $context = $http.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $path = $request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }
    
    $filePath = Join-Path $PSScriptRoot $path.TrimStart('/')
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = switch ([System.IO.Path]::GetExtension($filePath)) {
            ".html" { "text/html" }
            ".css" { "text/css" }
            ".js" { "application/javascript" }
            ".png" { "image/png" }
            ".jpg" { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            default { "text/plain" }
        }
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $errorContent = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found")
        $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
    }
    
    $response.OutputStream.Close()
}
