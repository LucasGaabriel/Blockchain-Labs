import hashlib
import json
import pprint
from time import time

class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_transactions = []

        # Criar o bloco gênesis
        self.new_block(previous_hash='1', proof=100)

    def new_block(self, proof, previous_hash=None, mining_time=0):
        """
        Cria um novo bloco na Blockchain
        :param proof: <int> A prova fornecida pelo PoW
        :param previous_hash: (Opcional) <str> Hash do bloco anterior
        :return: <dict> Novo bloco
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
            'mining_time': mining_time,
        }

        # Reinicia a lista de transações atuais
        self.current_transactions = []
        self.chain.append(block)
        
        return block
    
    def new_transaction(self, sender, recipient, amount):
        """
        Cria uma nova transação para ir para o próximo bloco minerado
        :param sender: <str> Endereço do remetente
        :param recipient: <str> Endereço do destinatário
        :param amount: <int> Quantidade
        :return: <int> O índice do bloco que armazenará esta transação
        """
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })

        return self.last_block['index'] + 1
    
    @staticmethod
    def hash(block):
        """
        Cria um hash SHA-256 de um bloco
        :param block: <dict> Bloco
        :return: <str>
        """
        # Ordenando o dicionário (evitar hashes inconsistentes)
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()
    
    def proof_of_work(self, last_proof, difficulty=4):
        """
        Algoritmo de prova de trabalho:
        - Encontre um número p' tal que hash(pp') contenha 4 zeros à esquerda
        - p é a prova do bloco anterior , e p' é a nova prova
        :param last_proof: <int>
        :return: <int>
        """
        proof = 0
        target = "0" * difficulty
        while self.valid_proof(last_proof, proof, target) is False:
            proof += 1

        return proof

    @staticmethod
    def valid_proof(last_proof, proof, target):
        """
        Valida a prova: verifica se hash(last_proof, proof) contém 4 zeros à esquerda
        :param last_proof: <int> Prova anterior
        :param proof: <int> Prova atual
        :return: <bool> TRUE se correto, FALSE se não
        """
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()

        return guess_hash[:len(target)] == target
    
    @property
    def last_block(self):
        return self.chain[-1]
    
    def valid_chain(self, difficulty=4):
        """
        Determine if a given blockchain is valid

        :param chain: <list> A blockchain
        :return: <bool> True if valid, False if not
        """
        prev_block = self.chain[0]
        current_index = 1
        target = "0" * difficulty

        while current_index < len(self.chain):
            block = self.chain[current_index]
            
            # print(f'{prev_block}')
            # print(f'{block}')
            # print("\n-----------\n")
            
            # Check that the hash of the block is correct
            if block['previous_hash'] != self.hash(prev_block):
                return False

            # Check that the Proof of Work is correct
            if not self.valid_proof(prev_block['proof'], block['proof'], target):
                return False

            prev_block = block
            current_index += 1

        return True
    
    def mine(self, miner_address="nakamoto", difficulty=4):
        # Registrar o tempo de início
        start_time = time()
        
        # Executamos o pow para obter a próxima prova...
        last_block = self.last_block
        proof = self.proof_of_work(last_block["proof"], difficulty)
        
        # Registrar o tempo de fim e calcular o tempo de mineração
        end_time = time()
        mining_time = end_time - start_time

        # Devemos receber uma recompensa por encontrar a prova.
        # Por enquanto, não estamos em rede, então o único beneficiário é ELE
        # O remetente é "0" para significar que este nó minerou uma nova moeda.
        self.new_transaction(
            sender="0",
            recipient=miner_address,
            amount=1,
        )

        # Minera o novo bloco adicionando-o à cadeia
        previous_hash = Blockchain.hash(last_block)
        self.new_block(proof, previous_hash, mining_time)

# Função para criar e exibir uma blockchain com 20 blocos
def create_blockchain():

    ####### Configurações iniciais #######
    bc = Blockchain()
    miner = "miner_address"
    difficulty = 4
    ######################################
    
    # Gerar 20 blocos
    for _ in range(19):
        bc.new_transaction(sender="Alice", recipient="Bob", amount=10)
        bc.mine(miner, difficulty)
        
    total_time = 0 # Calcular o tempo total de mineração

    # Exibir a cadeia de blocos
    print("\n--- Blockchain (Formato Detalhado) ---\n")
    pprint.pprint(bc.chain)

    print("\n--- Blockchain (Resumo Tabular) ---\n")
    print("Index | Timestamp         | Transactions | Proof     | Previous Hash | Mining Time (s)")
    
    for block in bc.chain:
        total_time += block['mining_time']
        print(
            f"{block['index']:>5} | {block['timestamp']:.6f} | {len(block['transactions']):>12} | "
            f"{block['proof']:>9} | {block['previous_hash'][:10]:>10}... | {block['mining_time']:.6f}"
        )
        
    print("\n--- Blockchain (Validade) ---\n")
    print(f"Blockchain válida: {bc.valid_chain(difficulty)}")
    
    # Tempo médio
    avg_time = total_time / len(bc.chain)
    print(f"\nTempo médio de mineração: {avg_time:.6f} segundos")
    print(".\n.\n.\n")

# Execução do Programa
if __name__ == "__main__":
    create_blockchain()
