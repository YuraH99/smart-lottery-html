import Head from "next/head"
// import Header from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our smart contract lottery" />
                <link />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
