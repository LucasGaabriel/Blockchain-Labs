import hashlib
from itertools import cycle
from shutil import get_terminal_size
from threading import Thread
from time import sleep

class Loader:
    def __init__(self, desc="Loading...", end="Done!", timeout=0.1):
        """
        A loader-like context manager

        Args:
            desc (str, optional): The loader's description. Defaults to "Loading...".
            end (str, optional): Final print. Defaults to "Done!".
            timeout (float, optional): Sleep time between prints. Defaults to 0.1.
        """
        self.desc = desc
        self.end = end
        self.timeout = timeout

        self._thread = Thread(target=self._animate, daemon=True)
        self.steps = ["⢿", "⣻", "⣽", "⣾", "⣷", "⣯", "⣟", "⡿"]
        self.done = False

    def start(self):
        self._thread.start()
        return self

    def _animate(self):
        for c in cycle(self.steps):
            if self.done:
                break
            print(f"\r{self.desc} {c}", flush=True, end="")
            sleep(self.timeout)

    def __enter__(self):
        self.start()

    def stop(self):
        self.done = True
        cols = get_terminal_size((80, 20)).columns
        print("\r" + " " * cols, end="", flush=True)
        print(f"\r{self.end}", flush=True)

    def __exit__(self, exc_type, exc_value, tb):
        # handle exceptions with those variables ^
        self.stop()

def find_hash_with_zeros(prefix, num_zeros):
    target = '0' * num_zeros
    nonce = 0

    with Loader(desc="Mining...", end="Hash found!"):
        while True:
            input_data = f"{prefix}{nonce}"
            hash_result = hashlib.sha256(input_data.encode()).hexdigest()
            
            if hash_result.startswith(target):
                return input_data, hash_result
            nonce += 1

### Configurações
prefix = "exemplo_de_prefixo"
num_zeros = 8

input_found, hash_found = find_hash_with_zeros(prefix, num_zeros)
print("Entrada:", input_found)
print("Hash SHA-256:", hash_found)
