import { useMoralis } from "react-moralis"
import { useEffect } from "react"

// showing how web3uikit basically works behind the scenes
// like learning derivatives first before the shortcuts

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    // this is to fix the connect button returning to connect on each refresh
    useEffect(() => {
        if (isWeb3Enabled) return // if already connected, then do nothing
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                // if connected key exists in localStorage
                enableWeb3() // this keeps the button saying our address
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                // if null can assume they have disconnected
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading} // disabled if metamask is open/loading
                >
                    Connect
                </button>
            )}
        </div>
    )
}
