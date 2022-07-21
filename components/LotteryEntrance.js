import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants/"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

// ** if error "nonce too high": metamask -> settings -> advanced -> reset account

// need to create a function that allows a player to enter the lottery
// using the useWeb3Contract hook to make calls to the contract/read from state

export default function LotteryEntrance() {
    // moralis knows the chain we are on because in the header component, it passes up the information about metamask to the moralis provider
    // then moralis provider passes it down to all the components inside the MoralisProvider tags in _app.js

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() // returns hex version of chainId
    const chainId = parseInt(chainIdHex)

    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0") // change in state will effect a rerender
    const [numPlayers, setNumPlayers] = useState("0") // change in state will effect a rerender
    const [recentWinner, setRecentWinner] = useState("0") // change in state will effect a rerender

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        // try to read entrance fee
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1) // this is what actually waits for the tx to be confirmed
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            icon: "bell",
            position: "topR",
        })
    }

    // {**onSuccess checks to see if tx sent on metamask**}

    return (
        <div className="p-5">
            <h1>Lottery Entrance</h1>
            {raffleAddress ? (
                <div>
                    <p>Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</p>
                    <p>Number of players: {numPlayers}</p>
                    <p>Recent Winner: {recentWinner}</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                // onComplete:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error), // should use for every runContractFunction
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                </div>
            ) : (
                <p>No raffle address detected</p>
            )}
        </div>
    )
}
