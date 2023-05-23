import { default as Web3} from "web3";
import votingByToken from '../../build/contracts/VotingByToken.json';

let votingByTokenInstance;
let web3js;
let sendFrom;
let candidateNames = ["Alice", "Bob", "Cary"];
let candidates = {
    "Alice": "candidate-01",
    "Bob": "candidate-02",
    "Cary": "candidaite-03"
}

function getStates() {
    (async() => {
        // get Token for sale
        votingByTokenInstance.methods.tokenBalance().call(function(error, res) {
            if(!error) {
                $("#" + "tokens-total").html(res.toString());
            }
        })
        // get Token sold
        votingByTokenInstance.methods.totalSold().call(function(error, res) {
            if(!error) {
                $("#" + "tokens-sold").html(res.toString());
            }
        })
        // get Price per token
        votingByTokenInstance.methods.tokenPrice().call(function(error, res) {
            if(!error) {
                $("#" + "token-cost").html(res.toString());
            }
        })
        // get Balance in the contract
        $("#" + "contract-balance").html(await web3js.eth.getBalance('0xB86eA332798e0021e70F37e5160914D221677100'))
        // get Votes for each candidate
        for(let i = 0; i < candidateNames.length; i++) {
            votingByTokenInstance.methods.totalVotesFor(candidateNames[i]).call(function(error, res) {
                let name = candidateNames[i]
                    $("#" + candidates[name]).html(res); 
                })    
            }     
    })()
}

async function getAccount() {
    web3js.eth.getAccounts(function(error, res) {
        sendFrom = res[0];
    })
}

$(document).ready(function() {
    (async function() {
        // web3ÊµÀý
        var web3Provider
        if(window.ethereum) {
            web3Provider = window.ethereum;
            try{
                await window.ethereum.enable();
            } catch (error) {
                console.error("User denied account access");
            }
        }
        web3js = new Web3(web3Provider);
        votingByTokenInstance = new web3js.eth.Contract(votingByToken.abi, '0xB86eA332798e0021e70F37e5160914D221677100');
        // candidates
        Object.keys(candidates).forEach(function(candidateName) {
            $("#candidate-rows").append("<tr><td>" + candidateName + "</td><td id='" + candidates[candidateName] + "'></td></tr>")
        })
        getStates();
    })()
})
// buy Token
window.buyTokens = async function() {
    try{
        let Value = $("#buy").val();
        //$("#buy").val("");
        await getAccount();
        votingByTokenInstance.methods.buy().send({
            from: sendFrom,
            to: '0xB86eA332798e0021e70F37e5160914D221677100',
            value: Value
    }, function(error, res) {
            console.log(Value)
            getStates();
        })
    } catch (error) {
        console.error(error);
    }
}
// vote
window.voteForCandidate = async function() {
    try{
        let candidate = $("#candidate").val();
        let voteTokens = $("#vote-tokens").val();
        await getAccount();
        votingByTokenInstance.methods.voteForCandidate(candidate, voteTokens).send({
            from: sendFrom,
            to: '0xB86eA332798e0021e70F37e5160914D221677100'
        }, function(error, res) {
            console.log(candidate, voteTokens)
            //getStates();
        })
    } catch (error) {
        console.error(error);
    }
}
// look up voterInfo
window.lookupVoterInfo = function() {
    try{
        let voterAddress = $("#voter-info").val();
        votingByTokenInstance.methods.voterDetails(voterAddress).call(function(error, res) {
            console.log("voterAddress: ", voterAddress);
            console.log("tokenNum: ", res[0]);
            let arr = res[1];
            if(arr.length != 0) {
                for(let i = 0; i < arr.length; i++) {
                    console.log(candidateNames[i], ": ", arr[i]);
                }
            } else {
                console.log("voter didn`t vote for anyone")
            }
        })
    } catch (error) {
        console.error(error);
    }
}
