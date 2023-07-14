// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VotingByToken {
    //ͶƱ��
    struct voter {
        //ͶƱ�˵�ַ
        address voterAddress;
        //ͶƱ����
        uint256 tokenNum;
        //ͶƱ�б�
        uint256[] tokensVoteForCandidates;
    } 
    //�ܹ�token����
    uint256 public totalTokens;
    //token���
    uint256 public tokenBalance;
    //token�ļ�Ǯ
    uint256 public tokenPrice;
    //��ͶƱ���б�
    string[] candidateList;
    //��ͶƱ�˵�Ʊ��
    mapping(string => uint256) public votesReceived;
    //ͶƱ������
    mapping(address => voter) public voterInfo;

    constructor(uint256 totalSupply, uint256 price, string[] memory candidateNames) {
        totalTokens = totalSupply;
        tokenBalance = totalSupply;
        tokenPrice = price;
        candidateList = candidateNames;
    }

    event voterDetail(string, uint256);

    //���ݴ����eth����token
    function buy() public payable returns (uint256) {
        uint256 tokensToBuy = msg.value / tokenPrice;
        require(tokensToBuy > 0, "you didn`t give enough money");
        require(tokensToBuy <= tokenBalance, "we don`t have enough money");
        voterInfo[msg.sender].voterAddress = msg.sender;
        voterInfo[msg.sender].tokenNum += tokensToBuy;
        tokenBalance -= tokensToBuy;
        return tokensToBuy;
    }

    //ͶƱ
    function voteForCandidate(string memory candidate, uint256 voteTokens) public {
        int256 index = indexOfCandidate(candidate);
        require(index != int256(-1), "not correct candidate");
        if (voterInfo[msg.sender].tokensVoteForCandidates.length == 0) {
            for (uint256 i = 0; i < candidateList.length; i++) {
                voterInfo[msg.sender].tokensVoteForCandidates.push(0);
            }
        }
        uint256 availableTokens = voterInfo[msg.sender].tokenNum - totalUsedTokens(voterInfo[msg.sender].tokensVoteForCandidates);
        require(availableTokens >= voteTokens, "voteToken excceed");
        votesReceived[candidate] += voteTokens;
        voterInfo[msg.sender].tokensVoteForCandidates[uint256(index)] += voteTokens;
    }

    //��鱻ͶƱ���Ƿ��ڱ�ͶƱ�б����ڷ�������ֵ
    function indexOfCandidate(string memory candidate) internal view returns (int256) {
        for (uint256 i = 0; i < candidateList.length; i++) {
            if (
                keccak256(abi.encodePacked(candidate)) ==
                keccak256(abi.encodePacked(candidateList[i]))
            ) return int256(i);
        }
        return int256(-1);
    }

    //ͶƱ�˵���Ͷ����Ʊ��
    function totalUsedTokens(uint256[] memory votesForCandidate) internal pure returns (uint256) {
        uint256 totalToken = 0;
        for (uint256 i = 0; i < votesForCandidate.length; i++) {
            totalToken += votesForCandidate[i];
        }
        return totalToken;
    }

    //��ѯ��ͶƱ�˵�Ʊ������
    function tokenForCandidates() public {
        for (uint256 i = 0; i < candidateList.length; i++) {
            emit voterDetail(candidateList[i], votesReceived[candidateList[i]]);
        }
    }

    function totalVotesFor(string memory candidate) public view returns (uint256) {
        return votesReceived[candidate];
    }

    //����Token����
    function totalSold() public view returns (uint256) {
        return totalTokens - tokenBalance;
    }

    //��ѯͶƱ������
    function voterDetails(address voteradd) public view returns (uint256, uint256[] memory) {
        return (
            voterInfo[voteradd].tokenNum,
            voterInfo[voteradd].tokensVoteForCandidates
        );
    }

    //��ѯ���б�ͶƱ��
    function allCandidate() public view returns (string[] memory) {
        return candidateList;
    }
}