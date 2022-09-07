import Head from 'next/head'
import type { ReactElement } from 'react'
// Subpage
import type { NextPageWithLayout } from './_app'
import SubpageLayout from '../components/_subpage'

const Prices: NextPageWithLayout = () => {
    return <>
        <Head>
            <title>Prices</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <h1>Prices</h1>
    </>
}

Prices.getLayout = function getLayout(page: ReactElement) {
    return (
      <SubpageLayout>{page}</SubpageLayout>
    )
}
  
export default Prices