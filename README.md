# votingByTokenSystem
这个项目实现了通过购买 token 来为候选者投票的功能，一共有三个文件夹，分别是：app、contracts、migrations
## app
app 文件夹里实现了一个简单的前端页面，以及我们通过 javascript 来操纵前后端交互，主要利用了 ether.js v6.0
## contracts
contracts 文件夹里是项目的主要逻辑，用 Solidity 编写
## migrations
migrations 文件夹里是部署合约的 js 文件，在truffle 中通过这个文件让合约上链
