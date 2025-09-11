#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        mimetype, encoding = mimetypes.guess_type(path)
        if mimetype is None:
            if path.endswith('.css'):
                mimetype = 'text/css'
            elif path.endswith('.js'):
                mimetype = 'application/javascript'
            elif path.endswith('.html'):
                mimetype = 'text/html'
        return mimetype, encoding

PORT = 8080
Handler = CustomHTTPRequestHandler

print(f"Starting server at http://localhost:{PORT}")
print("Press Ctrl+C to stop the server")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
