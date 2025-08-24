$port = 8001
$url = "http://localhost:$port/"

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "Server started at $url"
Write-Host "Press Ctrl+C to stop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Determine file path
        $requestPath = $request.Url.AbsolutePath
        if ($requestPath -eq "/") {
            $filePath = Join-Path $PSScriptRoot "index.html"
        } else {
            $filePath = Join-Path $PSScriptRoot $requestPath.TrimStart('/')
        }
        
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            # Set content type based on file extension
            switch ($extension) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css" { $response.ContentType = "text/css; charset=utf-8" }
                ".js" { $response.ContentType = "application/javascript; charset=utf-8" }
                ".png" { $response.ContentType = "image/png" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".ico" { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "text/plain; charset=utf-8" }
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $errorContent = "File not found: $requestPath"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorContent)
            $response.StatusCode = 404
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
}
