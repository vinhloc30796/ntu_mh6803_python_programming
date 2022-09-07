import Head from 'next/head'
import { useState } from 'react';
import type { ReactElement } from 'react'
import { randomId } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { DateRangePicker } from '@mantine/dates';
import { TextInput, Grid, Button, Group } from '@mantine/core';
// Subpage
import type { NextPageWithLayout } from './_app'
import SubpageLayout from '../components/_subpage'
import CryptoForm from '../components/_form'


const Retire: NextPageWithLayout = () => {
    return <>
        <Head>
            <title>Retire</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <h1>Retire</h1>
        <CryptoForm/>
    </>
}

Retire.getLayout = function getLayout(page: ReactElement) {
    return (
      <SubpageLayout>{page}</SubpageLayout>
    )
}
  
export default Retire