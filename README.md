# Overview Flow

1. The unlock address is from a USDC token holder with enough tokens to fill the transaction

ganache-cli  -f <replace with Infura project ID> -d -i 66 --unlock 0xf584F8728B874a6a5c7A8d4d387C9aae9172D621 -l 8000000

2. Deploy and migrate contracts using network 'development'

3. Execute `node UnlockSwap`

4. Execute `node Add_To_Uniswap`

