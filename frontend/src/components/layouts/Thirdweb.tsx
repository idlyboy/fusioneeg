// "use client"

// import dynamic from "next/dynamic"
// import { ReactNode } from "react"

// const ThirdwebProviderDynamic = dynamic(
//     () => import("@thirdweb-dev/react").then((mod) => mod.ThirdwebProvider),
//     {ssr : false}
// )

// interface Props {
//     children: ReactNode
// }

// const ThirdwebWrapper: React.FC<Props> = ({children}) => {
//     return(
//         <ThirdwebProviderDynamic clientId="db14d94e7825ec7bcef54dbc81d86561" activeChain={"ethereum"}>
//             {children}
//         </ThirdwebProviderDynamic>
//     )
// }

// export default ThirdwebWrapper