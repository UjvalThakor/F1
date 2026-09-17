import http.server
import json
import base64
import os
import io
from PIL import Image

PORT = 9876
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, 'static', 'images', 'helmet_redbull')
os.makedirs(OUTPUT_DIR, exist_ok=True)

class CaptureHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/save_frame':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode('utf-8'))
            
            frame_idx = payload['frame'] # 1-indexed (1..N)
            img_b64 = payload['image']
            if ',' in img_b64:
                img_b64 = img_b64.split(',', 1)[1]
            
            img_bytes = base64.b64decode(img_b64)
            img = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
            
            # Save as WebP with high quality and fast method 4
            filename = f"frame_{frame_idx:04d}.webp"
            out_path = os.path.join(OUTPUT_DIR, filename)
            img.save(out_path, 'WEBP', quality=95, method=4)
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'frame': frame_idx, 'size': os.path.getsize(out_path)}).encode('utf-8'))
            if frame_idx % 10 == 0 or frame_idx in [1, 180]:
                print(f"[CaptureServer] Saved frame {frame_idx:04d}: {os.path.getsize(out_path)} bytes")

        elif self.path == '/done':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status": "complete"}')
            print("[CaptureServer] All frames captured successfully!")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Quiet ordinary static GET logging
        if 'POST' in args[0]:
            pass
        elif 'GET /static/capture_turntable.html' in args[0]:
            print(f"[CaptureServer] Serving turntable capture UI")

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), CaptureHandler)
    print(f"[CaptureServer] Listening on http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
