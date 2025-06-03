# Upgradable Smart Contract Learning

[ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) を利用した Upgradable Smart Contract について理解を深めるためのリポジトリです。



## 簡単まとめ

- contract が持つ永続データは storage という領域に保存されており、 slot 単位で管理されている。
- どのメンバにどこの storage slot が割り当てられるかは Solidity コンパイラが決めている。
- `eth_getStorageAt` を使えば private 宣言した変数の中身も見える。
- inline assembly で slot を直接指定するやり方も存在する。
- Implementation contract を更新する際は変数の宣言順に注意する。



## 目次

- [A001 eth_getStorageAt を使って storage の値を見てみよう](./A001.md)
- [A002 アライメントされている slot の値を見てみよう](A002.md)
- [A003 slot を直接指定してみよう](A003.md)
- [A004 Proxy Contract が持っている storage slot の値を確認しよう](A004.md)
- [A005 ERC-1967 を見てみよう](A005.md)



## 参考

- https://eips.ethereum.org/EIPS/eip-1967
- https://zenn.dev/cryptogames/articles/fc7d8e876d3d0e
- https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/
- https://www.alchemy.com/docs/smart-contract-storage-layout
- https://ethereum.org/ja/developers/docs/apis/json-rpc/#eth_getstorageat
