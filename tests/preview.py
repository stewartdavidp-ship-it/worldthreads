"""Local browser-test preview; run from any directory with --port 8776."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewServer(ThreadingHTTPServer):
    # Cold browser contexts request many scripts, styles and collections together.
    request_queue_size = 128
    daemon_threads = True


class PreviewHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8776)
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(Path(__file__).resolve().parents[1]))
    with PreviewServer(("127.0.0.1", args.port), handler) as server:
        print(f"WorldThreads test preview: http://127.0.0.1:{args.port}", flush=True)
        server.serve_forever()
